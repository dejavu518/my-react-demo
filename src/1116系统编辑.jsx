/*
 * @Author: dejavu518 cf_1118sab@163.com
 * @Date: 2022-07-15 09:25:49
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2022-11-16 14:31:31
 * @FilePath: \my-react-demo\src\1116系统编辑.jsx
 * @Description:系统设置-编辑
 */
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Select, Col, Tabs, Form, Input, Checkbox, Row, Button, Upload, message } from 'antd';
import { getTemplateNoticeInfo, saveTemplateNotice } from '@/services/swagger/parameter';
import { getCommonUserList } from '@/services/swagger/user';
import { UploadOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import { uploadFileAsync } from '@/services/swagger/user';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.less';
const { TextArea } = Input;
const mainObjectList = [];
for (let i = 10; i < 36; i++) {
  mainObjectList.push(<Select.Option key={i.toString(36) + i}>{i.toString(36) + i}</Select.Option>);
}
const NoticeEdit = (props) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [quillChineseValue, setQuillChineseValue] = useState('');
  const [quillEnglishValue, setQuillEnglishValue] = useState('');
  const [systemShow, setSystemShow] = useState(false);
  const [templateInfo, setTemplateInfo] = useState({});
  const [systemUserList, setSystemUserList] = useState([]);
  const [emailContArea, setEmailContArea] = useState(false); //邮件内容区域
  const [emailChineseDis, setEmailChineseDis] = useState(false); //邮件中文区域
  const [emailEnglishDis, setEmailEnglishDis] = useState(false); //邮件英文区域
  const [emailActiveKey, setEmailActiveKey] = useState('eTab1');
  const [language, setLanguage] = useState();
  const [sendSystem, setSendSystem] = useState(0);
  const [emailFileList, setEmailFileList] = useState([]);
  const [emailFileData, setEmailFileData] = useState({});
  const [emailFileDataList, setEmailFileDataList] = useState([]);
  const [emailMainObj, setEmailMainObj] = useState([]);
  const { id } = props.location.query;
  const headerExtra = (
    <Button
      type="primary"
      onClick={() => {
        saveNotice();
      }}
    >
      {intl.formatMessage({ id: 'pages.save', defaultMessage: '保存' })}
    </Button>
  );
  const tab = (v) => {
    if (v === 1) {
      return (
        <div style={{ width: '80px', textAlign: 'center' }}>
          {intl.formatMessage({ id: 'pages.email', defaultMessage: '邮件' }) + '*'}
        </div>
      );
    } else if (v === 2) {
      return (
        <div style={{ width: '80px', textAlign: 'center' }}>
          {intl.formatMessage({ id: 'pages.system', defaultMessage: '系统' })}
        </div>
      );
    } else {
      return null;
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
  /**上传前-（邮件）**/
  const beforeEmailUpload = (file) => {
    setEmailFileList([file]);
    return false;
  };
  /**上传附件-（邮件）**/
  const handleEmailUpload = () => {
    const formData = new FormData();
    formData.append('file', emailFileList[0]);
    uploadFileAsync(formData).then((res) => {
      if (res.success) {
        setEmailFileData(res.data);
        emailFileDataList.push(res.data);
      }
    });
  };
  const handleQuillChangeChinese = (v) => {
    setQuillChineseValue(v);
  };
  const handleQuillChangeEnglish = (v) => {
    setQuillEnglishValue(v);
  };
  const onSetSystem = (e) => {
    let v = e.target.checked;
    if (v) {
      setSystemShow(true);
      setSendSystem(1);
    } else {
      setSystemShow(false);
    }
  };
  /**语言选择**/
  const handleLanguageChange = (v) => {
    if (v.length > 0) {
      setEmailContArea(true);
      if (v.length === 1) {
        // 中文
        if (v[0] === 'zh-CN') {
          setEmailChineseDis(false);
          setEmailEnglishDis(true);
          setEmailActiveKey('eTab1');
        } else {
          // 英文
          setEmailEnglishDis(false);
          setEmailChineseDis(true);
          setEmailActiveKey('eTab2');
        }
      } else {
        setEmailChineseDis(false);
        setEmailEnglishDis(false);
      }
    } else {
      setEmailContArea(false);
    }
  };
  /**保存**/
  function saveNotice() {
    form.validateFields().then((values) => {
      let info = {
        sysrsc_no: 'TREE002',
        menursc_no: 'TREE002_03',
        handlersc_no: 'ACTION001',
        template_guid: templateInfo.Template_GUID,
        template_subject: values.subject,
        template_detailes: values.detail,
        send_email: '1',
        send_system: sendSystem,
        email_content: [{ lang: 'En', content: 'XXX' }],
        email_mainobject: emailMainObj.toString(),
        email_ccobject: '12c6acef-37ca-4a9f-beb0-0703eec7ebbb',
        email_attachment: emailFileDataList,
        system_content: [{ lang: 'En', content: 'XXX' }],
        system_mainobject: '系统主送对象',
        system_ccobject: '',
        system_attachment: [{ file_name: '附件1.doc', file_path: 'XXXX' }],
      };
      saveTemplateNotice(info).then((res) => {
        if (res.success) {
          message.success(
            intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功' }),
          );
          setTimeout(() => {
            history.go(-1);
          }, 1000);
        }
      });
    });
  }
  /**主送对象变化**/
  const emailMainObjChange = (v) => {
    setEmailMainObj(v);
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
  useEffect(() => {
    let param = {
      template_guid: id,
    };
    getTemplateNoticeInfo(param).then((res) => {
      if (res.success) {
        setTemplateInfo(() => {
          return res.data[0];
        });
        let dt = res.data[0];
        form.setFieldsValue({
          template_No: dt.Template_No,
          trigger_point: dt.Template_TriggerPoint,
          subject: dt.Template_Subject,
          detail: dt.Template_Detailes,
          email_mainobj: dt.Email_MainObject,
          email_ccobj: dt.Email_CcObject,
        });
      }
    });
  }, []);
  return (
    <>
      <PageHeaderWrapper extra={headerExtra} />
      <div
        style={{ backgroundColor: '#fff', padding: '16px', marginTop: '16px', minHeight: '780px' }}
      >
        <Form wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} form={form}>
          <div>
            <span className="line" />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {intl.formatMessage({
                id: 'pages.searchTable.updateForm.basicConfig',
                defaultMessage: '基本信息',
              })}
            </span>
          </div>
          <Row gutter={32}>
            <Col span={10}>
              <Form.Item
                label={intl.formatMessage({ id: 'pages.ID', defaultMessage: 'ID' })}
                name="template_No"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'pages.subject', defaultMessage: '主题' })}
                name="subject"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.sysParams.notice.contact',
                  defaultMessage: '触点',
                })}
                name="trigger_point"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'pages.sendWay', defaultMessage: '发送方式' })}
              >
                <Checkbox disabled checked>
                  {intl.formatMessage({
                    id: 'pages.sysParams.email.default',
                    defaultMessage: '邮件（默认）',
                  })}
                </Checkbox>
                <Checkbox onChange={onSetSystem}>
                  {intl.formatMessage({ id: 'pages.system', defaultMessage: '系统' })}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.sysParams.notice.instruction',
              defaultMessage: '详细说明',
            })}
            wrapperCol={{ span: 20 }}
            rows={6}
            name="detail"
          >
            <TextArea />
          </Form.Item>
          <div>
            <span className="line" />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {intl.formatMessage({
                id: 'pages.sysParams.template.content',
                defaultMessage: '模板内容',
              })}
            </span>
          </div>
          <Tabs>
            <Tabs.TabPane tab={tab(1)} key="1">
              <Row gutter={32}>
                <Col span={10}>
                  <Form.Item
                    label={intl.formatMessage({
                      id: 'pages.notice.mainObj',
                      defaultMessage: '主送对象',
                    })}
                    name="email_mainobj"
                  >
                    <Select
                      showArrow
                      mode="tags"
                      style={{
                        width: '100%',
                      }}
                      onChange={emailMainObjChange}
                    >
                      {mainObjectList}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({
                      id: 'pages.notice.language',
                      defaultMessage: '语言',
                    })}
                    name="language"
                    rules={[{ required: true }]}
                  >
                    <Select mode="multiple" onChange={handleLanguageChange}>
                      <Select.Option value="zh-CN">
                        {intl.formatMessage({ id: 'pages.notice.Chinese', defaultMessage: '中文' })}
                      </Select.Option>
                      <Select.Option value="en">
                        {intl.formatMessage({ id: 'pages.notice.English', defaultMessage: '英文' })}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label={intl.formatMessage({
                      id: 'pages.notice.ccObj',
                      defaultMessage: '抄送对象',
                    })}
                    name="email_ccobj"
                  >
                    <Select mode="multiple" showArrow>
                      {systemUserList.map((item) => {
                        return (
                          <Select.Option
                            key={item.User_GUID}
                            label={item.User_FullName}
                            value={item.User_GUID}
                          >
                            {item.User_FullName}
                          </Select.Option>
                        );
                      })}
                      <Select.Option>无</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                style={{ display: !emailContArea ? 'none' : 'block' }}
                label={intl.formatMessage({ id: 'pages.notice.content', defaultMessage: '内容' })}
                name="content"
                wrapperCol={{ span: 20 }}
              >
                <Tabs type="card" defaultActiveKey={emailActiveKey}>
                  <Tabs.TabPane
                    disabled={emailChineseDis}
                    // style={{ display: emailChineseDis ? 'none' : 'block' }}
                    tab={intl.formatMessage({ id: 'pages.notice.Chinese', defaultMessage: '中文' })}
                    key="eTab1"
                  >
                    <ReactQuill
                      className="publish-quill"
                      placeholder={intl.formatMessage({
                        id: 'pages.notice.content.placeholder',
                        defaultMessage: '请输入文章内容',
                      })}
                      theme="snow"
                      modules={modules}
                      value={quillChineseValue}
                      onChange={handleQuillChangeChinese}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    disabled={emailEnglishDis}
                    tab={intl.formatMessage({
                      id: 'pages.notice.language.English',
                      defaultMessage: 'English',
                    })}
                    key="eTab2"
                  >
                    <ReactQuill
                      className="publish-quill"
                      placeholder="Please input"
                      theme="snow"
                      modules={modules}
                      value={quillEnglishValue}
                      onChange={handleQuillChangeEnglish}
                    />
                  </Tabs.TabPane>
                </Tabs>
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.notice.attachment',
                  defaultMessage: '附件',
                })}
                name="attachment"
              >
                <Upload
                  fileList={emailFileList}
                  onChange={handleEmailUpload}
                  beforeUpload={beforeEmailUpload}
                  // accept={filePostfix}
                  multiple
                  showUploadList={true}
                  // onRemove={handleRemove}
                >
                  <Button icon={<UploadOutlined />} style={{ width: '110px' }}>
                    {intl.formatMessage({
                      id: 'pages.notice.uploadFile',
                      defaultMessage: '上传附件',
                    })}
                  </Button>
                </Upload>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab={systemShow ? tab(2) : tab(3)} key="2">
              <Row gutter={32}>
                <Col span={10}>
                  <Form.Item
                    label={intl.formatMessage({
                      id: 'pages.notice.mainObj',
                      defaultMessage: '主送对象',
                    })}
                    name="system_mainobj"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({
                      id: 'pages.notice.language',
                      defaultMessage: '语言',
                    })}
                    name="language"
                    rules={[{ required: true }]}
                  >
                    <Select mode="multiple">
                      <Select.Option value="1">
                        {intl.formatMessage({ id: 'pages.notice.Chinese', defaultMessage: '中文' })}
                      </Select.Option>
                      <Select.Option value="2">
                        {intl.formatMessage({ id: 'pages.notice.English', defaultMessage: '英文' })}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label={intl.formatMessage({
                      id: 'pages.notice.ccObj',
                      defaultMessage: '抄送对象',
                    })}
                    name="system_ccobj"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label={intl.formatMessage({ id: 'pages.notice.content', defaultMessage: '内容' })}
                name="system_content"
                // rules={[{ required: true }]}
                wrapperCol={{ span: 20 }}
              >
                <Tabs type="card">
                  <Tabs.TabPane
                    tab={intl.formatMessage({ id: 'pages.notice.Chinese', defaultMessage: '中文' })}
                    key="3"
                  >
                    {/* <ReactQuill
                      className="publish-quill"
                      placeholder="请输入文章内容"
                      theme="snow"
                      modules={modules}
                      value={quillChineseValue}
                      onChange={handleQuillChangeChinese}
                    /> */}
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={intl.formatMessage({
                      id: 'pages.notice.language.English',
                      defaultMessage: 'English',
                    })}
                    key="4"
                  >
                    {/* <ReactQuill
                      className="publish-quill"
                      placeholder="Please input"
                      theme="snow"
                      modules={modules}
                      value={quillEnglishValue}
                      onChange={handleQuillChangeEnglish}
                    /> */}
                  </Tabs.TabPane>
                </Tabs>
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.notice.attachment',
                  defaultMessage: '附件',
                })}
                name="attachment"
              >
                <Upload>
                  <Button icon={<UploadOutlined />} style={{ width: '110px' }}>
                    {intl.formatMessage({
                      id: 'pages.notice.uploadFile',
                      defaultMessage: '上传附件',
                    })}
                  </Button>
                </Upload>
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </div>
    </>
  );
};

export default NoticeEdit;
