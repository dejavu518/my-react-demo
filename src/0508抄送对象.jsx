/*
 * @Author: liaoyh liaoyh@gl.com
 * @Date: 2022-11-02 10:10:13
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2023-05-08 09:29:46
 * @FilePath: \my-react-demo\src\0506抄送对象.jsx
 * @Description: 确认并发送邮件
 */
import { Modal, Select, Table, Input, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl, history } from 'umi';
import {
  findMasterSendState,
  completeWorkOrder,
  fuzzySearchSponsororSponsorEmail,
  GetCcSettings,
  SaveCcSettings,
} from '@/services/swagger/eservice';
import DownloadReceipt from './DownloadReceipt';

/**模糊搜索主送姓名 */
const SearchInput_Name = (props) => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState();

  const handleSearch = (newValue) => {
    if (newValue) {
      let info = {
        query: newValue,
        customer_guid: props.otherParam.customer_guid,
        project_guid: props.otherParam.project_guid,
      };
      fuzzySearchSponsororSponsorEmail(info).then((res) => {
        if (res.success) {
          let dt = res.data;
          let arr = [];
          dt.forEach((item) => {
            arr.push({
              value: item.User_FullName,
              email: item.User_Email,
            });
          });
          setData(arr);
        }
      });
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue, option) => {
    setValue(newValue);
    props.change(newValue, option);
  };

  return (
    <Select
      showSearch
      bordered={false}
      value={props.value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.value,
        email: d.email,
      }))}
    />
  );
};

/**模糊搜索主送邮箱 */
const SearchInput_Email = (props) => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState();

  const handleSearch = (newValue) => {
    if (newValue) {
      let info = {
        query: newValue,
        customer_guid: props.otherParam.customer_guid,
        project_guid: props.otherParam.project_guid,
      };
      fuzzySearchSponsororSponsorEmail(info).then((res) => {
        if (res.success) {
          let dt = res.data;
          let arr = [];
          dt.forEach((item) => {
            arr.push({
              value: item.User_Email,
              received_name: item.User_FullName,
            });
          });
          setData(arr);
        }
      });
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue, option) => {
    setValue(newValue);
    props.change(newValue, option);
  };

  return (
    <Select
      showSearch
      bordered={false}
      value={props.value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.value,
        received_name: d.received_name,
      }))}
    />
  );
};

