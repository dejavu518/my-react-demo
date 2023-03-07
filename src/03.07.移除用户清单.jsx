/*
 * @Author: dejavu518 cf_1118sab@163.com
 * @Date: 2022-08-29 14:42:39
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2023-03-07 14:55:27
 * @FilePath: \BM.Web.CIMS\src\pages\eService\personnelManagement\PersonnelList\RemovedList\index.jsx
 * @Description:移除用户清单
 */
// @人员管理-移除用户清单
import MySearchCondition from '@/components/MyTable/components/MySearchCondition';
import {
  changeTeam,
  getChangeTeamList,
  saveTeam,
  getUserTeamMarkList,
} from '@/services/swagger/eservice';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, message, Modal, Space, Table, Checkbox } from 'antd';
import { useRef, useState, useEffect } from 'react';
import TableList from '../../components/TableList';
import { useIntl, useModel } from 'umi';
const rangePickerProps = {
  showTime: false,
};

const Personnel = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const tableRef = useRef(null);
  const [queryParam, setQueryParam] = useState({});
  const [moveVisible, setMoveVisible] = useState(false);
  const [traceModal, setTraceModal] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [traceData, setTraceData] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [addTeamVisible, setAddTeamVisible] = useState(false);
  const [pagination, setPagination] = useState({
    currentpageindex: 1,
    pagesize: 10,
  });
  const [checkedTeamArr, setCheckedTeamArr] = useState([]);
  const onGetQueryParam = (params) => {
    setQueryParam(() => {
      return params;
    });
  };
  const [teamAll, setTeamAll] = useState(false);

  // 操作按钮
  const operateButtons = (_, record) => {
    return (
      <Space key={record.User_GUID}>
        {/* 移入 */}
        {record.User_Status == 1 && (
          <a
            key="restore"
            onClick={(e) => {
              setCurrentRow(record);
              getTeamData(record);
              e.preventDefault();
              setMoveVisible(true);
            }}
          >
            {intl.formatMessage({
              id: 'pages.personnelManagement.turnInto',
              defaultMessage: '移入',
            })}
          </a>
        )}
        {/* 痕迹*/}
        <a
          key="log"
          onClick={(e) => {
            e.preventDefault();
            getTraceData(record);
            setTraceModal(true);
          }}
        >
          {intl.formatMessage({
            id: 'pages.trace',
            defaultMessage: '痕迹',
          })}
        </a>
      </Space>
    );
  };
  // 获取痕迹数据
  function getTraceData(record) {
    let info = {
      jsonData: {
        currentpageindex: 1,
        pagesize: 10,
        user_guid: record.User_GUID,
        team_guid: '',
      },
    };
    getUserTeamMarkList(info).then((res) => {
      if (res.success) {
        setTraceData(() => {
          return res.data?.list || [];
        });
      }
    });
  }
  const teamColumns = [
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.teamID',
        defaultMessage: '团队ID',
      }),
      dataIndex: 'Team_No',
      valueType: 'text',
      key: 'Team_No',
      width: 120,
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.teamName',
        defaultMessage: '团队名称',
      }),
      dataIndex: 'Team_Name',
      valueType: 'text',
      key: 'Team_Name',
      // width: 160,
    },
    {
      title: intl.formatMessage({ id: 'pages.operate', defaultMessage: 'Operate' }),
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      align: 'center',
      render: (_, record) => {
        return [operateCheckbox(_, record)];
      },
    },
  ];
  // 痕迹表格列
  const traceColumns = [
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.teamName',
        defaultMessage: '团队名称',
      }),
      dataIndex: 'TeamName',
      valueType: 'text',
      width: 215,
      key: 'Team_Name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.action',
        defaultMessage: '动作',
      }),
      dataIndex: 'Operation_Type',
      valueType: 'text',
      width: 215,
      key: 'action',
      render: (value, record) => {
        return value === 'start'
          ? intl.formatMessage({
              id: 'pages.power.start',
              defaultMessage: '开始',
            })
          : value === 'end'
          ? intl.formatMessage({
              id: 'pages.power.end',
              defaultMessage: '结束',
            })
          : value;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.time',
        defaultMessage: '时间',
      }),
      dataIndex: 'Operation_Date',
      valueType: 'text',
      key: 'time',
    },
    {
      title: intl.formatMessage({
        id: 'pages.operator',
        defaultMessage: '操作人',
      }),
      dataIndex: 'OperationName',
      valueType: 'text',
      key: 'operator',
      width: 200,
    },
  ];
  // 操作复选框
  const operateCheckbox = (_, record) => {
    return (
      <div style={{ textAlign: 'center' }}>
        <Checkbox
          checked={teamAll ? true : false}
          onChange={(e) => {
            let checked = e.target.checked;
            if (checked) {
              setCheckedTeamArr(() => {
                let arr = [];
                arr.push("'" + record.Team_GUID + "'");
                return [...arr, ...checkedTeamArr];
              });
            }
          }}
        />
      </div>
    );
  };
  // 表格列
  const tableColumns = [
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.userID',
        defaultMessage: '用户ID',
      }),
      dataIndex: 'User_No',
      key: 'User_No',
      sorter: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnelManagement.userName',
        defaultMessage: '用户姓名',
      }),
      dataIndex: 'User_FullName',
      key: 'User_FullName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.status',
        defaultMessage: '状态',
      }),
      dataIndex: 'User_Status',
      key: 'User_Status',
      valueType: 'text',
      valueEnum: {
        1: {
          text: intl.formatMessage({ id: 'pages.usermanage.validate', defaultMessage: '有效' }),
        },
        0: {
          text: intl.formatMessage({ id: 'pages.usermanage.invalidate', defaultMessage: '无效' }),
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.operate', defaultMessage: 'Operate' }),
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      render: (_, record) => {
        return [operateButtons(_, record)];
      },
    },
  ];

  /**
   * @description: 获取移入团队列表
   * @param {*} record
   * @return {*}
   */
  function getTeamData(record) {
    let info = {
      user_guid: record.User_GUID,
    };
    getChangeTeamList(info).then((res) => {
      if (res.success) {
        setTeamData(res.data);
      }
    });
  }
  /**
   * 保存团队（新增/编辑）
   * **/
  const onSaveTeam = () => {
    form.validateFields().then((values) => {
      let info = {
        sysrsc_no: 'TREE001',
        menursc_no: 'TREE001_02',
        handlersc_no: 'ACTION003',
        team_guid: '',
        team_name: values.team_name,
        team_status: '1',
        workordertype_guid: '',
      };
      saveTeam(info).then((res) => {
        if (res.success) {
          setAddTeamVisible(false);
          getTeamData(currentRow);
          message.success(
            intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功' }),
          );
        }
      });
    });
  };
  /**
   * @description: 保存移入团队
   * @return {*}
   */
  const saveMoveIn = () => {
    let info = {
      sysrsc_no: 'TREE001',
      menursc_no: 'TREE001_02',
      handlersc_no: 'ACTION007',
      team_guid_str: checkedTeamArr.toString(),
      user_guid_str: currentRow.User_GUID,
    };
    changeTeam(info).then((res) => {
      if (res.success) {
        setMoveVisible(false);
        message.success(
          intl.formatMessage({
            id: 'pages.operate.success',
            defaultMessage: '操作成功！',
          }),
        );
        tableRef.current.renderTable(pagination, queryParam);
      } else {
        message.error(
          intl.formatMessage(
            {
              id: 'pages.personnelManagement.removeIn.tip',
              defaultMessage: '当前用户（{0}）已被删除，操作失败',
            },
            { 0: currentRow.User_No + '-' + currentRow.User_FullName },
          ),
        );
      }
    });
  };
  // 更改团队All改变
  const teamCheckedChange = (e) => {
    let checked = e.target.checked;
    if (checked) {
      setTeamAll(true);
    } else {
      setTeamAll(false);
    }
  };
  /* 内容更新钩子 */
  const { tableSearch } = useModel('UserManageModel');
  useEffect(() => {
    // tableSearch为true,触发表单初始化重载
    if (tableSearch) {
      setPagination({
        currentpageindex: 1,
        pagesize: 10,
      });
      setQueryParam([]);
      tableRef.current.renderTable(pagination, queryParam);
    }
  }, [tableSearch]);
  return (
    <>
      <PageHeaderWrapper />
      <MySearchCondition
        search={onGetQueryParam}
        queryTypes={tableColumns}
        rangePickerProps={rangePickerProps}
      />
      <TableList
        ref={tableRef}
        queryParam={queryParam}
        columns={tableColumns}
        // teamList={true}
        removedList={true}
      />
      {/* 添加团队 */}
      <Modal
        maskClosable={false}
        title={intl.formatMessage({
          id: 'pages.personnelManagement.addTeam',
          defaultMessage: '新增团队',
        })}
        width={392}
        visible={addTeamVisible}
        onOk={onSaveTeam}
        destroyOnClose
        onCancel={() => {
          setAddTeamVisible(false);
          form.resetFields();
        }}
      >
        <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={form}>
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
      <Modal
        centered
        maskClosable={false}
        visible={moveVisible}
        title={
          intl.formatMessage({ id: 'pages.personnelManagement.turnInto', defaultMessage: '移入' }) +
          '(' +
          currentRow.User_No +
          '-' +
          currentRow.User_FullName +
          ')'
        }
        width={392}
        onOk={saveMoveIn}
        onCancel={() => {
          setMoveVisible(false);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span>
              {intl.formatMessage({
                id: 'pages.personnelManagement.participateTeam',
                defaultMessage: '参与团队',
              })}
            </span>
            <PlusOutlined
              style={{ lineHeight: '26px', color: '#21BB7E' }}
              onClick={() => {
                setAddTeamVisible(true);
              }}
            />
          </div>
          <div>
            <Checkbox onChange={teamCheckedChange} checked={teamAll} />
            <span style={{ marginLeft: '5px' }}>All</span>
          </div>
        </div>
        <Table
          columns={teamColumns}
          dataSource={teamData}
          rowKey="key"
          pagination={false}
          scroll={{ y: 200 }}
        />
      </Modal>
      {/* 痕迹弹框 */}
      <Modal
        centered
        maskClosable={false}
        title={
          intl.formatMessage({
            id: 'pages.personnelManagement.trace',
            defaultMessage: '痕迹',
          }) +
          '(' +
          currentRow.User_No +
          '-' +
          currentRow.User_FullName +
          ')'
        }
        visible={traceModal}
        footer={false}
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
