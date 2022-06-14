import { Button, Form, Input } from 'antd';
import React from 'react';
const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 6,
  },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */

const UserManage = () => {
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div style={{ background: '#fff', padding: '30px', height: '100vh' }}>
      <Form
        {...layout}
        name="port-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
        colon={false}
      >
        <Form.Item
          name={['user', 'name']}
          label="SMTP服务器"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder={'单行输入'} />
        </Form.Item>
        <Form.Item
          name={['user', 'email']}
          label="端口号"
          rules={[
            {
              type: 'email',
            },
          ]}
        >
          <Input placeholder={'单行输入'} maxLength={200} />
        </Form.Item>
        <Form.Item
          name={['user', 'name']}
          label="SSL"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder={'单行输入'} />
        </Form.Item>
        <Form.Item
          name={['user', 'name']}
          label="账号"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder={'单行输入'} />
        </Form.Item>
        <Form.Item
          name={['user', 'name']}
          label="密码"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password placeholder={'单行输入'} />
        </Form.Item>
        <Form.Item
          name={['user', 'name']}
          label="名称"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder={'单行输入'} />
        </Form.Item>
        <Form.Item
          style={{ display: 'flex' }}
          name={['user', 'name']}
          label="邮件测试"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder={'请输入账号'} />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserManage;