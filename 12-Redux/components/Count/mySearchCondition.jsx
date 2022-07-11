import { Button, DatePicker, Form, Input, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getIntl, useIntl, useModel } from 'umi';

const { Option } = Select;
const { RangePicker } = DatePicker;
const Intl = getIntl();

const BETWEEN = 'between';
const conditionItems = [
  {
    name: '=',
    value: '=',
  },
  {
    name: '>=',
    value: '>=',
  },
  {
    name: '<=',
    value: '<=',
  },
  {
    name: '包含',
    value: 'like',
  },
  {
    name: '区间',
    value: BETWEEN,
  },
];
const ConditionNode = conditionItems.map((item) => {
  return (
    <Option key={item.value} value={item.value}>
      {item.name}
    </Option>
  );
});
const MySearchCondition = (props) => {
  const intl = useIntl();
  const [form1] = Form.useForm();
  const { search, queryTypes, rangePickerProps } = props;
  const queryLength = queryTypes.length;
  const [searchRow, setSearchRow] = useState(0);
  const [keyRow, setKeyRow] = useState();
  const [addedRows, setAddedRows] = useState([]);
  const ObjectNode = queryTypes.map((item) => {
    if (item.valueType !== 'index' && item.valueType !== 'option') {
      const obj = {
        field_name: item.field_name || item.dataIndex,
        name: item.name || item.title,
        field_type: item.valueType,
      };
      return (
        <Option key={obj.field_name} value={obj.field_name}>
          {obj.name}
        </Option>
      );
    }
  });
  const onFinish = (values) => {
    let arr = [];
    for (let i in values) {
      arr.push(values[i]);
    }
    arr = arr.filter((item) => {
      return (
        item &&
        item.queryname &&
        item.queryname !== '' &&
        item.queryoperator &&
        item.queryoperator !== '' &&
        item.queryvalue &&
        item.queryvalue !== ''
      );
    });
    search(arr);
  };
  const { LAYOUTMARGIN, LAYOUTPADDING } = useModel('Constant');
  const getCountNode = (key) => {
    return (
      <div key={key} name={key}>
        <Form.Item name={key} label="查询" style={{ display: 'inline-flex', marginBottom: '0px' }}>
          <Input.Group>
            <Form.Item
              name={[key, 'queryname']}
              style={{ display: 'inline-block', width: '150px' }}
            >
              <Select>{ObjectNode}</Select>
            </Form.Item>
            <Form.Item
              name={[key, 'queryoperator']}
              style={{ display: 'inline-block', width: '100px', margin: '0 8px' }}
            >
              <Select>{ConditionNode}</Select>
            </Form.Item>
            <Form.Item
              name={[key, 'queryvalue']}
              style={{ display: 'inline-block', width: '200px' }}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', width: '10px', margin: '0 8px' }}>
              <div
                onClick={() => {
                  setKeyRow(() => {
                    return key;
                  });
                  setSearchRow(() => {
                    return searchRow - 1;
                  });
                }}
              >
                -
              </div>
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </div>
    );
  };
  useEffect(() => {
    setAddedRows(() => {
      if (addedRows[keyRow]) {
        let rowAry = [...addedRows];
        rowAry.splice(keyRow, 1);
        return rowAry;
      } else {
        let rowAry = [];
        for (let i = 0; i < searchRow; i++) {
          rowAry.push(getCountNode(i));
        }
        return rowAry;
      }
    });
  }, [searchRow]);
  return (
    <div style={{ margin: '16px -8px -8px', padding: '16px 16px 0px', backgroundColor: '#fff' }}>
      <Form
        form={form1}
        name="search"
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item name="tem" label="查询" style={{ display: 'inline-flex', marginBottom: '0px' }}>
          <Input.Group compact>
            <Form.Item
              name={['tem', 'queryname']}
              style={{ display: 'inline-block', width: '150px' }}
            >
              <Select>{ObjectNode}</Select>
            </Form.Item>
            <Form.Item
              name={['tem', 'queryoperator']}
              style={{ display: 'inline-block', width: '100px', margin: '0 8px' }}
            >
              <Select>{ConditionNode}</Select>
            </Form.Item>
            <Form.Item
              name={['tem', 'queryvalue']}
              style={{ display: 'inline-block', width: '200px' }}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', width: '10px', margin: '0 8px' }}>
              <div
                onClick={() => {
                  const arr = ObjectNode.filter((item) => item !== undefined);
                  if (searchRow > arr.length - 1 || searchRow == arr.length - 1) {
                    const defaultLoginSuccessMessage = intl.formatMessage({
                      id: 'pages.searchTable.max',
                      defaultMessage: '达到最大数值无法添加！',
                    });
                    message.success(defaultLoginSuccessMessage);
                  } else {
                    setKeyRow(() => {
                      return '';
                    });
                    setSearchRow(() => {
                      return searchRow + 1;
                    });
                  }
                }}
              >
                +
              </div>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item style={{ display: 'inline-block', width: '64px', margin: '0 8px' }}>
          <Button
            type="primary"
            onClick={() => {
              form1.resetFields();
              setSearchRow(() => {
                return 0;
              });
            }}
          >
            重置
          </Button>
        </Form.Item>
        <Form.Item style={{ display: 'inline-block', width: '64px', margin: '0 8px' }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
        {addedRows.map((item) => {
          return item;
        })}
      </Form>
    </div>
  );
};
export default MySearchCondition;
