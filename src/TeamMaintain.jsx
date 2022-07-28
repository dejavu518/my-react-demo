// @人员管理-人员清单-团队维护
import MySearchCondition from '@/components/MyTable/components/MySearchCondition';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Space,
  Dropdown,
  Menu,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Transfer,
  Tree,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { FormattedMessage, useIntl, Link } from 'umi';
import TableList from '../../components/TableList';
import { changeTeamStatus, saveTeam } from '@/services/swagger/eservice';
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
  const onGetQueryParam = (params) => {
    setQueryParam(() => {
      return params;
    });
  };
  // 顶部链接按钮
  const HeaderExtra = (
    <>
      {/* 无效团队 */}
      <Link to="/workbench/personnel-management/personnel-list/team-maintain/invalid-team">
        无效团队
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
        新增团队
      </Button>
    </>
  );
  const checkOptions = ['工单类型A', '工单类型B', '工单类型C'];
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
                onClick={() => {
                  setAddUserModal(true);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                添加用户
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
                无效
              </span>
            ),
          },
          // 日志
          {
            key: '3',
            label: (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  console.log(record);
                  onViewLog(record);
                }}
                style={{ display: 'inline-block', width: '100%' }}
              >
                <FormattedMessage id="pages.log" defaultMessage="日志" />
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
        {/* 详情 */}
        <a
          key="edit"
          onClick={(e) => {
            e.preventDefault();
            setAddEditStatus('edit');
            setModalVisible(true);
            setCurrentRow(record);
            form.setFieldsValue({
              team_id: record.Team_No,
              team_name: record.Team_Name,
            });
          }}
        >
          编辑
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
      title: '团队ID',
      dataIndex: 'Team_No',
      sorter: true,
      valueType: 'text',
    },
    {
      title: '团队名称',
      dataIndex: 'Team_Name',
      valueType: 'text',
    },
    {
      title: '团队处理权限',
      dataIndex: 'team_privilege',
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
  const checkChange = (v) => {
    console.log(v, 999999);
  };
  /**
   * 详情
   */
  function onDetail(rowData) {
    alert('clicked invalid, status' + JSON.stringify(rowData));
  }
  /**
   * 移除
   */
  function onRemove(record) {
    const confirm = Modal.confirm({
      title: '提示',
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
        title={addEditStatus == 'add' ? '新增团队' : '编辑'}
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
            label="团队ID"
            name="team_id"
            rules={[{ required: true }]}
            style={{ display: addEditStatus == 'add' ? 'none' : 'block' }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item label="团队名称" name="team_name" rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="团队处理权限" name="privilege" rules={[{ required: true }]}>
            <div
              style={{
                border: '1px solid #f5f5f5',
                height: '212px',
                width: '100%',
                padding: '10px 18px',
              }}
            >
              <div style={{ width: '100%', marginBottom: '16px' }}>
                <Checkbox.Group options={checkOptions} onChange={checkChange} />
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      {/* 添加用户弹框 */}
      <Modal
        visible={addUserModal}
        title="添加用户"
        onCancel={() => {
          setAddUserModal(false);
        }}
      >
        <Form labelCol={{ span: 24 }}>
          <Form.Item label="用户选择" name="user_choose" rules={[{ required: true }]}>
            <Transfer
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
    </>
  );
};
export default Personnel;
