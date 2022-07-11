// @06-21

import MySearchCondition from '@/components/MyTable/components/MySearchCondition';
import {
  resetUserMgtUserPwd,
  /* getUserMgtUserList, */ saveUserMgtUserInfo,
} from '@/services/swagger/user';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dropdown, Form, Menu, message, Modal, Select, Space, Table } from 'antd';
import Input from 'antd/lib/input/Input';
import { useRef, useState } from 'react';
import { FormattedMessage, Link, useIntl, useModel } from 'umi';
import InvalidateConfirmModal from './components/InvalidateConfirmModal';
import TableList from './components/TableList';

const columns = [
  {
    title: '负责人',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '动作',
    dataIndex: 'action',
    key: 'action',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '操作人',
    dataIndex: 'operaName',
    key: 'operaName',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    action: '开始',
    time: '2022-08-31 14:00',
    operaName: '张三',
  },
  {
    key: '2',
    name: '李四',
    action: '移除',
    time: '2022-09-21 5:00',
    operaName: '李四',
  },
  {
    key: '3',
    name: 'Jdd',
    action: '移除',
    time: '2022-10-30 8:00',
    operaName: 'Jdd',
  },
  {
    key: '4',
    name: 'wh',
    action: '移除',
    time: '2022-12-31 18:00',
    operaName: 'wh',
  },
  {
    key: '5',
    name: '一页最多五条',
    action: '移除',
    time: '2022-12-31 18:00',
    operaName: 'wh',
  },
];
const rangePickerProps = {
  showTime: false,
};

