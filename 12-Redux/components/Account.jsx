import { useState } from 'react';
import { Button, Descriptions, Rate, Avatar, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import './index.less';
const Index = () => {
  const intl = useIntl();
  const [currentIndex, setCurrentIndex] = useState(0);
  const menu_arr = [
    { key: 0, name: '基本信息' },
    { key: 1, name: '安全设置' },
  ];
  const listData = [
    {
      title: '登录密码',
      tip: '密码必须由字母、数字、特殊字符组成，且长度必须大于8位',
    },
    {
      title: '邮箱账号',
      tip: '您已绑定了邮箱zhang.san@cims-medtech.com 【系统的一些重要信息将通告邮件告知，同时您可以直接用于登录、找回密码等】',
    },
  ];
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <div
          style={{
            width: '200px',
            height: '200px',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            // alignContent: 'space-around',
            textAlign: 'center',
          }}
        >
          <Avatar
            style={{
              backgroundColor: '#87d068',
              margin: 'auto',
            }}
            icon={<UserOutlined />}
            size={40}
          />
          <span>张三</span>
          <Button type="danger" style={{ width: '100px', margin: 'auto' }}>
            退出登录
          </Button>
        </div>
        <div
          style={{
            width: '200px',
            minHeight: '750px',
            backgroundColor: '#fff',
            marginTop: '16px',
            marginRight: '15px',
          }}
        >
          <ul className={'menu_ul'}>
            {menu_arr.map((item) => {
              return (
                <li
                  key={item.key}
                  className={currentIndex == item.key ? 'active' : ''}
                  onClick={() => {
                    setCurrentIndex(() => {
                      return item.key;
                    });
                  }}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div style={{ minHeight: '750px', width: '100%', background: '#fff' }}>
        {currentIndex == 0 && (
          <div style={{ padding: '20px' }}>
            <h3 style={{ fontWeight: 'bold' }}>基本信息</h3>
            <div style={{ padding: '30px 50px' }}>
              <Descriptions
                column={1}
                style={{
                  color: '#8c8e90',
                  fontWeight: 'bold',
                  fontSize: '24px',
                }}
              >
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'pages.usermanage.userID',
                    defaultMessage: '用户ID',
                  })}
                >
                  123
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'pages.usermanage.name',
                    defaultMessage: '姓名',
                  })}
                >
                  张三
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'pages.usermanage.email',
                    defaultMessage: '邮箱',
                  })}
                >
                  9876543
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'pages.usermanage.label.phone',
                    defaultMessage: '联系电话',
                  })}
                >
                  1234567
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'pages.type',
                    defaultMessage: '类型',
                  })}
                >
                  正式
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'pages.usermanage.groupPosition',
                    defaultMessage: '组织/职位',
                  })}
                >
                  empty
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'pages.status',
                    defaultMessage: '状态',
                  })}
                >
                  有效
                </Descriptions.Item>
              </Descriptions>
              <Button type="primary" style={{ width: '80px' }}>
                修改
              </Button>
            </div>
          </div>
        )}
        {currentIndex == 1 && (
          <div style={{ padding: '20px' }}>
            <h3 style={{ fontWeight: 'bold' }}>安全设置</h3>
            <div style={{ padding: '30px 50px' }}>
              <div>当前密码等级：</div>
              <List
                style={{ marginTop: '50px' }}
                itemLayout="horizontal"
                dataSource={listData}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={item.title} description={item.tip} />
                    <Button
                      type="primary"
                      style={{ width: '80px' }}
                      onClick={(e) => {
                        e.preventDefault();
                        alert('修改' + item.title);
                      }}
                    >
                      修改
                    </Button>
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Index;
