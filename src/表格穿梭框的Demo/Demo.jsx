/*
 * @Author: dejavu518 cf_1118sab@163.com
 * @Date: 2022-08-02 09:23:35
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2022-09-28 15:08:01
 * @FilePath: \my-react-demo\src\表格穿梭框的Demo\Demo.jsx
 * @Description:Demo
 */
import { getPositionTree } from '@/services/swagger/eservice';
import { PageContainer } from '@ant-design/pro-layout';
import { Col, Descriptions, Row, Tabs, Transfer, Tree, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);

const generateTree = (treeNodes = [], checkedKeys = []) =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    // disabled: checkedKeys.includes(props.key),
    disabled: checkedKeys.includes(props.id),
    children: generateTree(children, checkedKeys),
  }));

const TreeTransfer = ({ rightColumns, dataSource, targetKeys, ...restProps }) => {
  console.log({ ...restProps }, 999);
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach((item) => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  }
  flatten(dataSource);
  return (
    <Transfer
      rowKey={(record) => record.id}
      showSearch
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.name}
      showSelectAll={false}
    >
      {({ direction, filteredItems, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              fieldNames={{ title: 'name', key: 'id' }}
              treeData={generateTree(dataSource, targetKeys)}
              // onCheck={(_, { node: { key } }) => {
              //   onItemSelect(key, !isChecked(checkedKeys, key));
              // }}
              // onSelect={(_, { node: { key } }) => {
              //   onItemSelect(key, !isChecked(checkedKeys, key));
              // }}
              onCheck={(_, { node: { id } }) => {
                onItemSelect(id, !isChecked(checkedKeys, id));
              }}
              onSelect={(_, { node: { id } }) => {
                onItemSelect(id, !isChecked(checkedKeys, id));
              }}
            />
          );
        } else {
          const columns = rightColumns;
          const rowSelection = {
            onSelect({ key }, selected) {
              onItemSelect(key, selected);
            },

            // selectedRowKeys: listSelectedKeys,
          };
          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              // style={{
              //   pointerEvents: listDisabled ? 'none' : undefined,
              // }}
              // onRow={({ key, disabled: itemDisabled }) => ({
              //   onClick: () => {
              //     if (itemDisabled || listDisabled) return;
              //     onItemSelect(key, !listSelectedKeys.includes(key));
              //   },
              // })}
            />
          );
        }
      }}
    </Transfer>
  );
};

const UserTable = () => {
  const intl = useIntl();
  const [positionTree, setPositionTree] = useState([]);

  useEffect(() => {
    let param = {
      team_guid: '',
    };
    getPositionTree(param).then((res) => {
      if (res.success) {
        let dt = eval('(' + res.data + ')');
        console.log(dt);
        // setPositionTree(dt);
        if (dt !== []) {
          (function () {
            let x = 0;
            var toTree = function (tarArray) {
              // 为了防止改变原数组，需要深拷贝一份数组
              let tarArray1 = JSON.parse(JSON.stringify(tarArray));
              // 首先定义一个变量，把数组中的每一项以当前项的id为下标存入对象中
              var obj = {};
              // 遍历数组并存入项
              tarArray1.map((item, index) => {
                x++;
                obj[item.id] = item;
              });
              // 定义一个新数组，用来保存生成的树形数组
              var newArr = [];
              //再次遍历数组进行检测
              tarArray1.forEach((item, index) => {
                x++;
                // 先去刚才的对象中查找当前项有没有父级
                let curItemParent = obj[item.pId];
                if (curItemParent) {
                  // 如果有那么就判断当前的父级有没有children属性，如果没有取空数组，如果有取本身children
                  curItemParent.children = curItemParent.children || [];
                  // 然后把当前项推入到他的父级的children 数组中
                  curItemParent.children.push(item);
                } else {
                  // 如果没有证明这个是根节点，直接放到新数组中
                  newArr.push(item);
                }
              });
              console.log(newArr, 8888);
              setPositionTree(newArr);
            };
            toTree(dt);
            console.log(x);
            // 20
            // 此方法是循环次数最少的，但是需要额外定义一个对象来做对比
          })();
        }
      }
    });
  }, []);
  const rightTableColumns = [
    {
      title: '用户姓名',
      dataIndex: 'name',
    },
    {
      title: '参与团队',
      dataIndex: 'Participle_Team',
    },
  ];
  const [targetKeys, setTargetKeys] = useState([]);
  const onChange = (keys) => {
    setTargetKeys(keys);
  };

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
              <Descriptions.Item label="工单编号">20220727001</Descriptions.Item>
              <Descriptions.Item label="工单模板名称">平台基础信息维护</Descriptions.Item>
              <Descriptions.Item label="工单类型">工单A类型</Descriptions.Item>
              <Descriptions.Item label="工单来源">平台</Descriptions.Item>
              <Descriptions.Item label="所属平台">云南白药</Descriptions.Item>
              <Descriptions.Item label="所属项目">--</Descriptions.Item>
              <Descriptions.Item label="发起人">小明</Descriptions.Item>
              <Descriptions.Item label="创建人">张三</Descriptions.Item>
              <Descriptions.Item label="创建时间">2022-07-27 17：00</Descriptions.Item>
            </Descriptions>
          </div>
        </Col>
        <Col className="gutter-row" span={19}>
          <div style={{ background: '#fff', minHeight: '780px', padding: '16px' }}>
            <Tabs>
              <Tabs.TabPane tab="工单信息" key="1">
                <Tree
                  treeData={positionTree}
                  defaultExpandAll
                  fieldNames={{ title: 'name', key: 'id' }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="工单进度" key="2">
                <TreeTransfer
                  rightColumns={rightTableColumns}
                  dataSource={positionTree}
                  targetKeys={targetKeys}
                  onChange={onChange}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default UserTable;
