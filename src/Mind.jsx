// 工单提醒@chenfang
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useIntl } from 'umi';
import { Button, Checkbox, Form, Select, Table, TimePicker } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        time={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
        <TimePicker ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
s;
const RecentSetting = () => {
  const intl = useIntl();
  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      time: '09:00',
    },
    {
      key: '1',
      time: '12:00',
    },
  ]);
  const [count, setCount] = useState(2);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: intl.formatMessage({ id: 'pages.eservice.mind.time', defaultMessage: '提醒时间点' }),
      dataIndex: 'time',
      align: 'center',
      editable: true,
      width: '50%',
    },
    {
      title: (
        <PlusOutlined
          onClick={() => {
            handleAdd();
          }}
          style={{ cursor: 'pointer', color: '#21bb7e' }}
        />
      ),
      dataIndex: 'operation',
      align: 'center',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <DeleteOutlined onClick={() => handleDelete(record.key)} style={{ color: 'red' }} />
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData = {
      key: count,
      time: '09:00',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const HeaderExtra = (
    <Button
      type="primary"
      onClick={() => {
        onSave();
      }}
    >
      {intl.formatMessage({ id: 'pages.save', defaultMessage: '保存' })}
    </Button>
  );

  function onSave() {
    alert('保存');
  }
  return (
    <div>
      <PageHeaderWrapper extra={HeaderExtra} />
      <div style={{ background: '#fff', marginTop: '16px', minHeight: '780px', padding: '17px' }}>
        <Form labelCol={{ span: 24 }} wrapperCol={{ span: 8 }}>
          <div style={{ marginBottom: '25px' }}>
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
                id: 'pages.eservice.recentMind',
                defaultMessage: '近效期提醒',
              })}
            </span>
          </div>
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.eservice.mind.startTime',
              defaultMessage: '开始提醒时间',
            })}
            name="startTime"
            rules={[{ required: true }]}
          >
            <span>预计完成时间到期前</span>
            <Select style={{ width: '200px', margin: '0 10px' }}>
              <Select.Option>1</Select.Option>
              <Select.Option>2</Select.Option>
              <Select.Option>3</Select.Option>
            </Select>
            <span>
              {intl.formatMessage({ id: 'pages.eservice.date', defaultMessage: '日历日' })}
            </span>
          </Form.Item>
          <div style={{ marginBottom: '25px' }}>
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
                id: 'pages.eservice.mind.setting',
                defaultMessage: '提醒设置',
              })}
            </span>
          </div>
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.eservice.mind.way',
              defaultMessage: '提醒方式',
            })}
            name="mindWay"
            rules={[{ required: true }]}
          >
            <Checkbox value={0}>
              {' '}
              {intl.formatMessage({
                id: 'pages.system',
                defaultMessage: '系统',
              })}
            </Checkbox>
            <Checkbox value={1}>
              {intl.formatMessage({
                id: 'pages.email',
                defaultMessage: '邮件',
              })}
            </Checkbox>
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.eservice.mind.time',
              defaultMessage: '提醒时间点',
            })}
            rules={[{ required: true }]}
            name="mindTime"
          >
            <Table
              pagination={false}
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={dataSource}
              columns={columns}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default RecentSetting;
