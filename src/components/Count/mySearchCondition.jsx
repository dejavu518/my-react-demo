import { Button, DatePicker, Input, message, Select, Space } from 'antd';
import React, { useState } from 'react';
import { getIntl, useModel } from 'umi';
import styles from './MySearchCondition.less';

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
  const { search, queryTypes, rangePickerProps } = props;
  const queryLength = queryTypes.length;
  const [searchRow, setSearchRow] = useState(1);
  const [addedRows, setAddedRows] = useState([]);
  const ObjectNode = queryTypes.map((item) => {
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
  });

  const { LAYOUTMARGIN, LAYOUTPADDING } = useModel('Constant');
  const getSearchNode = (key) => {
    return (
      <Space key={key} style={{ padding: '0 12px', marginBottom: '24px' }}>
        <Select
          value={fieldValue}
          labelInValue
          style={{
            width: 120,
          }}
          onChange={(e) => {
            handleFieldChange(e, key);
          }}
        >
          {ObjectNode}
        </Select>
        <Select
          labelInValue
          value={conditionValue}
          style={{
            width: 120,
          }}
          onChange={(e) => {
            handleConditionChange(e, key);
          }}
        >
          {ConditionNode}
        </Select>
        {conditionAry[key - 1]?.value == BETWEEN ? (
          <RangePicker
            {...rangePickerProps}
            onChange={(dates, dateStrs) => {
              handleRangePickerChange(dateStrs, key);
            }}
          />
        ) : (
          <Input
            value={queryValue}
            onInput={(e) => {
              handleInputChange(e, key);
            }}
          />
        )}

        {key == 1 ? (
          <Button onClick={onAddSearchRow} type="">
            +{/* <PlusSquareOutlined /> */}
          </Button>
        ) : (
          ''
        )}
      </Space>
    );
  };
  const onAddSearchRow = (e) => {
    if (searchRow > queryLength - 1) {
      message.warning(`Up to 5 ${queryLength} supported.`);
      return;
    } else {
      setSearchRow(() => {
        return searchRow + 1;
      });
      setAddedRows(() => {
        const rowAry = [];
        for (let i = 1; i < searchRow + 1; i++) {
          rowAry.push(getSearchNode(i + 1));
        }
        return rowAry;
      });
    }
  };

  const [fieldValue, setFieldValue] = useState();
  const [conditionValue, setConditionValue] = useState();
  const [queryValue, setQueryValue] = useState();
  const onReset = (e) => {
    setSearchRow(() => {
      return 1;
    });
    setFieldAry([]);
    setConditionAry([]);
    setValueAry([]);
    setAddedRows(() => {
      return [];
    });
    setFieldValue(null);
    setConditionValue(null);
    setQueryValue(null);
  };
  // let buttonLabel = '展开';
  // const [explanded, setExplanded] = useState(false);
  // const onToggle = (e) => {
  //   if (explanded) {
  //     buttonLabel = '收起';
  //   } else {
  //     buttonLabel = '展开';
  //   }
  //   setExplanded(() => {
  //     return !explanded;
  //   });
  // };

  const [fieldAry, setFieldAry] = useState([]);
  const handleFieldChange = (e, key) => {
    const keysAry = fieldAry.map((item) => {
      if (item) {
        return item.value;
      }
    });
    if (keysAry.includes(e.value)) {
      message.warning('There is same condition field already.');
      return;
    }
    setFieldAry((data) => {
      const copy = [...data];
      copy[key - 1] = e;
      return copy;
    });
    setFieldValue(() => {
      return e.value;
    });
  };

  const [conditionAry, setConditionAry] = useState([]);
  const handleConditionChange = (e, key) => {
    setConditionAry((data) => {
      const copy = [...data];
      copy[key - 1] = e;
      return copy;
    });
    setConditionValue(() => {
      return e.value;
    });
  };

  const [valueAry, setValueAry] = useState([]);
  const handleInputChange = (e, key) => {
    console.log('input change');
    setValueAry((data) => {
      const copy = [...data];
      copy[key - 1] = { value: e.target.value };
      return copy;
    });
    setQueryValue(() => {
      return e.target.value;
    });
  };
  const handleRangePickerChange = (dateStrs, key) => {
    const rangeDateValue = dateStrs.join('|');
    setValueAry((data) => {
      const copy = [...data];
      copy[key - 1] = { value: rangeDateValue };
      return copy;
    });
  };

  const onSearch = () => {
    let maxLength = Math.max(...[fieldAry.length, conditionAry.length, valueAry.length]);
    const queryAry = [];
    for (let i = 0; i < maxLength; i++) {
      fieldAry[i] = fieldAry[i] || {};
      conditionAry[i] = conditionAry[i] || {};
      valueAry[i] = valueAry[i] || {};

      queryAry[i] = {};
      queryAry[i].queryname = fieldAry[i].value;
      queryAry[i].queryoperator = conditionAry[i].value;
      queryAry[i].queryvalue = valueAry[i].value;
    }
    const filteredQueryAry = queryAry.filter((item) => {
      return (
        item.queryname !== undefined &&
        item.queryoperator !== undefined &&
        item.queryvalue !== undefined
      );
    });
    search(filteredQueryAry);
  };

  return (
    <div
      className={styles.MySearchCondition}
      style={{
        margin: `${LAYOUTMARGIN} -8px -8px`,
        padding: `${LAYOUTPADDING} ${LAYOUTPADDING} 0`,
      }}
    >
      <div>
        {Intl.formatMessage({
          id: 'component.myTable.search',
          defaultMessage: '查询',
        })}
        <span>{getSearchNode(1)}</span>
        <Space>
          <Space>
            <Button onClick={onReset} type="">
              重置
            </Button>
            <Button onClick={onSearch} type="primary">
              查询
            </Button>
          </Space>

          {/* <Button onClick={onToggle} type="text">
          {buttonLabel}
        </Button> */}
        </Space>
      </div>
      <div>
        <span>{addedRows}</span>
      </div>
    </div>
  );
};
export default MySearchCondition;
