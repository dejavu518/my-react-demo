import ImportFile from '@/components/ImportFile';
import { getUserMgtUserList } from '@/services/swagger/user';
import { getUser } from '@/services/ant-design-pro/api';
import { tabCount } from '@/services/ant-design-pro/demo';
import { UnorderedListOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Badge, Button, Drawer, Dropdown, Menu, Modal } from 'antd';
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
    if (toStatus == '0') {
      //无效信息录入弹窗
      setReasonModalVisible(true);
      console.log(reasonModalVisible);
      const reqData = {
        sysrsc_no: 'TREE001',
        menursc_no: 'TREE001_01',
        handlersc_no: 'ACTION004',
        user_status: 0,
        user_invalidreason: '',
      };

      //TODO 以下注释部分应该会移动到 ./InvalidateConfirmModal.jsx中, 以完成用户录入无效原因后,点击确认弹出确认提示框.
      // const invalidateConfirm = Modal.confirm({
      //   title: 'Do you Want to delete these items?',
      //   onOk: async function () {
      //     const res = await batchSetStatus(reqData);
      //     if (res.success) {
      //       invalidateConfirm.destroy();
      //     }
      //   },
      //   onCancel() {
      //     console.log('Cancel');
      //   },
      // });
    }
    if (toStatus == '1') {
      //确认框
      const reqData = {
        sysrsc_no: 'TREE001',
        menursc_no: 'TREE001_01',
        handlersc_no: 'ACTION005',
        user_status: 1,
        user_invalidreason: null,
      };
      const validateConfirm = Modal.confirm({
        title: intl.formatMessage({
          id: 'pages.usermanage.confirmValidate',
          defaultMessage: 'Are you sure validate selected rows?',
        }),
        onOk: async function () {
          const res = await batchSetStatus(reqData);
          if (res.success) {
            validateConfirm.destroy();
          }
        },
      });
    }
  }

  const [importModalVisible, setImportModalVisible] = useState(false);
  //导入
  function onImportUsers() {
    setImportModalVisible(() => true);
  }
  //导出
  function onExportUsers() {
    alert('clicked export users');
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
                  onBatchSetUserStatus(0);
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
              <a onClick={onExportUsers}>
                {intl.formatMessage({ id: 'pages.export', defaultMessage: 'Export' })}
              </a>
            ),
          },
        ])
      : (items = [
          {
            key: 'validate',
            label: (
              <a
                onClick={() => {
                  onBatchSetUserStatus(1);
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
              <a onClick={onExportUsers}>
                {intl.formatMessage({ id: 'pages.export', defaultMessage: 'Export' })}
              </a>
            ),
          },
        ]);
    return <Menu items={items} />;
  };

  const options = { setting: true, reload: false, density: false };
  const toolbar = {
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

  useEffect(() => {
    renderTable(pagination, queryParam, activeKey);
  }, [pagination, queryParam, activeKey]);

  return (
    <div style={{ margin: `${LAYOUTMARGIN} -8px -8px` }}>
      <ProTable
        actionRef={actionRef}
        rowKey="User_GUID"
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
        toolbar={props.deletable ? null : toolbar}
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
