import { PageContainer } from '@ant-design/pro-layout';
import { Col, Descriptions, Form, Row, Select, Table, Tabs } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; //富文本样式文件
import { useIntl } from 'umi';
import './index.less';
const UserTable = () => {
  const intl = useIntl();
  const tab = () => {
    return <div style={{ width: '80px', textAlign: 'center' }}>邮件</div>;
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
    },
  };
  // 表格列
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '人员',
      dataIndex: 'people',
    },
  ];
  const tableData = [
    {
      type: '外部用户',
    },
    {
      type: '内部用户',
    },
  ];
  return (
    <>
      <PageContainer />
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col className="gutter-row" span={5}>
          <div
            style={{
              background: '#fff',
              minHeight: '800px',
              padding: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>基本信息</span>
            </div>
            <Descriptions
              column={1}
              style={{ marginTop: '16px' }}
              contentStyle={{ fontSize: '12px' }}
              labelStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            >
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.systemParam.template.mainObj',
                  defaultMessage: '主送对象',
                })}
              >
                ⅹⅹⅹⅹⅹⅹ
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.systemParam.template.contact',
                  defaultMessage: '触点',
                })}
              >
                用户管理-新增人员-确认
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.systemParam.template.subject',
                  defaultMessage: '主题',
                })}
              >
                创建新用户账号通知
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.systemParam.template.sendType',
                  defaultMessage: '发送方式',
                })}
              >
                邮件（默认）
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.systemParam.template.detail',
                  defaultMessage: '详细说明',
                })}
              >
                这是一条文案
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Col>
        <Col className="gutter-row" span={19}>
          <div style={{ background: '#fff', minHeight: '780px', padding: '16px' }}>
            <Tabs>
              <Tabs.TabPane tab={tab()}>
                <Form labelCol={{ span: 24 }}>
                  <Form.Item name="language" rules={[{ required: true }]} label="语言">
                    <Select style={{ width: '40%' }}>
                      <Select.Option>中文</Select.Option>
                      <Select.Option>英文</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="content" rules={[{ required: true }]} label="内容">
                    <ReactQuill
                      className="publish-quill"
                      placeholder="请输入文章内容"
                      theme="snow"
                      modules={modules}
                    />
                  </Form.Item>
                  <Form.Item label="抄送对象" name="sendObj">
                    <Table columns={columns} dataSource={tableData} bordered pagination={false} />
                  </Form.Item>
                </Form>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default UserTable;
