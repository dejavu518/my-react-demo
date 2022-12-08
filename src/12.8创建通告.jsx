/*
 * @Author: dejavu518 cf_1118sab@163.com
 * @Date: 2022-09-28 17:28:59
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2022-12-08 10:29:41
 * @FilePath: \my-react-demo\src\12.8创建通告.jsx
 * @Description:创建通告/编辑通告
 */
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Space,
  Form,
  Input,
  Table,
  Row,
  Col,
  Checkbox,
  Select,
  Upload,
  Tabs,
  Modal,
  message,
} from 'antd';
import { QuestionCircleFilled, UploadOutlined } from '@ant-design/icons';
import { getCommonUserList, uploadFileAsync } from '@/services/swagger/user';
import { history, useIntl } from 'umi';
import { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.less';
import { saveNoticeInfo, getNoticeInfo, publishNotice } from '@/services/swagger/notice';
import DocuViewareComponent from '@/components/Preview/docuvieware-component';
const externalUserList = [];
for (let i = 10; i < 36; i++) {
  externalUserList.push(
    <Select.Option key={i.toString(36) + i}>{i.toString(36) + i}</Select.Option>,
  );
}
const AddNotice = (props) => {
  const [form] = Form.useForm();
  const [systemUserList, setSystemUserList] = useState([]);
  const [sendEmail, setSendEmail] = useState(0);
  const [sendSystem, setSendSystem] = useState(0);
  const [language, setLanguage] = useState({});
  const [sendSusers, setSendSusers] = useState();
  const [sendEusers, setSendEusers] = useState();
  const { id } = props.location.query;
  const [emailShow, setEmailShow] = useState(false);
  const [systemShow, setSystemShow] = useState(false);
  const [emailChinese, setEmailChinese] = useState('');
  const [systemChinese, setSystemChinese] = useState('');
  const [emailEnglish, setEmailEnglish] = useState('');
  const [systemEnglish, setSystemEnglish] = useState('');
  const [chineseArea, setChineseArea] = useState(false);
  const [englishArea, setEnglishArea] = useState(false);
  const [emailFileList, setEmailFileList] = useState([]);
  const [emailFileData, setEmailFileData] = useState({});
  const [emailFileDataList, setEmailFileDataList] = useState([]);
  const [systemFileList, setSystemFileList] = useState([]);
  const [systemFileData, setSystemFileData] = useState({});
  const [systemFileDataList, setSystemFileDataList] = useState([]);
  const intl = useIntl();
  const quillEl = useRef(null);
  const [emailDocViewShow, setEmailDocViewShow] = useState(false);
  const [systemDocViewShow, setSystemDocViewShow] = useState(false);

  const [basicInfo, setBasicInfo] = useState({});
  const [emailChecked, setEmailChecked] = useState(false);
  const [systemChecked, setSystemChecked] = useState(false);
  useEffect(() => {
    if (id) {
      let info = {
        notice_guid: id,
      };
      getNoticeInfo(info).then((res) => {
        if (res.success) {
          setTimeout(() => {
            setBasicInfo(() => {
              return res.data[0];
            });
          }, 100);
          let dt = res.data[0];
          form.setFieldsValue({
            subject: dt.Notice_Subject,
            language: dt.Lang.split(','),
          });
          // 解析系统/外部客户
          let systemUsersArr = [];
          systemUsersArr = dt.Send_SystemUsers.split(',').map((item) => {
            return item.replace(/\'/g, '');
          });
          let externalUsersArr = [];
          externalUsersArr = dt.Send_ExternalUsers.split(',').map((item) => {
            return item.replace(/\'/g, '');
          });
          setSendSusers(systemUsersArr);
          setSendEusers(externalUsersArr);
          // 渲染内容
          if (dt.Email_Content !== null) {
            JSON.parse(dt.Email_Content).forEach((item) => {
              if (item.lang === 'zh-CN') {
                setEmailChinese(item.content);
              } else if (item.lang === 'En') {
                setEmailEnglish(item.content);
              }
            });
          }
          if (dt.System_Content !== null) {
            JSON.parse(dt.System_Content).forEach((item) => {
              if (item.lang === 'zh-CN') {
                setSystemChinese(item.content);
              } else if (item.lang === 'En') {
                setSystemEnglish(item.content);
              }
            });
          }

          //  附件
          setEmailFileDataList(JSON.parse(dt.Email_Attachment));
          setSystemFileDataList(JSON.parse(dt.System_Attachment));
          setEmailFileList(() => {
            let arr = [];
            JSON.parse(dt.Email_Attachment).forEach((item) => {
              arr.push({
                name: item.file_name,
                url: item.file_path,
              });
            });
            return arr;
          });
          setSystemFileList(() => {
            let arr = [];
            if (dt.System_Attachment !== null) {
              JSON.parse(dt.System_Attachment).forEach((item) => {
                arr.push({
                  name: item.file_name,
                  url: item.file_path,
                });
              });
            }
            return arr;
          });
          // 内容和勾选控制显示隐藏
          if (dt.Send_Email === 1) {
            setSendEmail(1);
            setEmailShow(true);
            setEmailChecked(true);
          } else {
            setSendEmail(0);
            setEmailShow(false);
            setEmailChecked(false);
          }
          if (dt.Send_System === 1) {
            setSendSystem(1);
            setSystemShow(true);
            setSystemChecked(true);
          } else {
            setSendSystem(1);
            setSystemShow(false);
            setSystemChecked(false);
          }
          // 通过语言字段控制
          let langArr = dt.Lang.split(',');
          if (langArr.length > 0) {
            if (langArr.length === 1) {
              // 中文
              if (langArr[0] === 'zh-CN') {
                setChineseArea(true);
                setEnglishArea(false);
              } else {
                // 英文
                setEnglishArea(true);
                setChineseArea(false);
              }
            } else {
              setChineseArea(true);
              setEnglishArea(true);
            }
          } else {
            setChineseArea(false);
            setEnglishArea(false);
          }
        }
      });
    } else {
      console.log(typeof sendEusers);
    }
  }, []);
  /**
   * 保存信息-新增|编辑
   **/
  const onSaveInfo = (type) => {
    form
      .validateFields()
      .then((values) => {
        console.log(sendEusers.length, 999);
        // 提示
        if (sendEmail === 0 && sendSystem === 0) {
          message.error('请选择发送方式');
          return false;
        }
        if (sendSusers === undefined || sendSusers.length === 0) {
          message.error('请选择系统客户');
          return false;
        }
        if (sendEusers === undefined || sendEusers.length === 0) {
          message.error('请选择外部客户');
          return false;
        }
        let sendSusersArr = sendSusers.map((item) => {
          return "'" + item + "'";
        });
        let sendEusersArr = sendEusers.map((item) => {
          return "'" + item + "'";
        });
        let info = {
          sysrsc_no: 'TREE002',
          menursc_no: 'TREE002_04',
          handlersc_no: id ? 'ACTION001' : 'ACTION003',
          notice_guid: id ? id : '',
          notice_subject: values.subject,
          notice_status: '0',
          send_email: sendEmail,
          send_system: sendSystem,
          email_attachment: emailFileDataList,
          system_attachment: systemFileDataList,
          lang: values.language.join(),
          send_systemusers: sendSusersArr.join(','),
          send_externalusers: sendEusersArr.join(','),
        };
        // 邮件内容
        if (sendEmail === 1) {
          if (values.language.length === 2) {
            info['email_content'] = [
              {
                lang: 'zh-CN',
                content: emailChinese,
              },
              {
                lang: 'En',
                content: emailEnglish,
              },
            ];
          } else {
            if (values.language[0] === 'zh-CN') {
              info['email_content'] = [
                {
                  lang: 'zh-CN',
                  content: emailChinese,
                },
              ];
            } else if (values.language[0] === 'en') {
              info['email_content'] = [
                {
                  lang: 'En',
                  content: emailEnglish,
                },
              ];
            }
          }
        } else {
          info['email_content'] = [
            {
              lang: 'En',
              content: '',
            },
            {
              lang: 'zh-CN',
              content: '',
            },
          ];
        }
        // 系统内容
        if (sendSystem === 1) {
          if (values.language.length === 2) {
            info['system_content'] = [
              {
                lang: 'zh-CN',
                content: systemChinese,
              },
              {
                lang: 'En',
                content: systemEnglish,
              },
            ];
          } else {
            if (values.language[0] === 'zh-CN') {
              info['system_content'] = [
                {
                  lang: 'zh-CN',
                  content: systemChinese,
                },
              ];
            } else if (values.language[0] === 'en') {
              info['system_content'] = [
                {
                  lang: 'En',
                  content: systemEnglish,
                },
              ];
            }
          }
        } else {
          info['system_content'] = [
            {
              lang: 'En',
              content: '',
            },
            {
              lang: 'zh-CN',
              content: '',
            },
          ];
        }

        saveNoticeInfo(info).then((res) => {
          if (res.success) {
            message.success(
              intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功！' }),
            );
            history.go(-1);
          }
        });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  const headerExtra = (
    <Space>
      <Button
        onClick={() => {
          history.go(-1);
        }}
      >
        {intl.formatMessage({ id: 'pages.notice.cancel', defaultMessage: '取消' })}
      </Button>
      <Button
        type="primary"
        onClick={() => {
          onSaveInfo(1);
        }}
      >
        {intl.formatMessage({ id: 'pages.save', defaultMessage: '保存' })}
      </Button>
      <Button
        type="primary"
        onClick={() => {
          onPublish();
        }}
      >
        {intl.formatMessage({ id: 'pages.publish', defaultMessage: '发布' })}
      </Button>
    </Space>
  );
  const plainOptions = [
    { label: '邮件', value: '1' },
    { label: '系统', value: '2' },
  ];
  /**外部用户变化**/
  const externalChange = (v) => {
    setSendEusers(v);
  };
  /**系统用户变化**/
  const systemChange = (v) => {
    setSendSusers(v);
  };
  /**语言变化**/
  const languageChange = (v) => {
    if (v.length > 0) {
      if (v.length === 1) {
        // 中文
        if (v[0] === 'zh-CN') {
          setChineseArea(true);
          setEnglishArea(false);
        } else {
          // 英文
          setEnglishArea(true);
          setChineseArea(false);
        }
        setLanguage(v);
      } else {
        setChineseArea(true);
        setEnglishArea(true);
        setLanguage('zh-CN,en');
      }
      // if (v.length === 2) {
      //   setLanguage('zh-CN,en');
      // } else {
      //   setLanguage(v);
      // }
    } else {
      setChineseArea(false);
      setEnglishArea(false);
    }
  };
  const selectArea = (tabkey, record) => {
    if (record.type === '外部客户') {
      return (
        <Select
          value={sendEusers}
          showArrow
          bordered={false}
          mode="tags"
          style={{
            width: '100%',
          }}
          placeholder={intl.formatMessage({
            id: 'pages.notice.external.tip',
            defaultMessage: '可输入外部客户邮箱',
          })}
          onChange={externalChange}
        >
          {externalUserList}
        </Select>
      );
    } else if (record.type === '系统客户') {
      return (
        <Select
          bordered={false}
          mode="multiple"
          showArrow
          onChange={systemChange}
          value={sendSusers}
        >
          {systemUserList.map((item) => {
            return (
              <Select.Option key={item.User_GUID} title={item.User_FullName} value={item.User_GUID}>
                {item.User_FullName}
              </Select.Option>
            );
          })}
          <Select.Option>无</Select.Option>
        </Select>
      );
    }
  };
  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }], //字体设置
        [
          {
            color: [],
          },
        ],
        [
          {
            background: [],
          },
        ],
        [{ font: [] }],
        [{ align: [] }],
        ['link', 'image'], // a链接和图片的显示
      ],
      handlers: {
        // image: this.imageHandler.bind(this), //点击图片标志会调用的方法
        // video2: this.showVideoModal.bind(this),
      },
    },
  };
  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.type', defaultMessage: '类型' }),
      dataIndex: 'type',
      width: '200px',
    },
    {
      title: intl.formatMessage({ id: 'pages.notice.user', defaultMessage: '人员' }),
      dataIndex: 'people',
      render: function (_, record) {
        return [selectArea(_, record)];
      },
    },
  ];
  const tableData = [
    {
      type: '系统客户',
    },
    {
      type: '外部客户',
    },
  ];
  const handleEmailChinese = (v) => {
    setEmailChinese(v);
  };
  const handleEmailEnglish = (v) => {
    setEmailEnglish(v);
  };
  const handleSystemChinese = (v) => {
    setSystemChinese(v);
  };
  const handleSystemEnglish = (v) => {
    setSystemEnglish(v);
  };
  /**上传前-(邮件)**/
  const beforeEmailUpload = (file) => {
    setEmailFileList(() => {
      emailFileList.push(file);
      return emailFileList;
    });
    return false;
  };
  /**上传前-（系统）**/
  const beforeSystemUpload = (file) => {
    setSystemFileList(() => {
      systemFileList.push(file);
      return systemFileList;
    });
    return false;
  };
  /**上传附件-(邮件内容)**/
  const handleEmailUpload = (v) => {
    if (v.file.status !== 'removed') {
      const formData = new FormData();
      formData.append('file', v.file);
      uploadFileAsync(formData).then((res) => {
        if (res.success) {
          setEmailFileData(res.data);
          setEmailFileDataList(() => {
            emailFileDataList.push({
              file_name: res.data.newFileName,
              file_path: res.data.filePath,
            });
            return emailFileDataList;
          });
        }
      });
    }
  };
  /**上传附件-(系统内容)**/
  const handleSystemUpload = (v) => {
    if (v.file.status !== 'removed') {
      const formData = new FormData();
      formData.append('file', v.file);
      uploadFileAsync(formData).then((res) => {
        if (res.success) {
          setSystemFileData(res.data);
          setSystemFileDataList(() => {
            systemFileDataList.push({
              file_name: res.data.newFileName,
              file_path: res.data.filePath,
            });
            return systemFileDataList;
          });
        }
      });
    }
  };
  /**发送方式勾选变化**/
  const handleSendEmailChange = (v) => {
    let checked = v.target.checked;
    if (checked) {
      setSendEmail(1);
      setEmailShow(true);
      setEmailChecked(true);
    } else {
      setSendEmail(0);
      setEmailShow(false);
      setEmailChecked(false);
    }
  };
  const handleSendSystemChange = (v) => {
    let checked = v.target.checked;
    if (checked) {
      setSendSystem(1);
      setSystemShow(true);
      setSystemChecked(true);
    } else {
      setSendSystem(0);
      setSystemShow(false);
      setSystemChecked(false);
    }
  };
  useEffect(() => {
    let param = {
      type: '1',
    };
    getCommonUserList(param).then((res) => {
      if (res.success) {
        setSystemUserList(() => {
          return res.data;
        });
      }
    });
  }, []);
  const emailPreview = (file) => {
    setEmailDocViewShow(true);
  };
  const closeEmailPreview = () => {
    setEmailDocViewShow(false);
  };
  const systemPreview = (file) => {
    setSystemDocViewShow(true);
  };
  const closeSystemPreview = () => {
    setSystemDocViewShow(false);
  };
  // 邮件附件删除
  const emailRemove = (v) => {
    setEmailFileList(() => {
      let newArr = [];
      newArr = emailFileList.filter((item) => {
        return item.name !== v.name;
      });
      return newArr;
    });
    setEmailFileDataList(() => {
      let newArr = [];
      newArr = emailFileDataList.filter((item) => {
        return item.file_name !== v.name;
      });
      return newArr;
    });
  };
  // 系统附件删除
  const systemRemove = (v) => {
    setSystemFileList(() => {
      let newArr = [];
      newArr = systemFileList.filter((item) => {
        return item.name !== v.name;
      });
      return newArr;
    });
    setEmailFileDataList(() => {
      let newArr = [];
      newArr = systemFileDataList.filter((item) => {
        return item.file_name !== v.name;
      });
      return newArr;
    });
  };
  /**
   * @description: 发布
   * @return {*}
   */
  function onPublish() {
    form.validateFields().then((values) => {
      const confirm = Modal.confirm({
        title: intl.formatMessage({ id: 'pages.confirm.title', defaultMessage: '提示' }),
        icon: <QuestionCircleFilled />,

        content: intl.formatMessage({
          id: 'pages.notice.publish.tip',
          defaultMessage: '是否确认发布',
        }),
        onOk() {
          let info = {
            sysrsc_no: 'TREE002',
            menursc_no: 'TREE002_04',
            handlersc_no: 'ACTION010',
            notice_guid: id,
            notice_status: '1',
          };
          publishNotice(info).then((res) => {
            if (res.success) {
              message.success(
                intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功' }),
              );
              history.go(-1);
            }
          });
        },
      });
    });
  }
  return (
    <>
      <PageHeaderWrapper
        extra={headerExtra}
        title={
          props.location.query.type === 'edit'
            ? intl.formatMessage({ id: 'pages.notice.editNotice', defaultMessage: '编辑通告' })
            : intl.formatMessage({ id: 'pages.notice.addNotice', defaultMessage: '创建通告' })
        }
      />
      {emailDocViewShow && (
        <DocuViewareComponent
          id={'1'}
          name={emailFileData.newFileName}
          filePath={emailFileData.filePath}
          closePreview={closeEmailPreview}
        />
      )}
      {systemDocViewShow && (
        <DocuViewareComponent
          id={'1'}
          name={systemFileData.newFileName}
          filePath={systemFileData.filePath}
          closePreview={closeSystemPreview}
        />
      )}
      <div
        style={{ backgroundColor: '#fff', padding: '16px', marginTop: '16px', minHeight: '780px' }}
      >
        <Form
          wrapperCol={{ span: 18 }}
          labelCol={{ span: 24 }}
          form={form}
          initialValues={{ sendWay: '1' }}
        >
          <div>
            <span className="line" />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {intl.formatMessage({
                id: 'pages.searchTable.updateForm.basicConfig',
                defaultMessage: '基本信息',
              })}
            </span>
          </div>
          <Form.Item
            label={intl.formatMessage({ id: 'pages.subject', defaultMessage: '主题' })}
            name="subject"
            rules={[{ required: true }]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'pages.pleaseInput',
                defaultMessage: '请输入',
              })}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                {intl.formatMessage({ id: 'pages.notice.sendObj', defaultMessage: '发送对象' })}
              </>
            }
          >
            <Table columns={columns} dataSource={tableData} pagination={false} bordered />
          </Form.Item>
          <Row gutter={32}>
            <Col span={10}>
              <Form.Item
                label={intl.formatMessage({ id: 'pages.sendWay', defaultMessage: '发送方式' })}
                name="sendWay"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.notice.sendWay.placeholder',
                      defaultMessage: '请选择发送方式',
                    }),
                  },
                ]}
              >
                <Checkbox value="1" onChange={handleSendEmailChange} checked={emailChecked}>
                  {intl.formatMessage({ id: 'pages.email', defaultMessage: '邮件' })}
                </Checkbox>
                <Checkbox value="2" onChange={handleSendSystemChange} checked={systemChecked}>
                  {intl.formatMessage({ id: 'pages.system', defaultMessage: '系统' })}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label={intl.formatMessage({ id: 'pages.notice.language', defaultMessage: '语言' })}
                name="language"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select onChange={languageChange} mode="multiple">
                  <Select.Option value="zh-CN">
                    {intl.formatMessage({ id: 'pages.notice.Chinese', defaultMessage: '中文' })}
                  </Select.Option>
                  <Select.Option value="en">
                    {intl.formatMessage({ id: 'pages.notice.English', defaultMessage: '英文' })}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {emailShow && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <span className="line" />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {intl.formatMessage({
                    id: 'pages.notice.emailContent',
                    defaultMessage: '邮件内容',
                  })}
                </span>
              </div>
              <Tabs type="card">
                {chineseArea && (
                  <Tabs.TabPane
                    tab={intl.formatMessage({ id: 'pages.notice.Chinese', defaultMessage: '中文' })}
                    key="3"
                  >
                    <ReactQuill
                      ref={quillEl}
                      className="publish-quill"
                      placeholder={intl.formatMessage({
                        id: 'pages.notice.content.placeholder',
                        defaultMessage: '请输入文章内容',
                      })}
                      theme="snow"
                      modules={modules}
                      value={emailChinese}
                      onChange={handleEmailChinese}
                    />
                  </Tabs.TabPane>
                )}
                {englishArea && (
                  <Tabs.TabPane
                    tab={intl.formatMessage({
                      id: 'pages.notice.language.English',
                      defaultMessage: 'English',
                    })}
                    key="4"
                  >
                    <ReactQuill
                      className="publish-quill"
                      placeholder="Please input"
                      theme="snow"
                      modules={modules}
                      value={emailEnglish}
                      onChange={handleEmailEnglish}
                    />
                  </Tabs.TabPane>
                )}
              </Tabs>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.notice.attachment',
                  defaultMessage: '附件',
                })}
              >
                <Upload
                  fileList={emailFileList}
                  onChange={handleEmailUpload}
                  beforeUpload={beforeEmailUpload}
                  onPreview={emailPreview}
                  // accept={filePostfix}
                  multiple
                  showUploadList={true}
                  onRemove={emailRemove}
                >
                  <Button icon={<UploadOutlined />} style={{ width: '110px' }}>
                    {intl.formatMessage({
                      id: 'pages.notice.uploadFile',
                      defaultMessage: '上传附件',
                    })}
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          )}
          {systemShow && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '4px',
                    height: '16px',
                    background: '#21bb7e',
                    marginRight: '5px',
                  }}
                />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {intl.formatMessage({
                    id: 'pages.notice.systemContent',
                    defaultMessage: '系统内容',
                  })}
                </span>
              </div>
              <Tabs type="card">
                {chineseArea && (
                  <Tabs.TabPane
                    tab={intl.formatMessage({ id: 'pages.notice.Chinese', defaultMessage: '中文' })}
                    key="3"
                  >
                    <ReactQuill
                      className="publish-quill"
                      placeholder={intl.formatMessage({
                        id: 'pages.notice.content.placeholder',
                        defaultMessage: '请输入文章内容',
                      })}
                      theme="snow"
                      modules={modules}
                      value={systemChinese}
                      onChange={handleSystemChinese}
                    />
                  </Tabs.TabPane>
                )}
                {englishArea && (
                  <Tabs.TabPane tab="English" key="4">
                    <ReactQuill
                      className="publish-quill"
                      placeholder="Please input"
                      theme="snow"
                      modules={modules}
                      value={systemEnglish}
                      onChange={handleSystemEnglish}
                    />
                  </Tabs.TabPane>
                )}
              </Tabs>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.notice.attachment',
                  defaultMessage: '附件',
                })}
              >
                <Upload
                  fileList={systemFileList}
                  onChange={handleSystemUpload}
                  beforeUpload={beforeSystemUpload}
                  onPreview={systemPreview}
                  // accept={filePostfix}
                  multiple
                  showUploadList={true}
                  onRemove={systemRemove}
                >
                  <Button icon={<UploadOutlined />} style={{ width: '110px' }}>
                    {intl.formatMessage({
                      id: 'pages.notice.uploadFile',
                      defaultMessage: '上传附件',
                    })}
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          )}
        </Form>
      </div>
    </>
  );
};
export default AddNotice;
