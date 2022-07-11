import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const PrivilegeManage = () => {
  return (
    <>
      <PageHeaderWrapper />
      <div style={{ display: 'flex' }}>
        <div
          style={{
            minWidth: '260px',
            minHeight: '750px',
            backgroundColor: '#fff',
            marginTop: '16px',
            marginRight: '25px',
          }}
        >
          <Tabs tabPosition="left">
            <TabPane tab="Tab 1" key="1" />
            <TabPane tab="Tab 2" key="2" />
            <TabPane tab="Tab 3" key="3" />
          </Tabs>
        </div>
        <div style={{ flex: 1 }}>
          {/* <TableList queryParam={queryParam} SelectedKeys={selectedKeys} columns={tableColumns} /> */}
        </div>
      </div>
    </>
  );
};
export default PrivilegeManage;
