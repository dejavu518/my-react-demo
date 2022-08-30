// @人员管理-人员清单-团队维护
import MySearchCondition from '@/components/MyTable/components/MySearchCondition';
import { DownOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Dropdown, Form, Input, Menu, message, Modal, Space, Table, Transfer } from 'antd';
import { useRef, useState } from 'react';
import { FormattedMessage, Link, useIntl } from 'umi';
import TableList from '../../components/TableList';
import { changeTeamStatus, getTeamInfo, saveTeam } from '@/services/swagger/eservice';
import { $ExportExcel } from '@/utils/common';
const rangePickerProps = {
  showTime: false,
};

const Personnel = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState({});
  const [queryParam, setQueryParam] = useState({});
  const [addEditStatus, setAddEditStatus] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [traceModal, setTraceModal] = useState(false);
  const onGetQueryParam = (params) => {
    setQueryParam(() => {
      return params;
    });
  };
  // 顶部链接按钮
  const HeaderExtra = (
    <>
      {/* 无效团队 */}
      <Link to="/workbench1/personnel-management/personnel-list/team-maintain/invalid-team">
        {intl.formatMessage({
          id: 'pages.personnelManagement.invalidTeam',
          defaultMessage: '无效团队',
        })}
      </Link>
      {/* 新增团队 */}
      <Button
        style={{ marginLeft: '8px' }}
        type="primary"
        onClick={(e) => {
          e.preventDefault();
          setModalVisible(true);
          setAddEditStatus('add');
        }}
      >
        {intl.formatMessage({
          id: 'pages.personnelManagement.addTeam',
          defaultMessage: '新增团队',
        })}
      </Button>
    </>
  );
  // ...菜单按钮
  const menu = (record) => {
    return (
      <Menu
        items={[
          // 添加用户
          {
            key: '1',
            label: (
              <span
                onClick={(e) => {
                  onDetail(record);
                  e.preventDefault();
                  setAddEditStatus('edit');
                  setModalVisible(true);
                  setCurrentRow(record);
                  form.setFieldsValue({
                    team_id: record.Team_No,
                    team_name: record.Team_Name,
                  });
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                {intl.formatMessage({
                  id: 'pages.edit',
                  defaultMessage: '编辑',
                })}
              </span>
            ),
          },
          // 无效
          {
            key: '2',
            label: (
              <span
                onClick={() => {
                  onRemove(record);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                {intl.formatMessage({ id: 'pages.usermanage.invalidate', defaultMessage: '无效' })}
              </span>
            ),
          },
          // 痕迹
          {
            key: '3',
            label: (
              <span
                onClick={() => {
                  setTraceModal(true);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                {intl.formatMessage({
                  id: 'pages.personnelManagement.trace',
                  defaultMessage: '痕迹',
                })}
              </span>
            ),
          },
        ]}
      />
    );
  };
  // 操作按钮
  const operateButtons = (_, record) => {
    return (
      <Space key={record.User_Guid}>
        {/* 设置用户 */}
        <a
          key="add"
          onClick={(e) => {
            setAddUserModal(true);
          }}
        >
          设置用户
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
    );
  };
  // 表格列
  const tableColumns = [
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.teamID',
        defaultMessage: '团队ID',
      }),
      dataIndex: 'Team_No',
      sorter: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.teamName',
        defaultMessage: '团队名称',
      }),
      dataIndex: 'Team_Name',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.userList',
        defaultMessage: '用户清单',
      }),
      dataIndex: 'user_list',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.operate', defaultMessage: 'Operate' }),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return [operateButtons(_, record)];
      },
    },
  ];
  const traceData = [
    {
      Team_Name: '团队名称1',
      action: '开始',
      time: '2022-07-28 16:00',
      operator: '张三',
    },
    {
      Team_Name: '团队名称2',
      action: '移除',
      time: '2022-07-28 16:00',
      operator: '张三',
    },
    {
      Team_Name: '团队名称3',
      action: '开始',
      time: '2022-07-28 16:00',
      operator: '张三',
    },
  ];
  // 痕迹表格列
  const traceColumns = [
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.teamName',
        defaultMessage: '团队名称',
      }),
      dataIndex: 'Team_Name',
      valueType: 'text',
      key: 'Team_Name',
    },
    {
      title: intl.formatMessage({ id: 'pages.personnelManagement.action', defaultMessage: '动作' }),
      dataIndex: 'action',
      valueType: 'text',
      key: 'action',
    },
    {
      title: intl.formatMessage({ id: 'pages.time', defaultMessage: '时间' }),
      dataIndex: 'time',
      valueType: 'text',
      key: 'time',
    },
    {
      title: intl.formatMessage({ id: 'pages.operator', defaultMessage: '操作人' }),
      dataIndex: 'operator',
      valueType: 'text',
      key: 'operator',
    },
  ];
  const checkChange = (v) => {
    console.log(v, 999999);
  };
  /**
   * 详情
   */
  function onDetail(record) {
    let param = {
      team_guid: record.Team_GUID,
    };
    getTeamInfo(param).then((res) => {});
  }
  /**
   * 移除
   */
  function onRemove(record) {
    const confirm = Modal.confirm({
      title: intl.formatMessage({ id: 'pages.confirm.title', defaultMessage: '提示' }),
      content: (
        <div>
          <p>
            用户（<span style={{ color: '#21BB71' }}>{record.User_ID}</span>
            ）当前无责任工单，可直接移除。移除用户后，如需再次使用，可重新添加该用户。是否确认移除？
          </p>
        </div>
      ),
      onOk() {
        let info = {
          sysrsc_no: 'TREE299',
          menursc_no: 'TREE299_01',
          handlersc_no: 'BTN_001',
          team_guid: record.Team_GUID,
          team_status: '0',
        };
        changeTeamStatus(info).then((res) => {
          if (res.success) {
            message.success('操作成功');
            confirm.destroy();
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  /**
   * 保存团队（新增/编辑）
   * **/
  const onSaveTeam = () => {
    form.validateFields().then((values) => {
      let info = {
        sysrsc_no: 'TREE299',
        menursc_no: 'TREE299_01',
        handlersc_no: 'BTN_001',
        team_guid: addEditStatus === 'edit' ? currentRow.Team_GUID : '',
        team_name: values.team_name,
        team_status: '1',
        workordertype_guid: '25961153-07aa-4f6d-bb76-a99c889fafd0',
      };
      saveTeam(info).then((res) => {
        if (res.success) {
          setModalVisible(false);
          if (addEditStatus === 'add') {
            message.success('添加成功');
          } else {
            message.success('修改成功');
          }
        }
      });
    });
  };
  // *************穿梭框****************
  const mockData = Array.from({
    length: 20,
  }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
  }));
  const initialTargetKeys = mockData
    .filter((item) => Number(item.key) > 10)
    .map((item) => item.key);
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };
  // ***********************************
  return (
    <>
      <PageHeaderWrapper extra={HeaderExtra} />
      <MySearchCondition
        search={onGetQueryParam}
        queryTypes={tableColumns}
        rangePickerProps={rangePickerProps}
      />
      <TableList queryParam={queryParam} columns={tableColumns} teamList={true} />
      <Modal
        maskClosable={false}
        title={
          addEditStatus == 'add'
            ? intl.formatMessage({
                id: 'pages.personnelManagement.addTeam',
                defaultMessage: '新增团队',
              })
            : intl.formatMessage({
                id: 'pages.personnelManagement.editTeam',
                defaultMessage: '编辑团队',
              })
        }
        width={392}
        visible={isModalVisible}
        onOk={onSaveTeam}
        destroyOnClose
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={form}>
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.personnelManagement.teamID',
              defaultMessage: '团队ID',
            })}
            name="team_id"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.personnelManagement.teamName',
              defaultMessage: '团队名称',
            })}
            name="team_name"
            rules={[{ required: true }]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'pages.usermanage.from.placeholder',
                defaultMessage: '请输入',
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* 添加用户弹框 */}
      <Modal
        maskClosable={false}
        visible={addUserModal}
        title={intl.formatMessage({
          id: 'pages.personnelManagement.addUser',
          defaultMessage: '添加用户',
        })}
        onCancel={() => {
          setAddUserModal(false);
        }}
      >
        <Form labelCol={{ span: 24 }}>
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.personnelManagement.userChoose',
              defaultMessage: '用户选择',
            })}
            name="user_choose"
            rules={[{ required: true }]}
          >
            <Transfer
              showSearch
              dataSource={mockData}
              titles={['Source', 'Target']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              onScroll={onScroll}
              render={(item) => item.title}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* 痕迹弹框 */}
      <Modal
        maskClosable={false}
        title={intl.formatMessage({
          id: 'pages.personnelManagement.trace',
          defaultMessage: '痕迹',
        })}
        visible={traceModal}
        width={938}
        onCancel={() => {
          setTraceModal(false);
        }}
      >
        <Table dataSource={traceData} columns={traceColumns} />
      </Modal>
    </>
  );
};
export default Personnel;
