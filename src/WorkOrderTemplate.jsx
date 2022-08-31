/*
 * @Author: WhiteWen 849019060@qq.com
 * @Date: 2022-07-14 14:14:51
 * @LastEditors: WhiteWen 849019060@qq.com
 * @LastEditTime: 2022-08-22 11:33:37
 * @FilePath: \BM.Web.CIMS\src\pages\eService\workOrderSetting\WorkOrderTemplate\index.jsx
 * @Description: 工单维护
 *
 */
import MySearchCondition from '@/components/MyTable/components/MySearchCondition';
import {
  getWorkOrderList,
  publishTemplate,
  saveWorkOrderTemplate,
  updateTemplateStatus,
} from '@/services/swagger/eservice';
import { getUserInfo } from '@/services/swagger/user';
import { DownOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Dropdown, Form, Menu, message, Modal, Select, Space } from 'antd';
import Input from 'antd/lib/input/Input';
import { useRef, useState } from 'react';
import { FormattedMessage, history, useIntl, useModel } from 'umi';
import TableList from '../components/TableList';
const rangePickerProps = {
  showTime: false,
};
const UserManage = () => {
  var formRawData = '';
  const intl = useIntl();
  const [positionValue, setPositionValue] = useState();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState('0');
  const [activeKey, setActiveKey] = useState('tab1');
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [pagination, setPagination] = useState({
    currentpageindex: 1,
    pagesize: 20,
  });
  const [sortParam, setSortParam] = useState({
    sorting: 'workordertype_guid',
    sortdir: 'asc',
    workordertype_status: '1',
  });
  const [workOrderType, setWorkOrderType] = useState([]);
  const actionRef = useRef();
  const tableRef = useRef(null);
  const [currentRow, setCurrentRow] = useState({});
  const [queryParam, setQueryParam] = useState({});
  const [addEditStatus, setAddEditStatus] = useState();
  const [positionTreeInfo, setPositionTreeInfo] = useState([{}]);
  const [userInfo, setUserInfo] = useState({});
  const showModal = (modalName) => {
    setIsModalVisible(modalName);
  };
  const { workorderTemplateID, setWorkorderTemplateID } = useModel('workOrder');
  // 顶部链接按钮
  const HeaderExtra = (
    <>
      <Space split="丨">
        {/* 无效模板 */}
        <a
          // to="/workbench/workorder-setting/template/invalid-template"
          onClick={() => {
            // setActiveKey('tab3');
            history.push('/workbench/workorder-setting/template/invalid-template');
          }}
        >
          {intl.formatMessage({
            id: 'pages.eservice.invalidTemplate',
            defaultMessage: '无效模板',
          })}
          {/* ( {0} ) */}
        </a>
        {/* 新增模板 */}
        <Button
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            showModal('add-edit-user');
            setAddEditStatus('add');
            getWorkOrderTypeList(pagination);
          }}
        >
          {intl.formatMessage({ id: 'pages.eservice.addTemplate', defaultMessage: '新增模板' })}
        </Button>
      </Space>
    </>
  );
  //日志
  function onViewLog(str) {
    history.push({
      pathname: '/console/user/operationLog',
      query: { name: str },
    });
  }
  function onSetTemplate(record, e) {
    e.stopPropagation();
    console.log(setWorkorderTemplateID);
    history.push({
      pathname: '/workbench1/workorder-setting/template/template-setting',
    });
    // setWorkorderTemplateID(record.Template_GUID);
  }
  // ...菜单按钮
  const menu = (record) => {
    return (
      <Menu
        items={[
          // 模板设置
          {
            key: '1',
            label: (
              <span
                onClick={(e) => {
                  onSetTemplate(record, e);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage id="pages.eservice.setTemplate" defaultMessage="模板设置" />
              </span>
            ),
          },
          // 发布
          {
            key: '2',
            label: (
              <span
                onClick={() => {
                  onPublishTemplate(record);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage id="pages.publish" defaultMessage="发布" />
              </span>
            ),
          },
          // 无效
          {
            key: '3',
            label: (
              <span
                onClick={() => {
                  setCurrentRow(record);
                  onSetTemplateStatus(record);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage id="pages.usermanage.invalidate" defaultMessage="Invalidate" />
              </span>
            ),
          },
          // 日志
          {
            key: '4',
            label: (
              <span
                onClick={() => {
                  console.log(record);
                  onViewLog(record.User_Name);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage id="pages.log" defaultMessage="Log" />
              </span>
            ),
          },
        ]}
      />
    );
  };
  // ...菜单按钮
  const menu2 = (record) => {
    return (
      <Menu
        items={[
          // 无效
          {
            key: '1',
            label: (
              <span
                onClick={() => {
                  setCurrentRow(record);
                  onSetTemplateStatus(record);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage id="pages.usermanage.invalidate" defaultMessage="Invalidate" />
              </span>
            ),
          },
          // 日志
          {
            key: '2',
            label: (
              <span
                onClick={() => {
                  console.log(record);
                  onViewLog(record.User_Name);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage id="pages.log" defaultMessage="Log" />
              </span>
            ),
          },
        ]}
      />
    );
  };
  // 操作按钮
  const operateButtons = (tabkey, record) => {
    return tabkey == 'tab1' ? (
      <Space key={record.User_GUID}>
        <a
          key="edit"
          onClick={(e) => {
            e.preventDefault();
            showModal('add-edit-user');
            setAddEditStatus('edit');
            setCurrentRow(record);
            // getUserDetail(record);
            getWorkOrderTypeList(pagination);
            form.setFieldsValue({
              template_name: record.Template_Name,
              type: record.workordertype_name,
              property: record.Template_Attribute,
            });
          }}
        >
          <FormattedMessage id="pages.edit" defaultMessage="Edit" />
        </a>
        {/* 下拉菜单 */}
        <Dropdown key="more" placement="bottomRight" overlay={menu(record)}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {intl.formatMessage({ id: 'pages.more', defaultMessage: '更多' })}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    ) : (
      <Space key={record.User_GUID}>
        <a
          key="detail"
          onClick={(e) => {
            e.preventDefault();
            onDetail(record);
          }}
        >
          <FormattedMessage id="pages.detail" defaultMessage="详情" />
        </a>
        {/* 下拉菜单 */}
        <Dropdown key="more" placement="bottomRight" overlay={menu2(record)}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {intl.formatMessage({ id: 'pages.more', defaultMessage: '更多' })}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    );
  };
  // 表格列
  const tableColumns = [
    {
      title: intl.formatMessage({ id: 'pages.eservice.templateID', defaultMessage: '模板ID' }),
      dataIndex: 'Template_No',
      key: 'Template_No',
      sorter: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.templateName',
        defaultMessage: '模板名称',
      }),
      dataIndex: 'Template_Name',
      key: 'Template_Name',
      // dataIndex: 'name',
      valueType: 'text',
    },
    // {
    //   title: intl.formatMessage({ id: 'pages.eservice.publishStatus', defaultMessage: '发布状态' }),
    //   dataIndex: 'Release_Status',
    //   key: 'Release_Status',
    //   valueType: 'text',
    //   valueEnum: {
    //     0: {
    //       text: intl.formatMessage({ id: 'pages.unPublish', defaultMessage: '待发布' }),
    //     },
    //     1: {
    //       text: intl.formatMessage({ id: 'pages.published', defaultMessage: '已发布' }),
    //     },
    //   },
    // },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.workOrderType',
        defaultMessage: '工单类型',
      }),
      dataIndex: 'workordertype_name',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.workOrderProperty',
        defaultMessage: '工单属性',
      }),
      dataIndex: 'Template_Attribute',
      key: 'Template_Attribute',
      valueType: 'text',
      valueEnum: {
        1: {
          text: intl.formatMessage({
            id: 'pages.eservice.plat',
            defaultMessage: '平台',
          }),
        },
        0: {
          text: intl.formatMessage({
            id: 'pages.eservice.project',
            defaultMessage: '项目',
          }),
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.creator', defaultMessage: '创建人' }),
      dataIndex: 'User_Status',
      key: 'User_Status',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.createTime', defaultMessage: '创建时间' }),
      dataIndex: 'Create_Time',
      key: 'test',
      valueType: 'date',
    },
    {
      title: intl.formatMessage({ id: 'pages.operate', defaultMessage: 'Operate' }),
      dataIndex: 'option',
      key: 'option',
      valueType: 'option',
      render: (_, record) => {
        return [operateButtons(activeKey, record)];
      },
    },
  ];
  // 弹框title(新增|编辑)
  const addTitle =
    intl.formatMessage({ defaultMessage: '用户管理-新增用户', id: 'menu.console.user-manage' }) +
    '-' +
    intl.formatMessage({ defaultMessage: '用户管理-新增用户', id: 'pages.usermanage.addUsers' });
  const editTitle =
    intl.formatMessage({ defaultMessage: '用户管理-编辑用户', id: 'menu.console.user-manage' }) +
    '-' +
    intl.formatMessage({ defaultMessage: '用户管理-编辑用户', id: 'pages.usermanage.editUsers' });
  /**
   * 表格渲染刷新
   **/
  function renderTable() {
    tableRef.current.renderTable(pagination, queryParam, activeKey);
  }

  /**
   * 请求列表数据
   */
  function getWorkOrderTypeList(pagination, queryParam, activeKey) {
    const tableParam = {
      jsonData: {
        currentwhere: [],
        ...pagination,
        ...sortParam,
      },
    };
    getWorkOrderList(tableParam).then((res) => {
      if (res.success) {
        setWorkOrderType(() => {
          return res.data.list;
        });
      }
    });
  }
  /**
   * 详情
   */
  function onDetail(record) {
    history.push({
      pathname: '/workbench/workorder-setting/template/detail',
      query: { id: record.Template_GUID, name: record.Template_Name },
    });
  }
  /**
   *  修改状态（无效）
   **/
  function onSetTemplateStatus(record) {
    setCurrentRow(record);
    const confirm = Modal.confirm({
      title: '提示',
      content: (
        <div>
          <p>
            工单类型（<span style={{ color: '#21BB71' }}>{record.Template_Name}</span>
            ）无效后将无法使用，已使用的历史数据不受影响，您可在无效模板列表查询。是否确认无效？
          </p>
        </div>
      ),
      onOk() {
        const reqData = {
          sysrsc_no: 'TREE001',
          menursc_no: 'TREE001_01',
          handlersc_no: 'ACTION004',
          template_guid: record.Template_GUID,
          template_status: '0',
        };
        updateTemplateStatus(reqData).then((res) => {
          if (res.success) {
            message.success('无效成功');
            confirm.destroy();
            renderTable();
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  /**
   * 发布模板
   */
  function onPublishTemplate(record) {
    let reqData = {
      sysrsc_no: 'TREE299',
      menursc_no: 'TREE299_01',
      handlersc_no: 'BTN_001',
      template_guid: record.Template_GUID,
      release_status: '1',
    };
    const validateConfirm = Modal.confirm({
      title: '您确定发布该工单模板吗？',
      onOk: async function () {
        const res = await publishTemplate(reqData);
        if (res.success) {
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.eservice.publish.success',
            defaultMessage: '发布成功!',
          });
          message.success(defaultLoginSuccessMessage);
          validateConfirm.destroy();
          renderTable();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  /**
   * 查询用户详情-编辑
   */
  function getUserDetail(record) {
    let params = {
      template_guid: record.User_GUID,
    };
    getUserInfo(params).then((res) => {
      if (res.success) {
        let dt = res.data;
        form.setFieldsValue({
          user_fullname: dt[0].User_Name,
          template_statustemplate_status: dt[0].User_Status,
          user_email: dt[0].User_Email,
          user_type: dt[0].User_Type,
          user_mobile: dt[0].User_Mobile,
        });
        if (dt[0].Organization_Position !== null) {
          form.setFieldsValue({
            positiondata: dt[0].Organization_Position.split(','),
          });
        }
      }
    });
  }

  /**
   * 日志
   */
  function onViewLog(str) {
    history.push({
      pathname: '/console/user/operationLog',
      query: { name: str },
    });
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setIsModalVisible('0');
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  const ComparativeData = (obj1, obj2) => {
    for (var attr in obj1) {
      var t1 = obj1[attr] instanceof Object;
      var t2 = obj2[attr] instanceof Object;
      if (t1 && t2) {
        return diff(obj1[attr], obj2[attr]);
      } else if (obj1[attr] !== obj2[attr]) {
        return false;
      }
    }
    return true;
  };
  /**
   * 保存信息-新增|编辑
   **/
  const onSaveUserInfo = (status) => {
    form
      .validateFields()
      .then((values) => {
        let info = {
          sysrsc_no: 'TREE001',
          menursc_no: 'TREE001_01',
          handlersc_no: 'ACTION003',
          template_guid: '',
          template_name: values.template_name,
          template_attribute: values.property.join(),
          workordertype_guid: values.type.key,
          template_status: '1',
          release_status: '0',
        };
        saveWorkOrderTemplate(info)
          .then((res) => {
            if (res.success) {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.add.success',
                defaultMessage: '添加成功！',
              });
              const defaultEditSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.edit.success',
                defaultMessage: '修改成功！',
              });
              message.success(res.message);
              setIsModalVisible('0');
              tableRef.current.renderTable(pagination, queryParam, activeKey);
            } else {
              const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.usermanage.add.false',
                defaultMessage: '添加失败！',
              });
              message.success(res.message);
              setIsModalVisible('0');
            }
          })
          .catch(() => {
            setIsModalVisible('0');
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  /**
   *关闭弹框
   */
  const handleCancel = () => {
    setIsModalVisible('0');
  };

  /**
   *获取搜索参数
   */
  const onGetQueryParam = (params) => {
    const BETWEEN = 'between';
    const values = params;
    let arr = [];
    for (let i in values) {
      const item = values[i];
      if (!item) {
        return;
      }
      // item.queryname = item.queryname.value;
      if (item.queryoperator == BETWEEN && Array.isArray(item.queryvalue)) {
        // moment格式的日期区间改为string
        if (/* rangeTypeObj[i] == 'picker' && */ item.queryoperator == BETWEEN) {
          item.queryvalue = [item.queryvalue[0].toISOString(), item.queryvalue[1].toISOString()];
          item.queryvalue = [item.queryvalue[0], item.queryvalue[1]];
        } else {
          item.queryvalue = item.queryvalue.join('|');
        }
      }
      arr.push(values[i]);
    }
    setQueryParam(() => {
      return arr;
    });
    /* setQueryParam(() => {
      return params;
    }); */
  };

  /**
   * 表格勾选
   */
  function handleSelected(selectedUser) {
    setSelectedRows(selectedUser);
  }

  /* 内容更新钩子 */
  const { tableSearch } = useModel('UserManageModel');

  /*
   * 重置搜索表单
   */
  const onSelect = (value, node, extra) => {
    let arr = [];
    arr.push(node.pId + '|' + value);
    console.log(arr, 111);
  };

  return (
    <>
      <PageHeaderWrapper extra={HeaderExtra} />
      <MySearchCondition
        search={onGetQueryParam}
        queryTypes={tableColumns}
        rangePickerProps={rangePickerProps}
      />
      <TableList
        ref={tableRef}
        queryParam={queryParam}
        columns={tableColumns}
        activeKey={activeKey}
        handleSelected={handleSelected}
        setTab={(tab) => {
          setActiveKey(tab);
        }}
      />
      <Modal
        title={addEditStatus == 'add' ? addTitle : editTitle}
        destroyOnClose={true}
        width={392}
        visible={isModalVisible == 'add-edit-user'}
        onOk={(e) => {
          e.preventDefault();
          onSaveUserInfo(addEditStatus);
        }}
        onCancel={handleCancel}
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
            }}
            preserve={false}
          >
            <Form.Item
              label={intl.formatMessage({
                id: 'pages.eservice.templateName',
                defaultMessage: '工单模板名称',
              })}
              name="template_name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                maxLength={50}
                placeholder={intl.formatMessage({
                  id: 'pages.sysParams.port.name.tip',
                  defaultMessage: '请输入名称',
                })}
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({
                id: 'pages.eservice.workOrderType',
                defaultMessage: '工单类型',
              })}
              name="type"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select labelInValue>
                {workOrderType.map((item) => {
                  return (
                    <Select.Option
                      key={item.WorkOrderType_GUID}
                      value={item.WorkOrderType_Name}
                      label={item.WorkOrderType_Name}
                    />
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({
                id: 'pages.eservice.workOrderProperty',
                defaultMessage: '工单属性',
              })}
              name="property"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select mode="multiple" showArrow>
                <Select.Option key={1} value="S">
                  <FormattedMessage id="pages.eservice.plat" defaultMessage="平台" />
                </Select.Option>
                <Select.Option key={0} value="P">
                  <FormattedMessage id="pages.system" defaultMessage="系统" />
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default UserManage;
