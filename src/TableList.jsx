// @人员管理-人员清单
import { $ExportExcel } from '@/utils/common';
import { RedoOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Dropdown, Menu, message, Modal } from 'antd';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormattedMessage, useIntl, useModel } from 'umi';
import { getTeamList, batchChangeTeamStatus } from '@/services/swagger/eservice';

const TableList = (props, ref) => {
  // useImperativeHandle(ref, () => ({
  //   renderTable: (pagination, queryParam, activeKey) => {
  //     function getUserStatus() {
  //       let user_status = 1;
  //       if (activeKey == 'tab1') {
  //         user_status = 1;
  //       }
  //       if (activeKey == 'tab2') {
  //         user_status = 0;
  //       }
  //       if (props.deletable) {
  //         user_status = -1;
  //       }
  //       if (props.recycleBin) {
  //         user_status = -1;
  //       }
  //       return user_status;
  //     }
  //     const tableParam = {
  //       jsonData: {
  //         currentwhere: queryParam.length ? JSON.stringify(queryParam) : [],
  //         ...pagination,
  //         sorting: 'user_guid',
  //         sortdir: 'asc',
  //         user_status: getUserStatus(),
  //       },
  //     };
  //     tabCount(tableParam).then((tableCount) => {
  //       setTabsData(() => {
  //         return tableCount?.data || {};
  //       });
  //     });
  //     getUserMgtUserList(tableParam).then((res) => {
  //       if (res) {
  //         setTotalCount(() => {
  //           return res.data?.totalRows || 0;
  //         });
  //         setTableData(() => {
  //           return res.data?.list || [];
  //         });
  //       }
  //     });
  //   },
  // }));
  const intl = useIntl();
  const actionRef = useRef();
  const { LAYOUTMARGIN, PRIMARYCOLOR } = useModel('Constant');
  const [currentRow, setCurrentRow] = useState();
  const [showDetail, setShowDetail] = useState(false);
  const queryParam = useMemo(() => props.queryParam, [props.queryParam]);
  const { columns } = props;
  const [createModalVisible, handleModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    currentpageindex: 1,
    pagesize: 20,
  });
  const [sortParam, setSortParam] = useState({
    sorting: 'team_guid',
    sortdir: 'asc',
  });
  const [totalCount, setTotalCount] = useState([]);
  const [activeKey1, setActiveKey1] = useState('tab1');
  //toolBar更多按钮
  const toolBarMoreMenu = () => {
    let items = [];
    items = [
      {
        key: 'batch',
        label: (
          <a
            onClick={() => {
              onBatchHandle();
            }}
          >
            批量无效
          </a>
        ),
      },
      {
        key: 'export',
        label: (
          <a
            onClick={() => {
              onExport();
            }}
          >
            {intl.formatMessage({ id: 'pages.export', defaultMessage: 'Export' })}
          </a>
        ),
      },
    ];

    return <Menu items={items} />;
  };

  /**
   * 批量操作
   */
  function onBatchHandle() {
    if (selectedRowsState.length < 2) {
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.usermanage.batch.tip',
        defaultMessage: '批量操作数据至少选择2条',
      });
      message.success(defaultLoginSuccessMessage);
    } else {
      let teamArr = [];
      teamArr = selectedRowsState.map((i) => {
        return "'" + i.Team_GUID + "'";
      });
      // 批量无效
      const reqData = {
        sysrsc_no: 'TREE299',
        menursc_no: 'TREE299_01',
        handlersc_no: 'BTN_001',
        team_status: '0',
        team_guid_str: teamArr.toString(),
      };
      const validateConfirm = Modal.confirm({
        title: intl.formatMessage({
          id: 'pages.usermanage.confirmBatchInvalidate',
          defaultMessage: '您确定要无效选中行吗？',
        }),
        onOk: async function () {
          const res = await batchChangeTeamStatus(reqData);
          if (res.success) {
            const defaultLoginSuccessMessage = intl.formatMessage({
              id: 'pages.usermanage.batchInvalidate.success',
              defaultMessage: '批量无效成功！',
            });
            message.success(defaultLoginSuccessMessage);
            renderTable(pagination, queryParam);
            validateConfirm.destroy();
          }
        },
      });
    }
  }
  // 刷新
  function refreshTable() {
    renderTable(pagination, queryParam);
  }

  const options = { setting: true, reload: false, density: false };
  // 我的待处理 toolBar
  const toolbar = {
    menu: {
      type: 'inline', // inline | dropdown | tab
      activeKey: activeKey1,
      items: [
        {
          key: 'tab1',
          label: (
            <span style={{ position: 'relative' }}>
              {props.teamList ? '团队列表' : '工单数据列表'}
            </span>
          ),
        },
      ],
      onChange: (key) => {
        setActiveKey1(key);
      },
    },
    actions: [
      <RedoOutlined
        key="refresh"
        style={{
          fontSize: '16px',
          color: '#666',
          transform: 'rotate(-110deg)',
          marginRight: '8px',
        }}
        onClick={() => {
          refreshTable();
        }}
      />,
      <Dropdown overlay={() => toolBarMoreMenu()} placement="bottomRight" arrow key="more">
        <UnorderedListOutlined />
      </Dropdown>,
    ],
  };
  const paginationChange = useCallback((pageInfo, sorter) => {
    if (sorter.order == 'ascend') {
      setSortParam(() => {
        return {
          sorting: sorter.columnKey,
          sortdir: 'asc',
        };
      });
    } else if (sorter.order == 'descend') {
      setSortParam(() => {
        return {
          sorting: sorter.columnKey,
          sortdir: 'desc',
        };
      });
    }
    setPagination(() => {
      return {
        currentpageindex: pageInfo.current,
        pagesize: pageInfo.pageSize,
      };
    });
  }, []);

  /**
   * 导出
   */
  async function onExport() {
    const sheet_name_res = '团队列表';
    const params = {
      jsonData: {
        currentwhere: queryParam,
        sorting: 'team_guid',
        sortdir: 'asc',
        sheet_name_res: intl.formatMessage({
          id: sheet_name_res,
          defaultMessage: '',
        }),
        no_res: '团队ID',
        name_res: '团队名称',
        prv_res: '权限',
      },
    };
    $ExportExcel(
      intl.formatMessage({
        id: sheet_name_res,
        defaultMessage: '',
      }),
      params,
      '/eserviceapi/teamuser/exportExcel',
    );
    return false;
  }

  /**
   * 请求列表数据
   */
  function renderTable(pagination, queryParam) {
    // 团队维护列表（有效|无效）
    if (props.teamList) {
      function getTeamStatus() {
        let team_status = 1;
        if (props.invalidTeam) {
          team_status = '0';
        }
        return team_status;
      }
      const tableParam = {
        jsonData: {
          currentwhere: queryParam.length ? JSON.stringify(queryParam) : [],
          ...pagination,
          ...sortParam,
          team_status: getTeamStatus(),
        },
      };
      getTeamList(tableParam).then((res) => {
        if (res.success) {
          setTotalCount(() => {
            return res.data?.totalRows || 0;
          });
          setTableData(() => {
            return res.data?.list || [];
          });
        }
      });
    } else {
      setTableData(() => {
        var arr = [];
        for (let i = 0; i < 12; i += 1) {
          arr.push({
            No: 'R00' + i,
            name: '工单名称' + i,
            type: '工单A类型',
            company: '云南白药',
            project: '**********************',
            createTime: '2022-07-22 14:00',
            mindDay: i,
            planDate: '2022-07-22',
            completedTime: '2022-07-22',
            status: '0',
            master: '小红',
          });
        }
        return arr;
      });
    }
  }
  /**
   * 批量删除（Footer）
   */
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
    renderTable(pagination, queryParam);
  }, [pagination, queryParam]);

  return (
    <div
      style={{
        margin: `${LAYOUTMARGIN} -8px -8px`,
        backgroundColor: '#fff',
        minHeight: document.body.clientHeight - 48 - 94 - 62 - 40,
      }}
    >
      <ProTable
        actionRef={actionRef}
        rowKey={props.teamList ? (tableData) => tableData.Team_No : tableData.name}
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
        toolbar={toolbar}
        options={options}
        columnsState={{
          persistenceType: 'localStorage',
          persistenceKey: 'pages_usermanage',
        }}
        onChange={(pagination, filters, sorter) => {
          paginationChange(pagination, sorter);
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
