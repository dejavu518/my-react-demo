/*
 * @Author: WhiteWen 849019060@qq.com
 * @Date: 2022-07-14 15:14:21
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2022-12-22 15:34:26
 * @FilePath: \my-react-demo\src\12.22原工单类型.jsx
 * @Description: 工单维护-工单类型维护
 *
 */
import MySearchCondition from '@/components/MyTable/components/MySearchCondition';
import {
  getTeamList,
  getWorkOrderInfo,
  saveTeamPrivilege,
  saveWorkOrderTypeStatus,
  getWorkOrderTemplateInfo,
  getTeamUserList2,
  getCustomerTeamList,
  getTeamUserInfoByMultiple,
  saveCusTeamPrivilege,
} from '@/services/swagger/eservice';
import { getCommonUserList } from '@/services/swagger/user';
import { DownOutlined, InfoCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Dropdown,
  Form,
  Popover,
  Menu,
  message,
  Modal,
  TreeSelect,
  Space,
  Table,
  Transfer,
  Tooltip,
  Select,
  Checkbox,
} from 'antd';
import { Children, useEffect, useRef, useState } from 'react';
import { FormattedMessage, history, Link, useIntl, useModel } from 'umi';
import TableList from './TableList';
import AddOrderType from './AddOrderType';
import { set } from 'lodash';
const rangePickerProps = {
  showTime: false,
};
const UserManage = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState('0');
  const [activeKey, setActiveKey] = useState('tab1');
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [pagination, setPagination] = useState({
    currentpageindex: 1,
    pagesize: 20,
  });
  const tableRef = useRef(null);
  const [currentRow, setCurrentRow] = useState({});
  const [queryParam, setQueryParam] = useState({});
  const [queryParam2, setQueryParam2] = useState({});
  const [addEditStatus, setAddEditStatus] = useState();
  const [clientVisible, setClientVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [sortParam, setSortParam] = useState({
    sorting: 'team_guid',
    sortdir: 'asc',
  });
  const [treeData, setTreeData] = useState([]);
  const [transferDisabled, setTransferDisabled] = useState(true);
  const showModal = (modalName) => {
    setIsModalVisible(modalName);
  };
  const onGetQueryParam = (params) => {
    setQueryParam(() => {
      return params;
    });
  };
  // 更改授权的Param
  const onGetQueryParam2 = (params) => {
    setQueryParam2(() => {
      return params;
    });
  };
  const [templateList, setTemplateList] = useState([]);
  const [handlerList, setHandlerList] = useState([]);
  const [handlerTeamList, setHandlerTeamList] = useState([]);
  const [handlerTeamGuid, setHandlerTeamGuid] = useState();
  const [teamOpen, setTeamOpen] = useState(false);
  const [handlerOpen, setHandlerOpen] = useState(false);
  const [handlerSel, setHandlerSel] = useState();
  const [selectDisabled, setSelectDisabled] = useState(false);
  const [checkDisabled, setCheckDisabled] = useState(false);
  const [listCekVal, setListCekVal] = useState({}); //列表checkbox 值
  const [listSelVal, setListSelVal] = useState({}); //列表select 值
  const [userSelVal, setUserSelVal] = useState({}); //列表select 值
  const [listCekDis, setListCekDis] = useState({}); //列表checkbox disable
  const [listSelDis, setListSelDis] = useState({}); //列表select disable
  const [listAllCek, setListAllCek] = useState(false);
  const [listAllVal, setListAllVal] = useState([]);
  const [userAllVal, setUserAllVal] = useState([]);
  const [customerTeamList, setCustomerTeamList] = useState([]);
  const [cusList, setCusList] = useState([]);

  // 顶部链接按钮
  const HeaderExtra = (
    <>
      {/* 无效类型 */}
      {!history.location.pathname.includes('invalid-type') ? (
        <>
          <Link to="/workbench1/workorder-setting/type/allotList">
            {intl.formatMessage({
              id: 'pages.eservice.schedule',
              defaultMessage: '分配一览表',
            })}
          </Link>
          &nbsp;|&nbsp;
          <Link to="/workbench1/workorder-setting/type/client-list">
            {intl.formatMessage({
              id: 'pages.eservice.clientList',
              defaultMessage: '客户清单',
            })}
          </Link>
          &nbsp;|&nbsp;{' '}
          <Link to="/workbench1/workorder-setting/type/invalid-type">
            {intl.formatMessage({
              id: 'pages.eservice.invalidType',
              defaultMessage: '无效类型',
            })}
          </Link>
          &nbsp;|&nbsp;
          {/* 新增类型 */}
          <Button
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              setAddEditStatus('add');
              showModal('add-edit-user');
            }}
          >
            {intl.formatMessage({ id: 'pages.eservice.addType', defaultMessage: '新增类型' })}
          </Button>
        </>
      ) : (
        ''
      )}
    </>
  );
  const alloLabel = (
    <>
      <span style={{ fontSize: '14px' }}>
        {intl.formatMessage({ id: 'pages.eservice.allocation', defaultMessage: '分配机制' })}
      </span>
      <Tooltip
        title={intl.formatMessage({
          id: 'pages.eservice.allocate.tip',
          defaultMessage: '(更改分配机制后，将清空已授权数据)',
        })}
      >
        <InfoCircleFilled style={{ color: '#999', marginLeft: '5px' }} />
      </Tooltip>
    </>
  );
  function toTreeData() {
    let arr = teamList.concat();
    arr.forEach((item) => {
      item['id'] = item.Team_GUID;
      item['key'] = item.Team_GUID;
      item['title'] = item.Team_Name;
    });
    let treeArr = [];
    arr.forEach((item) => {
      treeArr.push({
        value: item.id,
        key: item.id,
        title: item.title,
      });
    });
    let treeData = [
      {
        title: 'ALL',
        value: 'fdg5445',
        key: 'fdg5445',
        children: treeArr,
      },
    ];
    setTreeData(treeData);
  }
  /**
   * @description: 获取团队
   * @return {*}
   */
  function getTeam() {
    const tableParam = {
      jsonData: {
        currentwhere: [],
        ...pagination,
        ...sortParam,
        team_status: '1',
      },
    };
    getTeamList(tableParam).then((res) => {
      if (res.success) {
        setTeamList(() => {
          return res.data?.list || [];
        });

        let newarr = [];
        res.data.list.forEach((item) => {
          newarr.push("'" + item.Team_GUID + "'");
        });
        setHandlerTeamGuid(newarr.join(','));
      }
    });
  }
  useEffect(() => {
    // const tableParam = {
    //   jsonData: {
    //     currentwhere: [],
    //     ...pagination,
    //     ...sortParam,
    //     team_status: '1',
    //   },
    // };
    // getTeamList(tableParam).then((res) => {
    //   if (res.success) {
    //     setTeamList(() => {
    //       return res.data?.list || [];
    //     });
    //   }
    // });
    getTeam();
  }, []);
  /**
   * @description: 设置状态  0无效 | 1有效
   * @param {*} record 行数据
   * @return {*}
   */
  function onSetStatus(record) {
    const toStatus = record.WorkOrderType_Status ? 0 : 1;
    const reqData = {
      sysrsc_no: 'TREE001',
      menursc_no: 'TREE001_03',
      handlersc_no: toStatus == 0 ? 'ACTION004' : 'ACTION008',
      workordertype_guid: record.WorkOrderType_GUID,
      workordertype_status: toStatus,
    };
    let tipContent = '';
    if (toStatus == 0) {
      tipContent = intl
        .formatMessage({
          id: 'pages.eservice.sureInvalid',
          defaultMessage:
            '工单类型（{0}）无效后将无法使用，已使用的历史数据不受影响，您可以在无效类型列表查阅。是否确认无效？',
        })
        .replace('{0}', record.WorkOrderType_No + '-' + record.WorkOrderType_Name);
    } else {
      tipContent = intl
        .formatMessage({
          id: 'pages.eservice.sureRecovery',
          defaultMessage: '工单类型（{0}）恢复后可在工单类型列表查阅，是否确认恢复？',
        })
        .replace('{0}', record.WorkOrderType_No + '-' + record.WorkOrderType_Name);
    }
    const validateConfirm = Modal.confirm({
      centered: true,
      title: intl.formatMessage({ id: 'pages.confirm.title', defaultMessage: '提示' }),
      content: tipContent,
      icon: <QuestionCircleFilled />,
      onOk:
        record.count === 0
          ? async function () {
              const res = await saveWorkOrderTypeStatus(reqData);
              if (res.success) {
                message.success(res.message);
                validateConfirm.destroy();
                tableRef.current.renderTable(pagination, queryParam, activeKey);
              }
            }
          : async function () {
              message.error(
                '工单类型（' +
                  record.WorkOrderType_No +
                  '-' +
                  record.WorkOrderType_Name +
                  '）正在使用中，无效失败！',
              );
            },

      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //日志
  function onViewLog(record, flag) {
    history.push({
      pathname:
        flag === 'invalid'
          ? '/workbench1/workorder-setting/type/invalid-type/log'
          : '/workbench1/workorder-setting/type/log',
      query: {
        ID: record.WorkOrderType_No,
        name: record.WorkOrderType_Name,
        type: 'operate',
        id: record.WorkOrderType_GUID,
      },
    });
  }
  // 操作列的-下拉按钮
  const dropdownOperateButtons = (record) => {
    const items = [
      // 编辑
      {
        key: '0',
        label: (
          <span
            onClick={(e) => {
              e.preventDefault();
              showModal('add-edit-user');
              setAddEditStatus('edit');
              setCurrentRow(record);
              getDetail(record);
            }}
            style={{ display: 'inline-block', width: '100%' }}
          >
            <FormattedMessage id="pages.edit" defaultMessage="编辑" />
          </span>
        ),
      },
      // 无效 / 恢复
      {
        key: '1',
        label: (
          <span
            onClick={() => {
              setCurrentRow(record);
              onSetStatus(record);
            }}
            style={{ display: 'inline-block', width: '100%' }}
          >
            {record.WorkOrderType_Status === 1 ? (
              <FormattedMessage id="pages.usermanage.invalidate" defaultMessage="无效" />
            ) : (
              <FormattedMessage id="pages.restore" defaultMessage="恢复" />
            )}
          </span>
        ),
      },
      // 日志
      {
        key: '2',
        label: (
          <span
            onClick={() => {
              onViewLog(record);
            }}
            style={{ display: 'inline-block', width: '100%' }}
          >
            <FormattedMessage id="pages.log" defaultMessage="日志" />
          </span>
        ),
      },
    ];
    return <Menu items={items} />;
  };
  // 操作按钮
  const operateButtons = (tabkey, record) => {
    return record.WorkOrderType_Status === 1 ? (
      <Space key={record.WorkOrderType_Status}>
        <a
          key="change"
          onClick={() => {
            toTreeData();
            setCurrentRow(record);
            if (record.Distribution_Flag === 0) {
              setCurrentRow(record);
              getClientTeamList(record);
              setClientVisible(true);
            } else if (record.Distribution_Flag === 1) {
              getAllUsers();
              setTeamVisible(true);
            }
          }}
        >
          {intl.formatMessage({
            id: 'pages.eservice.changeAuthorization',
            defaultMessage: '更改授权',
          })}
        </a>
        {/* 下拉菜单 */}
        <Dropdown key="more" placement="bottomRight" overlay={dropdownOperateButtons(record)}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {intl.formatMessage({ id: 'pages.more', defaultMessage: '更多' })}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    ) : (
      <Space key={record.WorkOrderType_Status}>
        <a
          key="recovery"
          onClick={(e) => {
            e.preventDefault();
            setCurrentRow(record);
            onSetStatus(record);
          }}
        >
          <FormattedMessage id="pages.restore" defaultMessage="恢复" />
        </a>
        <a
          key="edit"
          onClick={(e) => {
            e.preventDefault();
            onViewLog(record, 'invalid');
          }}
        >
          <FormattedMessage id="pages.log" defaultMessage="日志" />
        </a>
      </Space>
    );
  };
  // 表格列
  const tableColumns = [
    {
      title: intl.formatMessage({
        id: 'pages.eservice.workOrderTypeID',
        defaultMessage: '类型ID',
      }),
      dataIndex: 'WorkOrderType_No',
      key: 'WorkOrderType_No',
      sorter: true,
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.workOrderType',
        defaultMessage: '工单类型',
      }),
      dataIndex: 'WorkOrderType_Name',
      key: 'WorkOrderType_Name',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.allocation',
        defaultMessage: '分配机制',
      }),
      dataIndex: 'Distribution_Flag',
      valueType: 'text',
      sorter: true,
      valueEnum: {
        0: {
          text: intl.formatMessage({
            id: 'pages.eservice.allocation.way1',
            defaultMessage: '按客户团队绑定',
          }),
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.eservice.allocation.way2',
            defaultMessage: '按团队绑定',
          }),
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.templateList',
        defaultMessage: '模板清单',
      }),
      hideInTable: history.location.pathname.includes('invalid-type') ? true : false,
      dataIndex: 'count',
      key: 'count',
      sorter: true,
      valueType: 'text',
      renderText: (value, record) => {
        return (
          <Button
            type="link"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRow(record);
              getTemplateList(record);
              showModal('templateList');
            }}
          >
            {value || 0}
          </Button>
        );
      },
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
  // useEffect(() => {
  //   getClientTeamList(currentRow);
  // }, [queryParam2]);
  /**
   * @description: 获取客户团队列表
   * @param {*} record 行数据
   * @return {*}
   */
  function getClientTeamList(record) {
    let info = {
      jsonData: {
        currentwhere: queryParam2.length ? JSON.stringify(queryParam2) : [],
        workordertype_guid: record.WorkOrderType_GUID,
      },
    };
    getCustomerTeamList(info).then((res) => {
      if (res.success) {
        setCustomerTeamList(res.data);
        let dt = res.data;
        let req = {
          type: 1,
        };
        getCommonUserList(req).then((res) => {
          if (res.success) {
            let teamUserArr = res.data.map((item) => {
              return "'" + item.User_GUID + "'";
            });
            let obj = {};
            dt.forEach((item) => {
              obj[item.Customer_GUID] = res.data;
            });
            setAllUserOption(() => {
              return {
                ...obj,
                ...allUserOption,
              };
            });

            setCusList(() => {
              let arr = dt;
              arr.forEach((item) => {
                Object.assign(item, { team_guid_str: teamUserArr.join() });
              });
              return arr;
            });
          }
        });
      }
    });
  }
  function getTemplateList(record) {
    let info = {
      workordertype_guid: record.WorkOrderType_GUID,
    };
    getWorkOrderTemplateInfo(info).then((res) => {
      if (res.success) {
        setTemplateList(res.data);
      } else {
        setTemplateList([]);
      }
    });
  }
  const handleOpenChange = (newOpen) => {
    // setOpen(newOpen);
  };
  // ALL选择与否
  const checkAll = (e) => {
    let checked = e.target.checked;
    setListAllCek(checked);
    if (checked) {
      setSelectDisabled(true);
    } else {
      setSelectDisabled(false);
    }
  };
  // Select选择与否
  const selectChange = (v) => {
    setListAllVal(v);
    if (v.length > 0) {
      setCheckDisabled(true);
    } else {
      setCheckDisabled(false);
    }
  };
  // 保存批量设置团队
  const saveBatchSetTeam = () => {
    //checkbox
    setListCekVal(() => {
      getAllUserList();
      let obj = {};
      selectedRowsState.forEach((item) => {
        obj[item.Customer_GUID] = listAllCek;
      });
      return { ...listCekVal, ...obj };
    });
    setListCekDis(() => {
      let obj = {};
      selectedRowsState.forEach((item) => {
        obj[item.Customer_GUID] = listAllCek;
      });
      return { ...listCekDis, ...obj };
    });

    //select
    setListSelVal(() => {
      getTeamUsers(listAllVal);
      let teamUserArr = listAllVal.map((item) => {
        return "'" + item.User_GUID + "'";
      });
      setCusList(() => {
        let arr = customerTeamList;
        arr.forEach((item) => {
          Object.assign(item, { team_guid_str: teamUserArr.join() });
        });
        return arr;
      });
      let obj = {};
      selectedRowsState.forEach((item) => {
        obj[item.Customer_GUID] = listAllVal;
      });
      return { ...listSelVal, ...obj };
    });
    setListSelDis(() => {
      let obj = {};
      selectedRowsState.forEach((item) => {
        obj[item.Customer_GUID] = listAllVal.length > 0;
      });
      return { ...listSelDis, ...obj };
    });

    setTeamOpen(false);
  };
  // 保存批量设置处理人
  const saveBatchSetHandler = () => {
    //select
    setUserSelVal(() => {
      let obj = {};
      selectedRowsState.forEach((item) => {
        obj[item.Customer_GUID] = userAllVal;
      });
      return { ...userSelVal, ...obj };
    });
    setHandlerOpen(false);
  };
  const teamSelect = (
    <>
      <Checkbox onChange={checkAll} disabled={checkDisabled} checked={listAllCek}>
        All
      </Checkbox>
      <Select
        style={{ width: '150px' }}
        onChange={selectChange}
        mode="multiple"
        value={listAllVal}
        disabled={selectDisabled}
      >
        {teamList.map((item) => {
          return (
            <Select.Option key={item.Team_GUID} value={item.Team_GUID}>
              {item.Team_Name}
            </Select.Option>
          );
        })}
      </Select>
      <div style={{ marginTop: '16px', marginLeft: '32px' }}>
        <Space key="select">
          <Button
            size="small"
            onClick={() => {
              setTeamOpen(false);
            }}
          >
            {intl.formatMessage({ id: 'pages.notice.cancel', defaultMessage: '取消' })}
          </Button>
          <Button type="primary" onClick={saveBatchSetTeam}>
            {intl.formatMessage({ id: 'pages.personnelManagement.sure', defaultMessage: '确认' })}
          </Button>
        </Space>
      </div>
    </>
  );
  const handlerSelChange = (v) => {
    setUserAllVal(v);
  };
  const handlerSelect = (
    <>
      <Select
        style={{ width: '200px' }}
        onChange={handlerSelChange}
        value={userAllVal}
        placeholder={intl.formatMessage({
          id: 'pages.eservice.selectHandler',
          defaultMessage: '请选择处理人',
        })}
      >
        {handlerList.map((item) => {
          return (
            <Select.Option key={item.User_GUID} value={item.User_GUID}>
              {item.User_FullName}
            </Select.Option>
          );
        })}
      </Select>
      <div style={{ marginTop: '16px', marginLeft: '32px' }}>
        <Space key="select">
          <Button
            size="small"
            onClick={() => {
              setHandlerOpen(false);
            }}
          >
            {intl.formatMessage({ id: 'pages.notice.cancel', defaultMessage: '取消' })}
          </Button>
          <Button type="primary" onClick={saveBatchSetHandler}>
            {intl.formatMessage({ id: 'pages.personnelManagement.sure', defaultMessage: '确认' })}
          </Button>
        </Space>
      </div>
    </>
  );
  // 服务团队表头
  const serveTeamTitle = (
    <>
      <span>
        {intl.formatMessage({
          id: 'pages.eservice.serveTeam',
          defaultMessage: '服务团队',
        })}
      </span>
      <Popover
        placement="bottom"
        trigger="click"
        icon={false}
        content={teamSelect}
        visible={teamOpen}
        onOpenChange={handleOpenChange}
      >
        <DownOutlined
          onClick={() => {
            if (selectedRowsState.length === 0) {
              message.error(
                intl.formatMessage({
                  id: 'pages.eservice.checkList',
                  defaultMessage: '请先勾选列表项',
                }),
              );
              return;
            }

            setTeamOpen(true);
            getTeam();
          }}
        />
      </Popover>
    </>
  );
  // 处理人表头
  const handlerTitle = (
    <>
      <span>
        {intl.formatMessage({
          id: 'pages.eservice.handler',
          defaultMessage: '处理人',
        })}
      </span>
      <Popover
        placement="bottom"
        trigger="click"
        icon={false}
        content={handlerSelect}
        visible={handlerOpen}
        onOpenChange={handleOpenChange}
      >
        <DownOutlined
          onClick={() => {
            if (selectedRowsState.length === 0) {
              message.error(
                intl.formatMessage({
                  id: 'pages.eservice.checkList',
                  defaultMessage: '请先勾选列表项',
                }),
              );
              return;
            } else {
              let arr = [];
              selectedRowsState.forEach((item) => {
                arr.push(listSelVal[item.Customer_GUID] || [listCekVal[item.Customer_GUID]]);
              });
              const result = arr.every((item) => {
                return item.sort().toString() == arr[0].sort().toString();
              });
              if (result) {
                console.log(arr[0], '222');
                setHandlerOpen(true);
                if (arr[0][0] === true) {
                  getAllUserList('batch');
                } else {
                  getTeamUsers(arr[0], 'batch');
                }
              } else {
                message.error('请选择团队清单相同的数据');
              }
            }
          }}
        />
      </Popover>
    </>
  );
  /**
   * 表格渲染刷新
   **/
  function renderTable() {
    tableRef.current.renderTable(pagination, queryParam, activeKey);
  }
  // /**
  //  * 查询用户详情-编辑
  //  */
  function getDetail(record) {
    let params = {
      workordertype_guid: record.WorkOrderType_GUID,
    };
    getWorkOrderInfo(params).then((res) => {
      if (res.success) {
        let dt = res.data;
        form.setFieldsValue({
          distribution: dt[0].Distribution_Flag,
          workOrderTypeName: dt[0].WorkOrderType_Name,
          workOrderTypeNo: dt[0].WorkOrderType_No,
        });
      }
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
   *关闭弹框
   */
  const handleCancel = () => {
    setIsModalVisible('0');
  };

  /**
   *获取搜索参数
   */
  // const onGetQueryParam = (params) => {
  //   console.log(params);
  //   const BETWEEN = 'between';
  //   const values = params;
  //   let arr = [];
  //   for (let i in values) {
  //     const item = values[i];
  //     if (!item) {
  //       return;
  //     }
  //     // item.queryname = item.queryname.value;
  //     if (item.queryoperator == BETWEEN && Array.isArray(item.queryvalue)) {
  //       // moment格式的日期区间改为string
  //       if (/* rangeTypeObj[i] == 'picker' && */ item.queryoperator == BETWEEN) {
  //         item.queryvalue = [item.queryvalue[0].toISOString(), item.queryvalue[1].toISOString()];
  //         item.queryvalue = [item.queryvalue[0], item.queryvalue[1]];
  //       } else {
  //         item.queryvalue = item.queryvalue.join('|');
  //       }
  //     }
  //     arr.push(values[i]);
  //   }
  //   setQueryParam(() => {
  //     return arr;
  //   });
  //   /* setQueryParam(() => {
  //     return params;
  //   }); */
  // };

  /* 内容更新钩子 */
  const { tableSearch } = useModel('UserManageModel');
  useEffect(() => {
    // tableSearch为true,触发表单初始化重载
    if (tableSearch) {
      setPagination({
        currentpageindex: 1,
        pagesize: 20,
      });
      setQueryParam({});
      tableRef.current.renderTable(pagination, queryParam, activeKey);
    }
  }, [tableSearch]);

  /*
   * 重置搜索表单
   */
  const onSelect = (value, node, extra) => {
    let arr = [];
    arr.push(node.pId + '|' + value);
    console.log(arr, 111);
  };

  const checkboxChange = (e) => {
    if (!e.target.checked) {
      setHandlerTeamList([]);
      setTransferDisabled(false);
    } else {
      getAllUsers();
      setTransferDisabled(true);
    }
  };
  /**
   * @description:获取全部用户
   * @return {*}
   */
  function getAllUserList(guid) {
    let info = {
      type: 1,
    };
    getCommonUserList(info).then((res) => {
      if (res.success) {
        let teamUserArr = res.data.map((item) => {
          return "'" + item.User_GUID + "'";
        });
        if (!guid) {
          let obj = {};
          selectedRowsState.forEach((item) => {
            obj[item.Customer_GUID] = res.data;
          });
          setAllUserOption(() => {
            return {
              ...obj,
              ...allUserOption,
            };
          });

          setCusList(() => {
            let arr = customerTeamList;
            arr.forEach((item) => {
              Object.assign(item, { team_guid_str: teamUserArr.join() });
            });
            return arr;
          });
        } else {
          if (guid === 'batch') {
            setHandlerList(res.data);
          } else {
            setAllUserOption(() => {
              let obj = {};
              obj[guid] = res.data;
              return {
                ...allUserOption,
                ...obj,
              };
            });
            setCusList(() => {
              let arr = customerTeamList;
              arr.forEach((item) => {
                if (item.Customer_GUID === guid) {
                  Object.assign(item, { team_guid_str: teamUserArr.join() });
                }
              });
              return arr;
            });
          }
        }
      }
    });
  }
  /**
   * @description: 获取团队人员信息
   * @return {*}
   */
  function getTeamUsers(arr, guid) {
    if (arr.length === 0) {
      setAllUserOption(() => {
        let obj = {};
        obj[guid] = '';
        return {
          ...allUserOption,
          ...obj,
        };
      });
      return;
    }
    let teamUserArr = arr.map((item) => {
      return "'" + item + "'";
    });
    let info = {
      team_guid_str: teamUserArr.join(),
    };
    getTeamUserList2(info).then((res) => {
      if (res.success) {
        if (!guid) {
          let obj = {};
          selectedRowsState.forEach((item) => {
            obj[item.Customer_GUID] = res.data;
          });
          setAllUserOption(() => {
            return {
              ...obj,
              ...allUserOption,
            };
          });
        } else {
          if (guid === 'batch') {
            setHandlerList(res.data);
          } else {
            setAllUserOption(() => {
              let obj = {};
              obj[guid] = res.data;
              return {
                ...allUserOption,
                ...obj,
              };
            });
          }
        }
      }
    });
  }

  const [allUserOption, setAllUserOption] = useState({});

  const cusTeamColumns = [
    {
      title: intl.formatMessage({
        id: 'pages.eservice.platformID',
        defaultMessage: '平台ID',
      }),
      dataIndex: 'Customer_No',
      key: 'Customer_No',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.platformName',
        defaultMessage: '平台名称',
      }),
      dataIndex: 'Customer_Name',
      key: 'Customer_Name',
      valueType: 'text',
    },
    {
      title: serveTeamTitle,
      width: 300,
      dataIndex: 'teamList',
      key: 'teamList',
      valueType: 'text',
      render: (value, record) => {
        //列表项checkbox改变
        const checkListAll = (e) => {
          setListCekDis(() => {
            let obj = {};
            obj[record.Customer_GUID] = e.target.checked;
            return { ...listCekDis, ...obj };
          });
          setListCekVal(() => {
            let obj = {};
            obj[record.Customer_GUID] = e.target.checked;
            return { ...listCekVal, ...obj };
          });
          if (e.target.checked) {
            getAllUserList(record.Customer_GUID);
          }
        };

        //列表项Select改变
        const selectListChange = (v) => {
          getTeamUsers(v, record.Customer_GUID);
          let teamUserArr = v.map((item) => {
            return "'" + item + "'";
          });
          setCusList(() => {
            let arr = customerTeamList;
            arr.forEach((item) => {
              if (item.Customer_GUID === record.Customer_GUID) {
                Object.assign(item, { team_guid_str: teamUserArr.join() });
              }
            });
            return arr;
          });
          setListSelDis(() => {
            let obj = {};
            obj[record.Customer_GUID] = v.length > 0;
            return { ...listSelDis, ...obj };
          });

          setListSelVal(() => {
            let obj = {};
            obj[record.Customer_GUID] = v;
            return { ...listSelVal, ...obj };
          });
        };

        return (
          <>
            <Checkbox
              onChange={checkListAll}
              disabled={listSelDis[record.Customer_GUID]}
              defaultChecked
              // checked={listCekVal[record.Customer_GUID]}
            >
              All
            </Checkbox>
            <Select
              maxTagCount={1}
              style={{ width: '150px' }}
              bordered={false}
              mode="multiple"
              disabled={listCekDis[record.Customer_GUID]}
              value={listSelVal[record.Customer_GUID]}
              placeholder={intl.formatMessage({
                id: 'pages.eservice.selectTeam',
                defaultMessage: '请选择服务团队',
              })}
              onChange={selectListChange}
            >
              {teamList.map((item) => {
                return (
                  <Select.Option key={item.Team_GUID} title={item.Team_Name} value={item.Team_GUID}>
                    {item.Team_Name}
                  </Select.Option>
                );
              })}
            </Select>
          </>
        );
      },
    },
    {
      title: handlerTitle,
      dataIndex: 'handler',
      key: 'handler',
      valueType: 'text',
      render: (value, record) => {
        const teamUserChange = (v) => {
          setCusList(() => {
            cusList.forEach((item) => {
              if (item.Customer_GUID === record.Customer_GUID) {
                Object.assign(item, { principal: v });
              }
            });
            return cusList;
          });
        };
        return (
          <Select
            onChange={teamUserChange}
            bordered={false}
            // defaultValue={value}
            value={userSelVal[record.Customer_GUID]}
            placeholder={intl.formatMessage({
              id: 'pages.eservice.handler',
              defaultMessage: '处理人',
            })}
          >
            {allUserOption[record.Customer_GUID] &&
              allUserOption[record.Customer_GUID].map((item) => {
                return (
                  <Select.Option key={record.Customer_GUID} value={item.User_GUID}>
                    {item.User_FullName}
                  </Select.Option>
                );
              })}
          </Select>
        );
      },
    },
  ];

  /* 工单模板列表模拟数据 */
  const templateListColumns = [
    {
      title: intl.formatMessage({
        id: 'pages.seq',
        defaultMessage: '序号',
      }),
      width: 80,
      dataIndex: 'seq',
      key: 'seq',
      render: (node, record, index) => {
        return index + 1;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.templateID',
        defaultMessage: '模板ID',
      }),
      dataIndex: 'Template_No',
      key: 'Template_No',
    },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.templateName',
        defaultMessage: '模板名称',
      }),
      dataIndex: 'Template_Name',
      key: 'Template_Name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.eservice.templateProperty',
        defaultMessage: '模板属性',
      }),
      dataIndex: 'Template_Attribute',
      key: 'Template_Attribute',
      render: (text, record, index) => {
        let str = '';
        if (record.Template_Attribute) {
          if (record.Template_Attribute.includes('S')) {
            str +=
              intl.formatMessage({
                id: 'pages.eservice.plat',
                defaultMessage: '平台',
              }) + ',';
          }
          if (record.Template_Attribute.includes('P')) {
            str +=
              intl.formatMessage({
                id: 'pages.eservice.project',
                defaultMessage: '项目',
              }) + ',';
          }
          if (record.Template_Attribute.includes('U')) {
            str +=
              intl.formatMessage({
                id: 'pages.eservice.update',
                defaultMessage: '升级',
              }) + ',';
          }
        }
        str = str.substring(0, str.length - 1);
        return <span>{str ? str : 'N/A'}</span>;
      },
    },
  ];
  const initialTargetKeys = teamList.map((item) => item.Team_GUID);
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);

  //处理人改变
  function handlerChange(val) {
    setHandlerSel(val);
  }

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);

    //获取选中团队人员
    if (nextTargetKeys.length === 0) {
      setHandlerTeamList([]);
      return;
    }

    let newarr = [];
    nextTargetKeys.forEach((item) => {
      newarr.push("'" + item + "'");
    });
    setHandlerTeamGuid(newarr.join(','));
    let info = {
      team_guid_str: newarr.join(','),
    };
    getTeamUserInfoByMultiple(info).then((res) => {
      if (res.success) {
        setHandlerTeamList(res.data);
      }
    });
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction, e) => {
    // console.log('direction:', direction);
    // console.log('target:', e.target);
  };
  function changeShow() {
    setIsModalVisible('0');
  }
  /*获取所有用户*/
  function getAllUsers() {
    let info = {
      type: '1',
    };
    getCommonUserList(info).then((res) => {
      if (res.success) {
        setHandlerTeamList(res.data);
      }
    });
  }
  /*按团队保存*/
  function onSaveTeamPrivilege(currentRow) {
    let info = {
      sysrsc_no: 'TREE001',
      menursc_no: 'TREE001_03',
      handlersc_no: 'ACTION001',
      workordertype_guid: currentRow.WorkOrderType_GUID,
      user_guid: handlerSel,
      team_guid_str: handlerTeamGuid,
    };
    // console.log(info);
    // return;
    saveTeamPrivilege(info).then((res) => {
      if (res.success) {
        message.success(
          intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功' }),
        );
        setTeamVisible(false);
      }
    });
  }
  /**
   * @description: 按客户团队授权保存
   * @return {*}
   */
  const onSaveCusTeamPrivilege = () => {
    let flag;
    cusList.forEach((item) => {
      if (item.principal === '') {
        flag = false;
      } else {
        flag = true;
      }
    });
    if (!flag) {
      message.error('处理人不能为空');
      return;
    }
    let arr = [];
    cusList.forEach((item) => {
      arr.push({
        customer_guid: item.Customer_GUID,
        team_guid_str: item.team_guid_str,
        principal: item.principal,
      });
    });
    let info = {
      sysrsc_no: 'TREE001',
      menursc_no: 'TREE001_03',
      handlersc_no: 'ACTION007',
      workordertype_guid: currentRow.WorkOrderType_GUID,
      customer_list: arr,
    };
    saveCusTeamPrivilege(info).then((res) => {
      if (res.success) {
        setClientVisible(false);
        message.success(
          intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功！' }),
        );
      }
    });
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
        rowSelection={history.location.pathname.includes('invalid-type') ? true : false}
        setTab={(tab) => {
          setActiveKey(tab);
        }}
        workordertype_status={history.location.pathname.includes('invalid-type') ? '0' : '1'}
      />
      {/* 添加 || 编辑 Modal */}
      <AddOrderType
        changeShow={changeShow}
        currentRow={currentRow}
        show={isModalVisible == 'add-edit-user'}
        addEditStatus={addEditStatus}
        overModel={setIsModalVisible}
        renderTable={renderTable}
      />
      {/* 正在使用当前工单类型的工单模板 Modal */}
      <Modal
        title={
          intl.formatMessage({
            id: 'pages.eservice.tempList',
            defaultMessage: '模板清单',
          }) +
          '(' +
          currentRow.WorkOrderType_No +
          '-' +
          currentRow.WorkOrderType_Name +
          ')'
        }
        centered={true}
        destroyOnClose={true}
        width={632}
        visible={isModalVisible == 'templateList'}
        onCancel={handleCancel}
        footer={'共' + templateList.length + '条数据'}
      >
        <Table
          dataSource={templateList}
          rowKey={(rowData) => {
            return rowData.seq;
          }}
          columns={templateListColumns}
          pagination={false}
          scroll={{ y: 300 }}
        />
      </Modal>
      {/* 按客户-团队授权 */}
      <Modal
        centered
        rowKey="key"
        title={
          intl.formatMessage({
            id: 'pages.eservice.changeAuthorization',
            defaultMessage: '更改授权',
          }) +
          '（' +
          currentRow.WorkOrderType_Name +
          '-' +
          intl.formatMessage({
            id: 'pages.eservice.authorization.clientTeam',
            defaultMessage: '按客户团队授权',
          }) +
          '）'
        }
        visible={clientVisible}
        width={912}
        onOk={onSaveCusTeamPrivilege}
        onCancel={() => {
          setClientVisible(false);
        }}
        maskClosable={false}
      >
        <MySearchCondition
          search={onGetQueryParam2}
          queryTypes={cusTeamColumns}
          rangePickerProps={rangePickerProps}
        />
        <Table
          rowKey={(record) => record.Customer_GUID}
          rowSelection={{
            type: 'checkbox',
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
          columns={cusTeamColumns}
          dataSource={customerTeamList}
          pagination={false}
        />
      </Modal>
      {/* 按团队授权 */}
      <Modal
        centered
        title={
          intl.formatMessage({
            id: 'pages.eservice.changeAuthorization',
            defaultMessage: '更改授权',
          }) +
          '（' +
          currentRow.WorkOrderType_Name +
          '-' +
          intl.formatMessage({
            id: 'pages.eservice.authorization.team',
            defaultMessage: '按团队授权',
          }) +
          '）'
        }
        visible={teamVisible}
        maskClosable={false}
        onOk={() => {
          onSaveTeamPrivilege(currentRow);
        }}
        onCancel={() => {
          setTeamVisible(false);
        }}
      >
        <span style={{ color: 'red' }}>*</span>
        <span>
          {intl.formatMessage({ id: 'pages.eservice.serveTeam', defaultMessage: '服务团队' })}
        </span>
        <Checkbox style={{ float: 'right' }} defaultChecked onChange={checkboxChange}>
          {intl.formatMessage({ id: 'pages.eservice.defaultAll', defaultMessage: 'All(默认)' })}
        </Checkbox>
        <Transfer
          disabled={transferDisabled === true ? true : false}
          showSearch
          dataSource={teamList}
          titles={[
            intl.formatMessage({
              id: 'pages.eservice.team.unselected',
              defaultMessage: '未选团队',
            }),
            intl.formatMessage({ id: 'pages.eservice.team.selected', defaultMessage: '已选团队' }),
          ]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          onScroll={onScroll}
          render={(item) => item.Team_Name}
          rowKey={(record) => record.Team_GUID}
        />
        <div style={{ margin: '16px 0' }}>
          {intl.formatMessage({ id: 'pages.eservice.handler', defaultMessage: '处理人' })}
        </div>
        <Select style={{ width: '250px' }} onChange={handlerChange}>
          {handlerTeamList.map((item) => {
            return (
              <Select.Option key={item.User_GUID} value={item.User_GUID}>
                {item.User_FullName}
              </Select.Option>
            );
          })}
        </Select>
      </Modal>
    </>
  );
};

export default UserManage;
