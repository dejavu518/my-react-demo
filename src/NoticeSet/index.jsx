// @系统通告
import MySearchCondition from '@/components/MyTable/components/MySearchCondition';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Badge, Checkbox, Col, Form, Input, Modal, Row, Tooltip, Drawer, Tabs, Select } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useModel, history } from 'umi';
import './index.less';
const { TextArea } = Input;
const UserTable = () => {
  const actionRef = useRef();
  const [editForm] = Form.useForm();
  const { TabPane } = Tabs;
  const { LAYOUTMARGIN } = useModel('Constant');
  const [queryParam, setQueryParam] = useState({});
  const [modalData, setModalData] = useState({});
  const [queryTypes, setQueryTypes] = useState([{ field_name: 'ddd', name: '测试想' }]);
  const [totalCount, setTotalCount] = useState(12);
  const [activeKey, setActiveKey] = useState('tab1');
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [tableData, setTableData] = useState([]);
  // const [drawerVisible, setDrawerVisible] = useState(false);
  // const [drawerTitle, setDrawerTitle] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const renderBadge = (count, active = false) => {
    return (
      <Badge
        count={count}
        style={{
          marginTop: -2,
          marginLeft: 4,
          color: active ? '#1890FF' : '#999',
          backgroundColor: active ? '#E6F7FF' : '#eee',
        }}
      />
    );
  };
  const toolbar = {
    menu: {
      type: 'tab', // inline | dropdown | tab
      activeKey: activeKey,
      items: [
        {
          key: 'tab1',
          // label: <span>系统通过设置列表{renderBadge(2, activeKey === 'tab1')}</span>,
          label: <span>系统通告设置列表</span>,
        },
      ],
      onChange: (key) => {
        setActiveKey(key);
      },
    },
  };
  const onGetQueryParam = (params) => {
    setQueryParam(() => {
      return params;
    });
  };
  const paginationChange = useCallback((pageInfo) => {
    setPagination(() => {
      return {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
      };
    });
  }, []);
  const columns = [
    {
      title: (
        <>
          ID
          <Tooltip placement="top" title="ID是唯一的key">
            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
          </Tooltip>
        </>
      ),
      dataIndex: 'id',
      align: 'left',
      render: (_) => <a>{_}</a>,
    },
    {
      title: '触点',
      dataIndex: 'chu',
      align: 'left',
    },
    {
      title: '默认方式',
      dataIndex: 'deType',
      align: 'left',
      sorter: (a, b) => a.containers - b.containers,
    },
    {
      title: '其他方式',
      dataIndex: 'orType',
      align: 'left',
    },
    {
      title: '主题',
      dataIndex: 'title',
      align: 'left',
    },
    {
      title: '详细说明',
      dataIndex: 'talk',
      align: 'left',
    },
    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (id, record) => [
        <a
          onClick={() => {
            setIsModalEdit(true);
            setModalData(() => {
              return {};
            });
          }}
          key="link"
        >
          编辑
        </a>,
        <a
          key="link2"
          onClick={(e) => {
            // setDrawerVisible(true);
            // setDrawerTitle(record.id);
            e.preventDefault();
            handleTemplate(record);
          }}
        >
          模板
        </a>,
        <a key="link3">日志</a>,
      ],
    },
  ];
  const EditHandleOk = () => {
    editForm
      .validateFields()
      .then((values) => {
        console.log(values);
        setIsModalEdit(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const EditHandleCancel = () => {
    setIsModalEdit(false);
  };
  // const onClose = () => {
  //   setDrawerVisible(false);
  // };
  function handleTemplate(record) {
    history.push({
      pathname: '/console/sys-params/template-set',
    });
  }
  useEffect(() => {
    const tableParam = {
      queryAry: queryParam.length ? JSON.stringify(queryParam) : undefined,
      ...pagination,
    };
    setTableData(() => {
      var arr = [];
      for (let i = 0; i < 12; i += 1) {
        arr.push({
          key: i,
          id: 'R00' + i,
          deType: '邮件',
          orType: '短信',
          title: '**********************',
          talk: '这是一段介绍',
        });
      }
      return arr;
    });

    // rule(tableParam).then((datalist) => {
    //   setTotalCount(() => {
    //     return datalist.total;
    //   });
    //   setTableData(() => {
    //     return datalist.data;
    //   });
    // });
  }, [pagination, queryParam]);
  return (
    <>
      <PageHeaderWrapper />
      <MySearchCondition style={{ margin: 0 }} search={onGetQueryParam} queryTypes={queryTypes} />
      <div style={{ margin: `${LAYOUTMARGIN} -8px -8px` }}>
        <ProTable
          actionRef={actionRef}
          rowKey="key"
          search={false}
          dataSource={tableData}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              console.log(selectedRows);
            },
          }}
          pagination={{
            showSizeChanger: true,
            ...pagination,
            total: totalCount,
          }}
          toolbar={{
            ...toolbar,
          }}
          onChange={(pagination, filters, sorter) => {
            console.log('paginatioin changed');
            paginationChange(pagination);
          }}
        />
      </div>
      <Modal
        title="系统通告编辑"
        destroyOnClose
        width={500}
        visible={isModalEdit}
        onOk={EditHandleOk}
        onCancel={EditHandleCancel}
      >
        <div style={{ marginBottom: '24px' }}>
          <span style={{ color: 'red' }}>*</span> ID: 123
        </div>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ color: 'red' }}>*</span> 触点: 用户管理-新增用户-确认
        </div>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ color: 'red' }}>*</span> 默认方式: 邮件
        </div>
        <div>
          <Form
            form={editForm}
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
            <Form.Item label="其他方式" name="orType">
              <Checkbox.Group>
                <Row>
                  <Col span={12}>
                    <Checkbox value="system" style={{ lineHeight: '32px' }}>
                      系统
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="note" style={{ lineHeight: '32px' }}>
                      短信
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              label="主题"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入主题!',
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="详细说明" name="xiangxi">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {/* <Drawer
        placement="right"
        onClose={onClose}
        visible={drawerVisible}
        title={'系统通告模板编辑-' + drawerTitle}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="邮件" key="1">
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: 'red' }}>*</span> 主送对象：R000
            </div>
            <Form>
              <span style={{ marginBottom: '20px', display: 'block' }}>抄送对象</span>
              <Form.Item label="系统用户" name="system_user">
                <Select defaultValue="1">
                  <Select.Option value="1">有效用户</Select.Option>
                  <Select.Option value="2">无效用户</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="外部人员" name="external_staff">
                <Input placeholder="请输入邮箱" />
              </Form.Item>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: 'red' }}>*</span> 语言
              </div>
              <Form.Item name="language">
                <Input />
              </Form.Item>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: 'red' }}>*</span> 邮件正文
              </div>
              <Form.Item name="content" rules={[{ required: true, message: '请输入文章内容' }]}>
                <ReactQuill className="publish-quill" theme="snow" placeholder="请输入文章内容" />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="系统" key="2">
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: 'red' }}>*</span> 主送对象：R000
            </div>
            <Form>
              <span style={{ marginBottom: '20px', display: 'block' }}>抄送对象</span>
              <Form.Item label="系统用户" name="system_user">
                <Select defaultValue="1">
                  <Select.Option value="1">有效用户</Select.Option>
                  <Select.Option value="2">无效用户</Select.Option>
                </Select>
              </Form.Item>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: 'red' }}>*</span> 语言
              </div>
              <Form.Item name="language">
                <Input />
              </Form.Item>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: 'red' }}>*</span> 邮件正文
              </div>
              <Form.Item name="content" rules={[{ required: true, message: '请输入文章内容' }]}>
                <ReactQuill className="publish-quill" theme="snow" placeholder="请输入文章内容" />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Drawer> */}
    </>
  );
};

export default UserTable;
