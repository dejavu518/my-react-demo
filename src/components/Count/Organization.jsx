import MySearchCondition from '@/components/MyTable/components/MySearchCondition';
import {
  addOrganization,
  addPosition,
  batchDelPosition,
  delPosition,
  exportExcel,
  getOrganizationList,
  getPositionList,
} from '@/services/swagger/user';
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { FooterToolbar, PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Badge, Button, Drawer, Dropdown, Form, Input, Menu, message, Modal, Tree } from 'antd';
import { set } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl, useModel } from 'umi';
const rangePickerProps = {
  showTime: false,
};
const UserManage = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [isAddSub, setIsAddSub] = useState(false);
  const [isAddPosition, setIsAddPosition] = useState(false);
  const [modalTitle, setModalTitleb] = useState();
  const [isEditSub, setIsEditSub] = useState(false);
  const [positionData, setPositionData] = useState({});
  const [isEditPosition, setIsEditPosition] = useState(false);
  // <---树
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onSelect = (selectedKeysValue, info) => {
    setPositionData(() => {
      return {
        id: info.node.Organization_Code,
        name: info.node.Organization_Name,
        guid: info.node.Organization_GUID,
      };
    });
    setModalTitleb(() => {
      return info.node.Organization_Code + info.node.Organization_Name;
    });
    form.setFieldsValue({
      organization_code: info.node.Organization_Code,
      organization_name: info.node.Organization_Name,
    });
    if (info.selected) {
      setSelectedKeys(selectedKeysValue);
    }
  };
  useEffect(() => {
    getOrganizationList().then((res) => {
      if (res.code === 200) {
        function toTree(data) {
          data.forEach(function (item) {
            delete item.children;
          });
          var map = {};
          data.forEach(function (item) {
            map[item.Organization_GUID] = item;
          });
          var val = [];
          data.forEach(function (item) {
            var parent = map[item.Parent_GUID];
            if (parent) {
              (parent.children || (parent.children = [])).push(item);
            } else {
              val.push(item);
            }
          });
          return val;
        }
        setTreeData(() => {
          return toTree(res.data);
        });
      }
    });
  }, []);
  const companyMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a
              onClick={(e) => {
                setIsAddPosition(true);
              }}
            >
              <FormattedMessage id="pages.usermanage.addPosition" defaultMessage="添加职位" />
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a
              onClick={(e) => {
                console.log(e);
                setIsAddSub(true);
              }}
            >
              <FormattedMessage id="pages.usermanage.addSub" defaultMessage="添加子组织" />
            </a>
          ),
        },
        {
          key: '3',
          label: (
            <a
              onClick={(e) => {
                setIsEditSub(true);
              }}
            >
              <FormattedMessage id="pages.usermanage.editSub" defaultMessage="修改名称" />
            </a>
          ),
        },
        {
          key: '4',
          label: (
            <a
              onClick={(e) => {
                // delOrganization().then(res => {
                //   if (res.code === 204) {
                //     const defaultLoginSuccessMessage = intl.formatMessage({
                //       id: 'pages.usermanage.del.success',
                //       defaultMessage: '删除成功！',
                //     });
                //     message.success(defaultLoginSuccessMessage);
                //   } else {
                //     const defaultLoginSuccessMessage = intl.formatMessage({
                //       id: 'pages.usermanage.del.false',
                //       defaultMessage: '删除失败！',
                //     });
                //     message.success(defaultLoginSuccessMessage);
                //   }
                // })
                //   .catch((info) => {
                //     console.log('Validate Failed:', info);
                //   })
              }}
            >
              <FormattedMessage id="pages.usermanage.delSub" defaultMessage=" 删除" />
            </a>
          ),
        },
      ]}
    />
  );
  // 树--->

  const handleOk = (num) => {
    if (num === 1) {
      form
        .validateFields()
        .then((values) => {
          console.log(values);
          const jsonData = {
            sysrsc_no: 'TREE299',
            menursc_no: 'TREE299_01',
            handlersc_no: 'BTN_001',
            position_guid: '',
            organization_guid: selectedKeys[0],
            organization_tier: '1',
            position_code: '',
            position_name: values.position_name,
          };
          addPosition(jsonData).then((res) => {
            if (res.code === 204) {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.add.success',
                defaultMessage: '添加成功！',
              });
              message.success(defaultLoginSuccessMessage);
              setIsAddPosition(false);
            } else {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.add.false',
                defaultMessage: '添加失败！',
              });
              message.success(defaultLoginSuccessMessage);
            }
          });
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    } else if (num === 2) {
      form
        .validateFields()
        .then((values) => {
          console.log(values);
          const jsonData = {
            sysrsc_no: 'TREE299',
            menursc_no: 'TREE299_01',
            handlersc_no: 'BTN_001',
            organization_guid: '',
            parent_guid: selectedKeys[0],
            organization_tier: '1',
            organization_code: values.add_organization_code,
            organization_name: values.add_organization_name,
          };
          addOrganization(jsonData).then((res) => {
            if (res.code === 204) {
              getOrganizationList().then((res) => {
                if (res.code === 200) {
                  function toTree(data) {
                    data.forEach(function (item) {
                      delete item.children;
                    });
                    var map = {};
                    data.forEach(function (item) {
                      map[item.Organization_GUID] = item;
                    });
                    var val = [];
                    data.forEach(function (item) {
                      var parent = map[item.Parent_GUID];
                      if (parent) {
                        (parent.children || (parent.children = [])).push(item);
                      } else {
                        val.push(item);
                      }
                    });
                    return val;
                  }
                  setTreeData(() => {
                    return toTree(res.data);
                  });
                }
              });
              setIsAddSub(false);
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.add.success',
                defaultMessage: '添加成功！',
              });
              message.success(defaultLoginSuccessMessage);
            } else {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.add.false',
                defaultMessage: '添加失败！',
              });
              message.success(defaultLoginSuccessMessage);
            }
          });
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    } else if (num === 3) {
      form
        .validateFields()
        .then((values) => {
          console.log(values);
          const jsonData = {
            sysrsc_no: 'TREE299',
            menursc_no: 'TREE299_01',
            handlersc_no: 'BTN_001',
            organization_guid: positionData.guid,
            parent_guid: selectedKeys[0],
            organization_tier: '1',
            organization_code: values.organization_code,
            organization_name: values.organization_name,
          };
          addOrganization(jsonData).then((res) => {
            if (res.code === 204) {
              getOrganizationList().then((res) => {
                if (res.code === 200) {
                  function toTree(data) {
                    data.forEach(function (item) {
                      delete item.children;
                    });
                    var map = {};
                    data.forEach(function (item) {
                      map[item.Organization_GUID] = item;
                    });
                    var val = [];
                    data.forEach(function (item) {
                      var parent = map[item.Parent_GUID];
                      if (parent) {
                        (parent.children || (parent.children = [])).push(item);
                      } else {
                        val.push(item);
                      }
                    });
                    return val;
                  }
                  setTreeData(() => {
                    return toTree(res.data);
                  });
                }
              });
              setIsAddSub(false);
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.edit.success',
                defaultMessage: '修改成功！',
              });
              message.success(defaultLoginSuccessMessage);
            } else {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.edit.false',
                defaultMessage: '修改失败！',
              });
              message.success(defaultLoginSuccessMessage);
            }
            setIsEditSub(false);
          });
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    } else if (num === 4) {
      form
        .validateFields()
        .then((values) => {
          const jsonData = {
            sysrsc_no: 'TREE299',
            menursc_no: 'TREE299_01',
            handlersc_no: 'BTN_001',
            position_guid: positionData.PositionGUID,
            organization_guid: selectedKeys[0],
            organization_tier: '1',
            position_code: '',
            position_name: values.position_name,
          };
          addPosition(jsonData).then((res) => {
            if (res.code === 204) {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.edit.success',
                defaultMessage: '修改成功！',
              });
              message.success(defaultLoginSuccessMessage);
              setIsEditPosition(false);
            } else {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.edit.false',
                defaultMessage: '修改失败！',
              });
              message.success(defaultLoginSuccessMessage);
            }
          });
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    }
  };
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [queryParam, setQueryParam] = useState([]);
  const onGetQueryParam = (params) => {
    setQueryParam(() => {
      return params;
    });
    console.log(params);
  };
  const { LAYOUTMARGIN, PRIMARYCOLOR } = useModel('Constant');

  const [showDetail, setShowDetail] = useState(false);
  const tableColumns = [
    {
      title: intl.formatMessage({ id: 'pages.usermanage.table.index', defaultMessage: '序号' }),
      dataIndex: 'index',
      valueType: 'index',
      align: 'left',
    },
    {
      title: intl.formatMessage({
        id: 'pages.usermanage.table.positionName',
        defaultMessage: '职位名称',
      }),
      dataIndex: 'Position_Name',
      valueType: 'string',
    },
    {
      title: intl.formatMessage({
        id: 'pages.usermanage.table.organization',
        defaultMessage: '组织',
      }),
      dataIndex: 'Organization_GUID',
      valueType: 'string',
      render: () => <div>{modalTitle}</div>,
    },
    {
      title: intl.formatMessage({
        id: 'pages.usermanage.table.updateTime',
        defaultMessage: '最后修改时间',
      }),
      dataIndex: 'Update_Time',
      sorter: true,
      valueType: 'date',
    },
    {
      title: intl.formatMessage({ id: 'pages.operate', defaultMessage: 'Operate' }),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={(e) => {
            e.preventDefault();
            setPositionData(() => {
              return {
                ...positionData,
                positionName: record.Position_Name,
                PositionGUID: record.Position_GUID,
              };
            });
            form.setFieldsValue({ position_name: record.Position_Name });
            setIsEditPosition(true);
          }}
        >
          <FormattedMessage id="pages.usermanage.table.update" defaultMessage="修改信息" />
        </a>,
        <a
          key="subscribeAlert"
          onClick={(e) => {
            delPosition({
              sysrsc_no: 'TREE299',
              menursc_no: 'TREE299_01',
              handlersc_no: 'BTN_001',
              position_guid: record.Position_GUID,
            })
              .then((res) => {
                if (res.code === 204) {
                  set;
                  setSelectedKeys(() => {
                    return selectedKeys;
                  });
                  const defaultLoginSuccessMessage = intl.formatMessage({
                    id: 'pages.usermanage.del.success',
                    defaultMessage: '删除成功！',
                  });
                  message.success(defaultLoginSuccessMessage);
                } else {
                  const defaultLoginSuccessMessage = intl.formatMessage({
                    id: 'pages.usermanage.del.false',
                    defaultMessage: '删除失败！',
                  });
                  message.success(defaultLoginSuccessMessage);
                }
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <FormattedMessage id="pages.usermanage.delSub" defaultMessage="删除" />
        </a>,
      ],
    },
  ];

  const TableList = (props) => {
    const queryParam = useMemo(() => props.queryParam, [props.queryParam]);
    const { columns } = props;
    const [createModalVisible, handleModalVisible] = useState(false);
    const [selectedRowsState, setSelectedRows] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [pagination, setPagination] = useState({
      // current: 1,
      currentpageindex: 1,
      pagesize: 20,
    });
    const [totalCount, setTotalCount] = useState([]);
    const [tabsData, setTabsData] = useState({});
    const [activeKey, setActiveKey] = useState('tab1');
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

    //批量无效
    function onBatchInvalid(e) {
      console.log(selectedRowsState);
      let str = JSON.stringify(selectedRowsState[0].Position_GUID);
      for (let i = 1; i < selectedRowsState.length; i++) {
        str = str + ',' + JSON.stringify(selectedRowsState[i].Position_GUID);
      }
      batchDelPosition({
        sysrsc_no: 'TREE299',
        menursc_no: 'TREE299_01',
        handlersc_no: 'BTN_001',
        position_guid_str: str,
      })
        .then((res) => {
          if (res.code === 204) {
            setSelectedKeys(() => {
              return selectedKeys;
            });
            const defaultLoginSuccessMessage = intl.formatMessage({
              id: 'pages.usermanage.del.success',
              defaultMessage: '删除成功！',
            });
            message.success(defaultLoginSuccessMessage);
          } else {
            const defaultLoginSuccessMessage = intl.formatMessage({
              id: 'pages.usermanage.del.false',
              defaultMessage: '删除失败！',
            });
            message.success(defaultLoginSuccessMessage);
          }
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    }
    //导入
    function onImportUsers() {
      alert('clicked import users');
    }
    //导出
    function onExportUsers() {
      const jsonObj = {
        jsonData: {
          currentwhere: [
            { queryname: 'position_name', queryoperator: 'like', queryvalue: '123' },
            { queryname: 'user_name', queryoperator: '=', queryvalue: '456' },
          ],
          sorting: 'organization_guid',
          sortdir: 'asc',
          organization_guid: '0',
          sheet_name_res: 'sheet名的资源',
          position_name_res: '职位名称资源',
          organization_name_res: '组织名称资源',
          update_time_res: '最后修改时间资源',
        },
      };
      exportExcel(jsonObj)
        .then((res) => {
          if (res.code === 200) {
            document.location.href = res.data;
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
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    }
    const toolBarMoreMenu = (
      <Menu
        items={[
          {
            key: 'invalid',
            label: (
              <a rel="noopener noreferrer" onClick={onBatchInvalid}>
                <FormattedMessage id="pages.usermanage.del" defaultMessage="批量删除" />
              </a>
            ),
          },
          {
            key: 'import',
            label: (
              <a rel="noopener noreferrer" onClick={onImportUsers}>
                <FormattedMessage id="pages.import" defaultMessage="导入" />
              </a>
            ),
          },
          {
            key: 'export',
            label: (
              <a rel="noopener noreferrer" onClick={onExportUsers}>
                <FormattedMessage id="pages.export" defaultMessage="导出" />
              </a>
            ),
          },
        ]}
      />
    );

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
                  id: 'menu.console.user-manage.organization-user.tab1',
                  defaultMessage: '产品-职位列表',
                })}
                {renderBadge(tabsData.tabCount1, activeKey === 'tab1')}
              </span>
            ),
          },
        ],
        onChange: (key) => {
          setActiveKey(key);
        },
      },
      actions: [
        <Dropdown overlay={toolBarMoreMenu} placement="bottomRight" arrow key="more">
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

    useEffect(() => {
      const tableParam = {
        jsonData: {
          currentwhere: queryParam.length ? JSON.stringify(queryParam) : [],
          ...pagination,
          sorting: 'position_guid',
          organization_guid: props.SelectedKeys[0] || '',
          sortdir: 'asc',
        },
      };
      if (props.SelectedKeys[0]) {
        getPositionList(tableParam).then((datalist) => {
          const data = datalist.data;
          setTotalCount(() => {
            return data?.totalRows || 0;
          });
          setTableData(() => {
            return data?.list || [];
          });
        });
      }
    }, [pagination, queryParam, props.SelectedKeys]);

    return (
      <div style={{ margin: `${LAYOUTMARGIN} -8px -8px` }}>
        <ProTable
          actionRef={actionRef}
          rowKey="Update_Time"
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
  return (
    <>
      <PageHeaderWrapper />
      <div style={{ display: 'flex' }}>
        <div
          style={{
            minWidth: '260px',
            minHeight: '750px',
            backgroundColor: '#fff',
            marginTop: '16px',
            marginRight: '25px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              height: '40px',
              alignItems: 'center',
              padding: '0 10px',
            }}
          >
            <div>
              <FormattedMessage id="pages.usermanage.left.title" defaultMessage="组织架构" />
            </div>
            <Button type="primary" icon={<PlusOutlined />} size={'small'} />
          </div>
          <div>
            <Tree
              fieldNames={{
                key: 'Organization_GUID',
              }}
              titleRender={(item) => {
                return (
                  <div style={{ height: '30px', lineHeight: '30px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        width: '70%',
                      }}
                    >
                      {item.Organization_Code + item.Organization_Name}
                    </span>
                    <span key={item.key} style={{ position: 'absolute', right: '10px' }}>
                      <Dropdown overlay={companyMenu} trigger={['click']}>
                        <PlusOutlined onClick={(e) => e.stopPropagation()} />
                      </Dropdown>
                    </span>
                  </div>
                );
              }}
              blockNode
              onExpand={onExpand}
              //expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={(selectedKeysValue, info) => {
                onSelect(selectedKeysValue, info);
              }}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <MySearchCondition
            search={onGetQueryParam}
            queryTypes={tableColumns}
            rangePickerProps={rangePickerProps}
          />
          <TableList queryParam={queryParam} SelectedKeys={selectedKeys} columns={tableColumns} />
        </div>
      </div>
      <Modal
        title={
          intl.formatMessage({
            id: 'pages.usermanage.modaltitle.left',
            defaultMessage: '组织维护-',
          }) +
          modalTitle +
          intl.formatMessage({
            id: 'pages.usermanage.modaltitle.right',
            defaultMessage: '-添加子组织',
          })
        }
        destroyOnClose
        width={400}
        visible={isAddSub}
        onOk={() => {
          handleOk(2);
        }}
        onCancel={() => {
          setIsAddSub(false);
        }}
      >
        <div>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              organization_code: '',
              organization_name: '',
            }}
            preserve={false}
          >
            <Form.Item
              label={intl.formatMessage({
                id: 'pages.usermanage.from.organizationCode',
                defaultMessage: '组织编号',
              })}
              name="add_organization_code"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.usermanage.from.rule"
                      defaultMessage="请输入你的组织编号！"
                    />
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={intl.formatMessage({
                id: 'pages.usermanage.from.organizationName',
                defaultMessage: '组织名称',
              })}
              name="add_organization_name"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.usermanage.from.rule1"
                      defaultMessage="请输入你的组织名称！"
                    />
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title={
          intl.formatMessage({
            id: 'pages.usermanage.modaltitle.left',
            defaultMessage: '组织维护-',
          }) +
          modalTitle +
          intl.formatMessage({
            id: 'pages.usermanage.modaltitle.right2',
            defaultMessage: '-修改信息',
          })
        }
        destroyOnClose
        width={400}
        forceRender={true}
        visible={isEditSub}
        onOk={() => {
          handleOk(3);
        }}
        onCancel={() => {
          setIsEditSub(false);
        }}
      >
        <div>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: false,
              organization_code: positionData.id,
              organization_name: positionData.name,
            }}
            preserve={false}
          >
            <Form.Item
              label={intl.formatMessage({
                id: 'pages.usermanage.from.organizationCode',
                defaultMessage: '组织编号',
              })}
              name="organization_code"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.usermanage.from.rule"
                      defaultMessage="请输入你的组织编号！"
                    />
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={intl.formatMessage({
                id: 'pages.usermanage.from.organizationName',
                defaultMessage: '组织名称',
              })}
              name="organization_name"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.usermanage.from.rule1"
                      defaultMessage="请输入你的组织名称！"
                    />
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title={intl.formatMessage({
          id: 'pages.usermanage.modaltitle1',
          defaultMessage: '用户管理-组织维护-添加职位',
        })}
        destroyOnClose
        width={400}
        visible={isAddPosition}
        onOk={() => handleOk(1)}
        onCancel={() => {
          setIsAddPosition(false);
        }}
      >
        <div>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
            }}
            preserve={false}
          >
            <Form.Item
              label={intl.formatMessage({
                id: 'pages.usermanage.from.positionName',
                defaultMessage: '职位名称',
              })}
              name="position_name"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.usermanage.from.rule2"
                      defaultMessage="请输入你的职位名称！"
                    />
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title={intl.formatMessage({
          id: 'pages.usermanage.modaltitle2',
          defaultMessage: '用户管理-组织维护-修改职位信息',
        })}
        destroyOnClose
        width={400}
        visible={isEditPosition}
        onOk={() => handleOk(4)}
        onCancel={() => {
          setIsEditPosition(false);
        }}
      >
        <div>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
              position_name: positionData.positionName,
            }}
            preserve={false}
          >
            <Form.Item
              label={intl.formatMessage({
                id: 'pages.usermanage.from.positionName',
                defaultMessage: '职位名称',
              })}
              name="position_name"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.usermanage.from.rule2"
                      defaultMessage="请输入你的职位名称！"
                    />
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default UserManage;
