import ImportFile from '@/components/ImportFile';
import {
  getUserMgtUserList,
  batchChangeUserStatus,
  batchDeleteUser,
  batchRestoreUser,
  exportUserInfo,
} from '@/services/swagger/user';
import { getUser } from '@/services/ant-design-pro/api';
import { tabCount } from '@/services/ant-design-pro/demo';
import { UnorderedListOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Badge, Button, Drawer, Dropdown, Menu, message, Modal } from 'antd';
import InvalidateConfirmModal from './InvalidateConfirmModal';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { FormattedMessage, useIntl, useModel } from 'umi';

const TableList = (props, ref) => {
  useImperativeHandle(ref, () => ({
    renderTable: (pagination, queryParam, activeKey) => {
      function getUserStatus() {
        let user_status = 1;
        if (activeKey == 'tab1') {
          user_status = 1;
        }
        if (activeKey == 'tab2') {
          user_status = 0;
        }
        if (props.deletable) {
          user_status = -1;
        }
        if (props.recycleBin) {
          user_status = -1;
        }
        return user_status;
      }
      const tableParam = {
        jsonData: {
          currentwhere: queryParam.length ? JSON.stringify(queryParam) : [],
          ...pagination,
          sorting: 'user_guid',
          user_status: getUserStatus(),
          sortdir: 'asc',
          user_status: getUserStatus(),
        },
      };
      tabCount(tableParam).then((tableCount) => {
        setTabsData(() => {
          return tableCount.data;
        });
      });
      getUserMgtUserList(tableParam).then((res) => {
        if (res) {
          setTotalCount(() => {
            return res.data?.totalRows || 0;
          });
          setTableData(() => {
            return res.data?.list || [];
          });
        }
      });
    },
  }));
  const intl = useIntl();
  const { reasonModalVisible, setReasonModalVisible } = useModel('UserManageModel');
  const actionRef = useRef();
  const { LAYOUTMARGIN, PRIMARYCOLOR } = useModel('Constant');
  const [currentRow, setCurrentRow] = useState();
  const [showDetail, setShowDetail] = useState(false);
  const queryParam = useMemo(() => props.queryParam, [props.queryParam]);
  const activeKey = useMemo(() => props.activeKey, [props.activeKey]);
  const { columns } = props;
  const [createModalVisible, handleModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    currentpageindex: 1,
    pagesize: 20,
  });
  const [totalCount, setTotalCount] = useState([]);
  const [tabsData, setTabsData] = useState({});

  const renderBadge = (count, active = false) => {
    return (
      <Badge
        count={count}
        style={{
          marginTop: -2,
          marginLeft: 4,
          color: active ? PRIMARYCOLOR : '#999',
          backgroundColor: active ? '#E6F7FF' : '#eee',
        }}
      />
    );
  };

  //批量状态改变
  /* status: 0 无效; 1 有效; -1 可删除 */
  function onBatchSetUserStatus(toStatus) {
    if (selectedRowsState.length < 2) {
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.usermanage.batch.tip',
        defaultMessage: '批量操作数据至少选择2条',
      });
      message.success(defaultLoginSuccessMessage);
    } else {
      let userArr = [];
      userArr = selectedRowsState.map((i) => {
        return "'" + i.User_GUID + "'";
      });
      // 批量无效
      if (toStatus == '0') {
        props.handleSelected(selectedRowsState);
      }
      // 批量有效
      if (toStatus == '1') {
        const reqData = {
          sysrsc_no: 'TREE001',
          menursc_no: 'TREE001_01',
          handlersc_no: 'ACTION005',
          user_status: 1,
          user_invalidreason: '',
          user_guid_str: userArr.toString(),
        };
        const validateConfirm = Modal.confirm({
          title: intl.formatMessage({
            id: 'pages.usermanage.confirmBatchValidate',
            defaultMessage: 'Are you sure validate selected rows?',
          }),
          onOk: async function () {
            const res = await batchChangeUserStatus(reqData);
            if (res.success) {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.batchValidate.success',
                defaultMessage: '批量有效成功！',
              });
              message.success(defaultLoginSuccessMessage);
              validateConfirm.destroy();
            }
          },
        });
      }
      // 批量删除
      if (toStatus == '2') {
        const reqData = {
          sysrsc_no: 'TREE001',
          menursc_no: 'TREE001_03',
          handlersc_no: 'ACTION002',
          user_guid_str:
            "'49f11933-a1a7-459e-ad05-f22414d46bf9','904cd32c-55ac-4791-a8bc-a887e1146eb3'", //李四
          user_guid: '',
        };
        const validateConfirm = Modal.confirm({
          title: intl.formatMessage({
            id: 'pages.usermanage.confirmBatchDelete',
            defaultMessage: 'Are you sure batch delete selected rows?',
          }),
          onOk: async function () {
            const res = await batchDeleteUser(reqData);
            if (res.success) {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.batchDel.success',
                defaultMessage: '批量删除成功！',
              });
              message.success(defaultLoginSuccessMessage);
              validateConfirm.destroy();
            }
          },
        });
      }
      // 批量恢复
      if (toStatus == '3') {
        const reqData = {
          sysrsc_no: 'TREE299',
          menursc_no: 'TREE299_01',
          handlersc_no: 'BTN_001',
          user_guid_str:
            "'49f11933-a1a7-459e-ad05-f22414d46bf9','904cd32c-55ac-4791-a8bc-a887e1146eb3'", //李四
          // user_guid_str: userArr.toString(),
          user_guid: '',
        };
        const validateConfirm = Modal.confirm({
          title: intl.formatMessage({
            id: 'pages.usermanage.confirmBatchRestore',
            defaultMessage: 'Are you sure restore selected rows?',
          }),
          onOk: async function () {
            const res = await batchRestoreUser(reqData);
            if (res.success) {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.batchRestore.success',
                defaultMessage: '批量恢复成功！',
              });
              message.success(defaultLoginSuccessMessage);
              validateConfirm.destroy();
            }
          },
        });
      }
    }
  }

  const [importModalVisible, setImportModalVisible] = useState(false);
  //导入
  function onImportUsers() {
    setImportModalVisible(() => true);
  }
  //导出
  async function onExportUsers(status) {
    const params = {
      jsonData: {
        currentwhere: [{ queryname: '', queryoperator: '', queryvalue: '' }],
        sorting: 'user_guid',
        sortdir: 'asc',
        sheet_name_res: 'sheet名的资源',
        no_res: '用户ID的资源',
        name_res: '姓名的资源',
        email_res: '邮箱资源',
        type_res: '类型资源',
        status_res: '状态资源',
        user_status: status === 0 ? '1' : status === 1 ? '0' : status === 2 ? '-1' : '-2',
      },
    };
    const res = await exportUserInfo(params);
    if (res.success) {
      // document.location.href = res.data;
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.usermanage.export.success',
        defaultMessage: '导出成功！',
      });
      message.success(defaultLoginSuccessMessage);
    } else {
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.usermanage.export.false',
        defaultMessage: '导出失败！',
      });
      message.success(defaultLoginSuccessMessage);
    }
  }
  const toolBarMoreMenu = () => {
    let items = [];
    activeKey == 'tab1'
      ? (items = [
          {
            key: 'invalid',
            label: (
              <a
                onClick={() => {
                  onBatchSetUserStatus(0); //批量无效
                }}
              >
                {intl.formatMessage({
                  id: 'pages.usermanage.batchInvalidate',
                  defaultMessage: 'Batch Invalidate',
                })}
              </a>
            ),
          },
          {
            key: 'import',
            label: (
              <a onClick={onImportUsers}>
                {intl.formatMessage({ id: 'pages.import', defaultMessage: 'Import' })}
              </a>
            ),
          },
          {
            key: 'export',
            label: (
              <a
                onClick={() => {
                  onExportUsers(0);
                }}
              >
                {intl.formatMessage({ id: 'pages.export', defaultMessage: 'Export' })}
              </a>
            ),
          },
        ])
      : activeKey == 'tab2'
      ? (items = [
          {
            key: 'valid',
            label: (
              <a
                onClick={() => {
                  onBatchSetUserStatus(1); //批量有效
                }}
              >
                {intl.formatMessage({
                  id: 'pages.usermanage.batchValidate',
                  defaultMessage: 'Batch Validate',
                })}
              </a>
            ),
          },
          {
            key: 'export',
            label: (
              <a
                onClick={() => {
                  onExportUsers(1);
                }}
              >
                {intl.formatMessage({ id: 'pages.export', defaultMessage: 'Export' })}
              </a>
            ),
          },
        ])
      : props.deletable
      ? (items = [
          {
            key: 'delete',
            label: (
              <a
                onClick={() => {
                  onBatchSetUserStatus(2); //批量删除
                }}
              >
                {intl.formatMessage({
                  id: 'pages.usermanage.del',
                  defaultMessage: 'Batch Deletion',
                })}
              </a>
            ),
          },
          {
            key: 'export',
            label: (
              <a
                onClick={() => {
                  onExportUsers(2);
                }}
              >
                {intl.formatMessage({ id: 'pages.export', defaultMessage: 'Export' })}
              </a>
            ),
          },
        ])
      : (items = [
          {
            key: 'restore',
            label: (
              <a
                onClick={() => {
                  onBatchSetUserStatus(3); //批量恢复
                }}
              >
                {intl.formatMessage({
                  id: 'pages.usermanage.batchRestore',
                  defaultMessage: 'Batch Restore',
                })}
              </a>
            ),
          },
          {
            key: 'export',
            label: (
              <a
                onClick={() => {
                  onExportUsers(3);
                }}
              >
                {intl.formatMessage({ id: 'pages.export', defaultMessage: 'Export' })}
              </a>
            ),
          },
        ]);

    return <Menu items={items} />;
  };

  const options = { setting: true, reload: false, density: false };
  const toolbar1 = {
    menu: {
      type: 'tab', // inline | dropdown | tab
      activeKey: activeKey,
      items: [
        {
          key: 'tab1',
          label: (
            <span>
              {intl.formatMessage({
                id: 'menu.console.user-manage.available-user',
                defaultMessage: '有效用户',
              })}
              {renderBadge(tabsData.tabCount1, activeKey === 'tab1')}
            </span>
          ),
        },
        {
          key: 'tab2',
          label: (
            <span>
              {intl.formatMessage({
                id: 'menu.console.user-manage.invalid-user',
                defaultMessage: '无效用户',
              })}
              {renderBadge(tabsData.tabCount2, activeKey === 'tab2')}
            </span>
          ),
        },
      ],
      onChange: (key) => {
        props.setTab(key);
        // setActiveKey(key);
      },
    },
    actions: [
      <Dropdown overlay={() => toolBarMoreMenu()} placement="bottomRight" arrow key="more">
        <UnorderedListOutlined />
      </Dropdown>,
    ],
  };
  const toolbar2 = {
    actions: [
      <Dropdown overlay={() => toolBarMoreMenu()} placement="bottomRight" arrow key="more">
        <UnorderedListOutlined />
      </Dropdown>,
    ],
  };
  const paginationChange = useCallback((pageInfo) => {
    setPagination(() => {
      return {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
      };
    });
  }, []);

  // 导入成功 刷新列表
  function afterImported() {
    renderTable(pagination, queryParam, activeKey);
  }

  // 请求列表数据;
  function renderTable(pagination, queryParam, activeKey) {
    console.log(queryParam, 88);
    function getUserStatus() {
      let user_status = 1;
      if (activeKey == 'tab1') {
        user_status = 1;
      }
      if (activeKey == 'tab2') {
        user_status = 0;
      }
      if (props.deletable) {
        user_status = -1;
      }
      if (props.recycleBin) {
        user_status = -2;
      }
      return user_status;
    }
    const tableParam = {
      jsonData: {
        currentwhere: queryParam.length ? JSON.stringify(queryParam) : [],
        ...pagination,
        sorting: 'user_guid',
        user_status: getUserStatus(),
        sortdir: 'asc',
        user_status: getUserStatus(),
      },
    };
    tabCount(tableParam).then((tableCount) => {
      setTabsData(() => {
        return tableCount.data;
      });
    });
    getUserMgtUserList(tableParam).then((res) => {
      if (res) {
        setTotalCount(() => {
          return res.data?.totalRows || 0;
        });
        setTableData(() => {
          return res.data?.list || [];
        });
      }
    });
    // getUser(tableParam).then((datalist) => {
    //   setTotalCount(() => {
    //     return datalist?.total || 0;
    //   });
    //   setTableData(() => {
    //     return datalist?.data || [];
    //   });
    // });
  }
  function onFinishInvalidateReason(close) {
    if (close) {
      setReasonModalVisible(false);
    }
  }
  async function handleRemove(selectedRowsState) {
    const reqData = {
      sysrsc_no: 'TREE001',
      menursc_no: 'TREE001_03',
      handlersc_no: 'ACTION002',
      user_guid_str:
        "'49f11933-a1a7-459e-ad05-f22414d46bf9','904cd32c-55ac-4791-a8bc-a887e1146eb3'", //李四
      user_guid: '',
      user_status: '1',
    };
    const res = await batchDeleteUser(reqData);
    console.log(res);
  }
  useEffect(() => {
    renderTable(pagination, queryParam, activeKey);
  }, [pagination, queryParam, activeKey]);

  return (
    <div style={{ margin: `${LAYOUTMARGIN} -8px -8px` }}>
      <ProTable
        actionRef={actionRef}
        // rowKey="User_GUID"
        rowKey="key"
        search={false}
        dataSource={tableData}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          ...pagination,
          total: totalCount,
        }}
        toolbar={props.deletable || props.recycleBin ? toolbar2 : toolbar1}
        options={options}
        columnsState={{
          persistenceType: 'localStorage',
          persistenceKey: 'pages_usermanage',
        }}
        onChange={(pagination, filters, sorter) => {
          console.log('paginatioin changed');
          paginationChange(pagination);
          //  sizeChange(pagination);
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      {/* 导入的弹窗 */}
      <ImportFile
        visible={importModalVisible}
        visibleChange={(visible) => {
          setImportModalVisible(visible);
        }}
        afterImported={afterImported}
        action="http://dev.cims-medtech.com:892/V5.1.8/cdms/eCoderManager/File_Upload.ashx"
        query={{}}
      />

      {/* 新建的Modal弹窗 */}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      {/* <UpdateForm
      onSubmit={async (value) => {
        const success = await handleUpdate(value);

        if (success) {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);

          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      }}
      onCancel={() => {
        handleUpdateModalVisible(false);

        if (!showDetail) {
          setCurrentRow(undefined);
        }
      }}
      updateModalVisible={updateModalVisible}
      values={currentRow || {}}
    /> */}

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </div>
  );
};

export default forwardRef(TableList);
