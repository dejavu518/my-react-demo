import { useState } from 'react';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './index.less';
const index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const menu_arr = [
    { key: 0, name: '基本信息' },
    { key: 1, name: '安全设置' },
  ];
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <div style={{ width: '200px', height: '200px', background: '#fff' }}>
          <UserOutlined />
          <Button type="danger">退出登录</Button>
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
                  className={currentIndex === item.key ? 'active' : ''}
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
        {currentIndex === 0 && <div style={{ marginTop: '16px' }}>基本信息</div>}
        {currentIndex === 1 && <div style={{ padding: '0 8px' }}>安全设置</div>}
      </div>
    </div>
  );
};
export default index;
