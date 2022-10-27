/*
 * @Author: dejavu518 cf_1118sab@163.com
 * @Date: 2022-10-27 09:23:48
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2022-10-27 09:24:20
 * @FilePath: \my-react-demo\src\WorkOrderAuthorization\index.jsx
 * @Description: 
 */
// 人员管理-工单授权(那边已删除)
import MySearchCondition from '@/components/MyTable/components/MySearchCondition';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Space } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from 'umi';
import TableList from '../components/TableList';

const rangePickerProps = {
  showTime: false,
};

const Authorization = () => {
  const intl = useIntl();
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState({});
  const [queryParam, setQueryParam] = useState({});
  const onGetQueryParam = (params) => {
    setQueryParam(() => {
      return params;
    });
  };
  // 操作按钮
  const operateButtons = (_, record) => {
    return (
      <Space key={record.User_Guid}>
        {/* 详情 */}
        <a
          key="authorization"
          onClick={(e) => {
            e.preventDefault();
            setCurrentRow(record);
          }}
        >
          授权
        </a>
        {/* 日志 */}
        <a
          key="log"
          onClick={(e) => {
            e.preventDefault();
            setCurrentRow(record);
            onDetail(record);
          }}
        >
          日志
        </a>
      </Space>
    );
  };
  // 表格列
  const tableColumns = [
    {
      title: '工单类型',
      dataIndex: 'type',
      valueType: 'text',
    },
    {
      title: '团队名称',
      dataIndex: 'team',
      valueType: 'text',
    },
    {
      title: '责任人',
      dataIndex: 'responsible',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'pages.operate', defaultMessage: 'Operate' }),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return [operateButtons(_, record)];
      },
    },
  ];
  /**
   * 详情
   */
  function onDetail(rowData) {
    alert('clicked invalid, status' + JSON.stringify(rowData));
  }
  return (
    <>
      <PageHeaderWrapper />
      <MySearchCondition
        search={onGetQueryParam}
        queryTypes={tableColumns}
        rangePickerProps={rangePickerProps}
      />
      <TableList queryParam={queryParam} columns={tableColumns} />
    </>
  );
};
export default Authorization;