const UserManage = () => {
  // TODO 构建通用函数,获取页面的Title, 以便在组建中类似Modal中展示父级标题, 而不用手动填写
  // const pageName = ""
  const intl = useIntl();
  const [form] = Form.useForm();
  // TODO 处理 每次在Modal展示状态变更的时候, 父组件刷新. 变更时机需要受控制
  /* isModalVisible: '0' 隐藏; 'add-edit-user' 添加和编辑用户; 'eservice-track': 工单-痕迹  */
  const [isModalVisible, setIsModalVisible] = useState('0');
  const [activeKey, setActiveKey] = useState('tab1');
  const { reasonModalVisible, setReasonModalVisible } = useModel('UserManageModel');
  console.log(reasonModalVisible);

  const showModal = (modalName) => {
    setIsModalVisible(modalName);
  };
  3;
  const HeaderExtra = (
    <>
      <Space split="丨">
        <Link to="/console/user/3">
          {intl.formatMessage({
            id: 'pages.usermanage.maintainOrganization',
            defaultMessage: 'Maintain Organization',
          })}
        </Link>
        <Link to="/console/user/3">
          {intl.formatMessage({
            id: 'pages.usermanage.deletableUsers',
            defaultMessage: 'Deletable Users',
          })}
        </Link>
        <Link to="/console/user/recyclebin">
          {intl.formatMessage({ id: 'pages.usermanage.recycleBin', defaultMessage: 'RecycleBin' })}
        </Link>
        <Link
          onClick={(e) => {
            e.preventDefault();
            showModal('add-edit-user');
          }}
        >
          {intl.formatMessage({ id: 'pages.usermanage.addUsers', defaultMessage: 'Add Users' })}
        </Link>
      </Space>
    </>
  );

  //无效 | 有效
  function onSetUserStatus(record) {
    const status = activeKey == 'tab1' ? -1 : 1;
    // alert('clicked invalid, status' + status);
    setCurrentRow(record);
  }
  //详情
  function onDetail(rowData) {
    alert('clicked invalid, status' + JSON.stringify(rowData));
  }
  //日志
  function onViewLog() {
    alert('clicked Log');
  }
  //重置用户密码
  async function onResetUserPassword(record) {
    console.log(record);
    const data = { sysrsc_no: 'TREE299', menursc_no: 'TREE299_01', handlersc_no: 'BTN_001' };
    const res = await resetUserMgtUserPwd(data);
    console.log(res);
  }

  const menu = (record) => {
    return (
      <Menu
        items={[
          {
            key: '1',
            label: (
              <span
                onClick={() => {
                  setReasonModalVisible(true);
                  setCurrentRow(record);
                  onSetUserStatus(record);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage id="pages.usermanage.invalidate" defaultMessage="Invalidate" />
              </span>
            ),
          },
          {
            key: '2',
            label: (
              <span
                onClick={() => {
                  onViewLog(record);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage id="pages.log" defaultMessage="Log" />
              </span>
            ),
          },
          {
            key: '3',
            label: (
              <span
                onClick={() => {
                  onResetUserPassword(record);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage
                  id="pages.usermanage.resetPassword"
                  defaultMessage="Reset Password"
                />
              </span>
            ),
          },
        ]}
      />
    );
  };
  const operateButtons = (tabkey, record) => {
    return tabkey == 'tab1' ? (
      <>
        <a
          key="edit"
          onClick={(e) => {
            e.preventDefault();
            // handleUpdateModalVisible(true);
            showModal('add-edit-user');
            console.log(record);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.edit" defaultMessage="Edit" />
        </a>
        <a
          key="detail"
          onClick={(e) => {
            e.preventDefault();
            setCurrentRow(record);
            onDetail(record);
          }}
        >
          <FormattedMessage id="pages.detail" defaultMessage="Detail" />
        </a>
        <Dropdown key="more" placement="bottomRight" overlay={menu(record)}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>...</Space>
          </a>
        </Dropdown>
      </>
    ) : (
      <>
        <a
          key="validate"
          onClick={(e) => {
            e.preventDefault();
            setCurrentRow(record);
            onSetUserStatus(record);
          }}
        >
          <FormattedMessage id="pages.usermanage.validate" defaultMessage="Validate" />
        </a>
        <a
          key="detail"
          onClick={(e) => {
            e.preventDefault();
            setCurrentRow(record);
            onDetail(record);
          }}
        >
          <FormattedMessage id="pages.detail" defaultMessage="Detail" />
        </a>
        <a
          key="log"
          onClick={(e) => {
            e.preventDefault();
            setCurrentRow(record);
            onViewLog(record);
          }}
        >
          <FormattedMessage id="pages.log" defaultMessage="Log" />
        </a>
      </>
    );
  };
  const tableColumns = [
    {
      title: intl.formatMessage({ id: 'pages.usermanage.userID', defaultMessage: 'User ID' }),
      dataIndex: 'userId',
      sorter: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.usermanage.name', defaultMessage: 'Name' }),
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.usermanage.email', defaultMessage: 'eMail' }),
      tip: 'The email is the unique key',
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({
        id: 'pages.usermanage.groupPosition',
        defaultMessage: 'Group/Position',
      }),
      dataIndex: 'groupPosition',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.type', defaultMessage: 'Type' }),
      sorter: true,
      dataIndex: 'type',
      valueType: 'text',
      valueEnum: {
        1: { text: '正式' },
        0: { text: '实习' },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      valueType: 'text',
      valueEnum: {
        1: { text: '有效', status: 'Default' },
        0: { text: '无效', status: 'Warning' },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.operate', defaultMessage: 'Operate' }),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return [operateButtons(activeKey, record)];
      },
    },
  ];

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        setIsModalVisible('0');
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const onSaveUserInfo = () => {
    form
      .validateFields()
      .then((values) => {
        let info = {
          sysrsc_no: 'TREE001',
          menursc_no: 'TREE001_01',
          handlersc_no: 'ACTION003',
          user_guid: '',
          user_status: 1,
          user_email: values.user_email,
          user_fullname: values.user_fullname,
          user_type: values.user_type,
          user_duedays: '',
        };
        saveUserMgtUserInfo(info)
          .then((res) => {
            message.success(res.message);
            setIsModalVisible('0');
          })
          .catch(() => {
            setIsModalVisible('0');
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible('0');
  };

  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState({});

  const [queryParam, setQueryParam] = useState({});
  const onGetQueryParam = (params) => {
    setQueryParam(() => {
      return params;
    });
  };

  const addUserTitle =
    intl.formatMessage({ defaultMessage: '用户管理-新增用户', id: 'menu.console.user-manage' }) +
    intl.formatMessage({ defaultMessage: '用户管理-新增用户', id: 'pages.usermanage.addUsers' });

  function onFinishInvalidateReason(close) {
    if (close) {
      setReasonModalVisible(false);
    }
  }
  return (
    <>
      <PageHeaderWrapper extra={HeaderExtra} />
      <MySearchCondition
        search={onGetQueryParam}
        queryTypes={tableColumns}
        rangePickerProps={rangePickerProps}
      />
      <TableList
        queryParam={queryParam}
        columns={tableColumns}
        activeKey={activeKey}
        setTab={(tab) => {
          setActiveKey(tab);
        }}
      />

      <InvalidateConfirmModal
        showModal={reasonModalVisible}
        onOk={onFinishInvalidateReason}
        onCancel={() => setReasonModalVisible(false)}
        currentRow={currentRow}
      />
      {/* <Modal
        title="用户管理-组织维护-添加子组织"
        estroyOnClose
        width={400}
        visible={isModalVisible}
        onOk={handleOk}
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
              remember: true,
            }}
            preserve={false}
          >
            <Form.Item
              label="组织编号"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your 组织编号!',
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              label="组织名称"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your 组织名称!',
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Form>
        </div>
      </Modal> */}
      {/* <Modal title="用户管理-组织维护-添加职位" destroyOnClose width={400} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
              label="职位名称"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your 职位名称!',
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Form>
        </div>
      </Modal> */}

      <Modal
        title={addUserTitle}
        destroyOnClose={true}
        width={550}
        visible={isModalVisible == 'add-edit-user'}
        onOk={onSaveUserInfo}
        onCancel={handleCancel}
      >
        <div style={{ marginLeft: '35px' }}>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 22,
            }}
            initialValues={{
              // remember: true,
              username: currentRow.name,
              'E-mail': currentRow.email,
              type: currentRow.type,
              org_position: currentRow.groupPosition,
            }}
            preserve={false}
          >
            <div style={{ width: '50%', display: 'inline-block' }}>
              <Form.Item
                label="姓名"
                name="user_fullname"
                wrapperCol={{
                  span: 20,
                }}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
            <div style={{ width: '50%', display: 'inline-block' }}>
              <Form.Item
                label="E-mail"
                name="user_email"
                wrapperCol={{
                  span: 20,
                }}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
            <div style={{ width: '50%', display: 'inline-block' }}>
              <Form.Item
                label="联系电话"
                name="tel"
                wrapperCol={{
                  span: 20,
                }}
                rules={[
                  {
                    // required: true,
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
            <div style={{ width: '50%', display: 'inline-block' }}>
              <Form.Item
                label="类型"
                name="user_type"
                wrapperCol={{
                  span: 20,
                }}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select>
                  <Select.Option value="1">正式</Select.Option>
                  <Select.Option value="0">实习</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item
              label="组织/职位"
              name="org_position"
              rules={[
                {
                  required: true,
                  // message: 'Please select your 组织/职位!',
                },
              ]}
            >
              <Select mode="multiple" allowClear placeholder="Please select">
                <Select.Option value="demo1">正式</Select.Option>
                <Select.Option value="demo2">实习</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title="模块负责人-工单-痕迹"
        footer=""
        destroyOnClose
        width={900}
        visible={isModalVisible == 'eservice-track'}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <Table columns={columns} dataSource={data} />
        </div>
      </Modal>
    </>
  );
};
export default UserManage;