const ConfirmAndSend = (props) => {
  const intl = useIntl();
  const dataInfo = props.emailData.info;
  const otherParam = props.emailData.otherParam;
  const [tabSEmail, setTabSEmail] = useState({
    data: [],
    count: 0,
  });
  const [tabSEmail2, setTabSEmail2] = useState({
    data: [],
    count: 0,
  });
  const [ccList, setCcList] = useState([]);
  const [masterState, setMasterState] = useState();
  const [downloadR, setDownloadR] = useState({
    open: false,
  });
  const [confLoading, setConfLoading] = useState(false);
  const [ccSetting, setCcSetting] = useState(false);
  useEffect(() => {
    if (JSON.stringify(otherParam) !== '{}') {
      findMasterSend();
    }
  }, [props.emailData]);

  /*查询主送状态*/
  function findMasterSend() {
    let info = {
      sponsor_guid: otherParam.sponsor_guid,
      customer_guid: otherParam.customer_guid,
      project_guid: otherParam.project_guid,
    };
    findMasterSendState(info).then((res) => {
      if (res.success) {
        setMasterState(res.data);

        if (otherParam.sponsor_guid === '') {
          //自定义发起人
          setTabSEmail({
            data: [
              {
                object_type: '0',
                received_name: otherParam.sponsor_by,
                email: otherParam.sponsor_email,
              },
            ],
            count: 0,
          });
        } else if (!res.data) {
          setTabSEmail({
            data: [
              {
                object_type: '0',
                received_name: '',
                email: '',
              },
            ],
            count: 0,
          });
        } else {
          setTabSEmail({
            data: [
              {
                object_type: '0',
                received_name: otherParam.sponsor_by,
                email: otherParam.sponsor_email,
              },
            ],
            count: 0,
          });
        }
      }
    });
  }

  /**校验 */
  function verifyData() {
    const tab = tabSEmail.data;
    let bool = true;
    let patrn_email =
      /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

    if (tab[0].received_name === '' || tab[0].email === '') {
      message.error(
        intl.formatMessage({
          id: 'pages.eservice.pFillMainSend',
          defaultMessage: '请填写主送人',
        }),
      );
      bool = false;
    } else {
      tab.forEach((item, index) => {
        if (item.received_name === '' || item.email === '') {
          message.error(
            intl.formatMessage({
              id: 'pages.eservice.pFillCopiedSend',
              defaultMessage: '请填写抄送人',
            }),
          );
          bool = false;
        } else if (!patrn_email.test(item.email)) {
          message.error(
            intl.formatMessage({
              id: 'pages.usermanage.emaile.error',
              defaultMessage: '邮箱格式不正确',
            }),
          );
          bool = false;
        }
      });
    }

    return bool;
  }

  //获取文件上传信息后保存
  const getFileInfo = (res) => {
    const formData = new FormData();
    formData.append('file', res.file);

    let info = {
      ...dataInfo,
      email_list: tabSEmail.data.map((item) => {
        for (let key in item) {
          if (item.hasOwnProperty('key')) {
            delete item.key;
          }
        }
        return item;
      }),
    };

    // console.log(info);
    // return;

    completeWorkOrder(info).then((res) => {
      setConfLoading(false);
      if (res.success) {
        message.success(
          intl.formatMessage({
            id: 'pages.operate.success',
            defaultMessage: '操作成功！',
          }),
        );
        history.replace({
          pathname: '/workbench1/workorder-management/completed/detail',
          query: {
            source: 'completed',
            template_guid: otherParam.Template_GUID,
            workorder_guid: otherParam.workorder_guid,
            workordertype_guid: otherParam.workordertype_guid,
            type: '2',
          },
        });
      } else {
        message.error(res.message);
      }
    });
  };

  /**保存 */
  function saveAndSend() {
    let bool = verifyData();
    if (!bool) {
      return;
    }

    setDownloadR({
      ...downloadR,
      open: true,
    });
    setConfLoading(true);
  }

  const columns = [
    {
      title: (
        <span>
          {intl.formatMessage({
            id: 'pages.notice.sendObj',
            defaultMessage: '发送对象',
          })}
        </span>
      ),
      align: 'center',
      dataIndex: 'sendObject',
      key: 'sendObject',
      width: '120px',
      render: (text, record, index) => {
        if (index === 0) {
          return intl.formatMessage({
            id: 'pages.eservice.mainObj',
            defaultMessage: '主送',
          });
        } else {
          return intl.formatMessage({
            id: 'pages.eservice.ccObj',
            defaultMessage: '抄送',
          });
        }
      },
    },
    {
      title: (
        <span>
          <span style={{ color: '#FF0000' }}>*</span>
          {intl.formatMessage({
            id: 'pages.usermanage.name',
            defaultMessage: '姓名',
          })}
        </span>
      ),
      align: 'center',
      dataIndex: 'received_name',
      key: 'received_name',
      render: (text, record, index) =>
        index === 0 ? (
          masterState ? (
            record.received_name
          ) : (
            <SearchInput_Name
              placeholder={intl.formatMessage({
                id: 'pages.pleaseInput',
                defaultMessage: '请输入',
              })}
              value={tabSEmail.data[0].received_name}
              otherParam={otherParam}
              change={(val, option) => {
                setTabSEmail(() => {
                  let arr = tabSEmail.data;
                  arr[0].received_name = val;
                  arr[0].email = option.email;
                  return {
                    data: arr,
                    ...tabSEmail.count,
                  };
                });
              }}
              style={{
                width: 200,
              }}
            />
          )
        ) : (
          <Input
            bordered={false}
            style={{ textAlign: 'center' }}
            value={tabSEmail.data[index].received_name}
            onChange={(v) => {
              setTabSEmail(() => {
                let arr = tabSEmail.data;
                arr[index].received_name = v.target.value;
                return {
                  data: arr,
                  ...tabSEmail.count,
                };
              });
            }}
          />
        ),
    },
    {
      title: (
        <span>
          <span style={{ color: '#FF0000' }}>*</span>
          {intl.formatMessage({
            id: 'pages.usermanage.email',
            defaultMessage: '邮箱',
          })}
        </span>
      ),
      align: 'center',
      dataIndex: 'email',
      key: 'email',
      render: (text, record, index) =>
        index === 0 ? (
          masterState ? (
            record.email
          ) : (
            <SearchInput_Email
              value={tabSEmail.data[0].email}
              placeholder={intl.formatMessage({
                id: 'pages.pleaseInput',
                defaultMessage: '请输入',
              })}
              otherParam={otherParam}
              change={(val, option) => {
                setTabSEmail(() => {
                  let arr = tabSEmail.data;
                  arr[0].received_name = option.received_name;
                  arr[0].email = val;
                  return {
                    data: arr,
                    ...tabSEmail.count,
                  };
                });
              }}
              style={{
                width: 200,
              }}
            />
          )
        ) : (
          <Input
            bordered={false}
            style={{ textAlign: 'center' }}
            value={tabSEmail.data[index].email}
            onChange={(v) => {
              setTabSEmail(() => {
                let arr = tabSEmail.data;
                arr[index].email = v.target.value;
                return {
                  data: arr,
                  ...tabSEmail.count,
                };
              });
            }}
          />
        ),
    },
    {
      title: (
        <PlusOutlined
          onClick={() => {
            setTabSEmail(() => {
              let arrData = JSON.parse(JSON.stringify(tabSEmail));

              arrData.data.push({
                key: arrData.data.length,
                object_type: '1',
                received_name: '',
                email: '',
              });

              return {
                data: arrData.data,
                count: tabSEmail.count + 1,
              };
            });
          }}
          style={{ cursor: 'pointer', color: '#21bb7e' }}
        />
      ),
      dataIndex: 'operation',
      align: 'center',
      width: '120px',
      render: (_, record, index) =>
        index !== 0 ? (
          <DeleteOutlined
            onClick={() => {
              setTabSEmail(() => {
                let arrData = JSON.parse(JSON.stringify(tabSEmail));
                let arr = arrData.data.filter((item) => item.key !== record.key);

                arr.map((item, i) => {
                  item.key = i;
                });

                return {
                  data: arr,
                  count: tabSEmail.data.length - 1,
                };
              });
            }}
            style={{ color: 'red' }}
          />
        ) : null,
    },
  ];

  const columns2 = [
    {
      title: (
        <span>
          <span style={{ color: '#FF0000' }}>*</span>
          {intl.formatMessage({
            id: 'pages.usermanage.name',
            defaultMessage: '姓名',
          })}
        </span>
      ),
      align: 'center',
      dataIndex: 'Cc_Name',
      key: 'cc_name',
      render: (text, record, index) => (
        <Input
          bordered={false}
          style={{ textAlign: 'center' }}
          value={tabSEmail2.data[index].Cc_Name}
          onBlur={(e) => {
            let v = e.target.value;
            if (record.Cc_GUID === '') {
              let list = ccList;
              list[index].Cc_Name = v;
              setCcList(list);
            }
          }}
          onChange={(v) => {
            setTabSEmail2(() => {
              let arr = tabSEmail2.data;
              arr[index].Cc_Name = v.target.value;
              return {
                data: arr,
                ...tabSEmail2.count,
              };
            });
          }}
        />
      ),
    },
    {
      title: (
        <span>
          <span style={{ color: '#FF0000' }}>*</span>
          {intl.formatMessage({
            id: 'pages.usermanage.email',
            defaultMessage: '邮箱',
          })}
        </span>
      ),
      align: 'center',
      dataIndex: 'Cc_Email',
      key: 'cc_email',
      render: (text, record, index) => (
        <Input
          bordered={false}
          style={{ textAlign: 'center' }}
          value={tabSEmail2.data[index].Cc_Email}
          onBlur={(e) => {
            let v = e.target.value;
            if (record.Cc_GUID === '') {
              let list = ccList;
              list[index].Cc_Email = v;
              setCcList(list);
            }
          }}
          onChange={(v) => {
            setTabSEmail2(() => {
              let arr = tabSEmail2.data;
              arr[index].Cc_Email = v.target.value;
              return {
                data: arr,
                ...tabSEmail2.count,
              };
            });
          }}
        />
      ),
    },
    {
      title: (
        <PlusOutlined
          onClick={() => {
            setTabSEmail2(() => {
              let arrData = JSON.parse(JSON.stringify(tabSEmail2));
              arrData.data.push({
                key: arrData.data.length,
                Cc_GUID: '',
                type: '1',
                Cc_Name: '',
                Cc_Email: '',
              });

              return {
                data: arrData.data,
                count: tabSEmail2.count + 1,
              };
            });
            setCcList(() => {
              let arrData = tabSEmail2.data;
              arrData.push({
                key: arrData.length,
                Cc_GUID: '',
                type: 1,
                Cc_Name: '',
                Cc_Email: '',
              });
              return arrData;
            });
          }}
          style={{ cursor: 'pointer', color: '#21bb7e' }}
        />
      ),
      dataIndex: 'operation',
      align: 'center',
      width: '120px',
      render: (_, record, index) => (
        <DeleteOutlined
          onClick={() => {
            let list = ccList;
            list.forEach((item, n) => {
              if (n === index) {
                item.type = 3;
              }
            });
            setCcList(list);
            setTabSEmail2(() => {
              let arrData = JSON.parse(JSON.stringify(tabSEmail2));
              let arr = arrData.data.filter((item) => item.key !== record.key);
              arr.map((item, i) => {
                item.key = i;
              });

              return {
                data: arr,
                count: tabSEmail2.data.length - 1,
              };
            });
          }}
          style={{ color: 'red' }}
        />
      ),
    },
  ];
  // 获取抄送人设置列表
  function getCcSettings() {
    let info = {
      customerGuid: props.customerGuid,
    };
    GetCcSettings(info).then((res) => {
      if (res.success) {
        let arr = [];
        res.data.forEach((item, index) => {
          arr.push({
            Cc_GUID: item.Cc_GUID,
            Cc_Name: item.Cc_Name,
            Cc_Email: item.Cc_Email,
            type: 0,
            key: index,
          });
        });
        setTabSEmail2(() => {
          return {
            data: arr,
            count: res.data.length,
          };
        });
        setCcList(() => {
          return arr;
        });
      }
    });
  }
  // 保存抄送人设置
  function saveCcSettings() {
    console.log(ccList, 123);
    let list = [];
    ccList.forEach((item) => {
      list.push({
        cc_name: item.Cc_Name,
        cc_email: item.Cc_Email,
        cc_guid: item.Cc_GUID,
        type: item.type,
      });
    });

    let info = {
      Cc_Customer: props.customerGuid,
      cc_list: list,
    };
    SaveCcSettings(info).then((res) => {
      if (res.success) {
        message.success(
          intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功！' }),
        );
        setCcSetting(false);
      }
    });
  }
  return (
    <>
      <Modal
        visible={props.confirmOpen}
        confirmLoading={confLoading}
        onOk={() => {
          saveAndSend();
        }}
        onCancel={() => {
          props.setConfirmOpen(false);
        }}
        title={
          <span style={{ fontSize: '14px' }}>
            {intl.formatMessage({
              id: 'pages.eservice.confirmAndSendE',
              defaultMessage: '确认并发送邮件',
            })}
          </span>
        }
        width={'780px'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: 'red', marginRight: '4px' }}>*</span>
            发送邮件
          </div>
          <div style={{ color: '#21BB7E' }}>
            <span
              style={{ marginRight: '8px', cursor: 'pointer' }}
              onClick={() => {
                getCcSettings();
                setCcSetting(true);
              }}
            >
              设置抄送人
            </span>
            <span>常用抄送人</span>
          </div>
        </div>
        <Table
          bordered={true}
          pagination={false}
          columns={columns}
          dataSource={tabSEmail.data}
          style={{ marginTop: '16px' }}
        />
        {/* 下载回执 */}
        {downloadR.open && (
          <DownloadReceipt
            type="CAndS"
            dataInfo={dataInfo}
            basicInfo={props.basicInfo}
            workOrderTypeName={props.workOrderTypeName}
            downloadR={downloadR}
            setDownloadR={setDownloadR}
            createAttachments={true} //直接生成pdf附件上传
            getFileInfo={getFileInfo}
          />
        )}
      </Modal>
      {/* 设置抄送人 */}
      <Modal
        destroyOnClose
        title="设置抄送人"
        visible={ccSetting}
        onCancel={() => {
          setCcSetting(false);
        }}
        onOk={() => {
          saveCcSettings();
        }}
      >
        <div>
          <span style={{ color: 'red', marginRight: '4px' }}>*</span>
          抄送人设置
        </div>
        <Table
          bordered={true}
          pagination={false}
          columns={columns2}
          dataSource={tabSEmail2.data}
          style={{ marginTop: '16px' }}
        />
      </Modal>
    </>
  );
};

export default ConfirmAndSend;
