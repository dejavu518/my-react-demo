/*
 * @Author: WhiteWen 849019060@qq.com
 * @Date: 2022-07-11 15:39:55
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2022-11-02 10:07:26
 * @FilePath: \my-react-demo\src\SchemeForm.jsx
 * @Description: sechma表单的展示(渲染)页面
 *
 */

import {
  ArrayCards,
  ArrayTable,
  Card,
  // Cascader,
  Checkbox,
  // DatePicker,
  Field,
  Form,
  FormCollapse,
  FormGrid,
  // FormLayout
  // FormTab,
  // Input,
  NumberPicker,
  ObjectContainer,
  Password,
  Radio,
  Rate,
  // Select,
  Slider,
  Space,
  Switch,
  Text,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from '@designable/formily-antd';
import { Cascader, FormItem, FormTab, Input, Select, FormLayout, DatePicker } from '@formily/antd';
import { createForm, onFormInit, onFormSubmit, onFormValidateEnd } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import 'antd/dist/antd.less';
import { message } from 'antd';
import { useEffect, useState, useImperativeHandle, memo } from 'react';
import {
  Signature,
  PlanCompleteDate,
} from '@/pages/FormDesigner/components/Pools/componets/AllPool';
import {
  getOrderCFormInfo,
  saveOrderCFormInfo,
  saveWorkOrderFormDetails,
} from '@/services/swagger/eservice';
import { history, useIntl, useModel, useLocation } from 'umi';
import noData from '@/assets/images/noData.png';

// function useAsyncEffect(method, deps) {
//   useEffect(() => {
//     (async () => {
//       await method();
//     })();
//   }, deps);
// }

// 表单中用到的组件
const fieldComponent = {
  Input,
  Select,
  FormItem, // 必须
  FormTab,
  Text,
  Rate,
  Cascader,
  Checkbox,
  DatePicker,
  Field,
  Form,
  FormCollapse,
  FormGrid,
  FormLayout,
  ArrayCards,
  ArrayTable,
  Card,
  Cascader,
  NumberPicker,
  ObjectContainer,
  Password,
  Radio,
  Slider,
  Space,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  Signature,
  PlanCompleteDate,
};

// 表单项组件
const SchemaField = createSchemaField({
  components: fieldComponent,
});

const SchemaForm = (prop) => {
  const [schemaData, setSchemaData] = useState({});
  const intl = useIntl();

  //获取表单数据
  async function getFormData(prop) {
    try {
      let info = {
        template_guid: prop.Template_GUID,
        template_type: prop.step,
      };
      await getOrderCFormInfo(info).then((res) => {
        if (res.success) {
          if (res.data.length > 0) {
            setSchemaData(JSON.parse(res.data[0].Form_Html));
          } else {
            setSchemaData({});
          }
        }

        // const formilys = localStorage.getItem('formily-schema');
        // if (formilys !== undefined && formilys !== null) {
        //   setSchemaData(JSON.parse(localStorage.getItem('formily-schema')));
        // }
      });
    } catch (error) {
      console.log(error);
    }
  }

  useImperativeHandle(prop.submitRef, () => ({
    /*保存表单数据*/
    saveFormData: async (loading, setLoading, otherParam) => {
      await form.validate();

      if (form.valid) {
        const formData = JSON.parse(JSON.stringify(form.values));

        let info = {
          sysrsc_no: 'TREE001',
          menursc_no: 'TREE001_05',
          handlersc_no: 'ACTION001',
          workorder_guid: otherParam.workorder_guid,
          workordertype_guid: otherParam.workordertype_guid,
          template_type: otherParam.template_type,
          template_guid: prop.Template_GUID,
          form_html: JSON.stringify(schemaData),
          field_list: JSON.stringify(formData),
        };
        saveWorkOrderFormDetails(info).then((res) => {
          setLoading({ ...loading, save: false });
          if (res.success) {
            message.success(
              intl.formatMessage({
                id: 'pages.operate.success',
                defaultMessage: '操作成功！',
              }),
            );
          } else {
            message.error(res.message);
          }
        });
      }
    },
    /*获取表单提交数据*/
    getSubmitData: async () => {
      await form.validate();

      if (form.valid) {
        const formData = JSON.parse(JSON.stringify(form.values));
        return {
          form_html: JSON.stringify(schemaData),
          field_list: JSON.stringify(formData),
        };
      } else {
        return false;
      }
    },
    /*追加表单内容*/
    additionalForm: (obj) => {
      setSchemaData(() => {
        let form = schemaData.form;
        let newobj = {
          form: form,
          schema: {
            type: schemaData.schema.type,
            'x-designable-id': schemaData.schema['x-designable-id'],
            properties: {
              ...schemaData.schema.properties,
              ...obj,
            },
          },
        };

        return newobj;
      });
    },
  }));

  const form = createForm({
    effects() {
      onFormValidateEnd(() => {
        // console.log(form.valid);
      });
      onFormSubmit((form) => {
        // const formData = JSON.parse(JSON.stringify(form.values));
      });
      onFormInit((form) => {
        //表单赋值
        if (prop.setFormData) {
          form.setInitialValues(prop.setFormData);
        }
      });
    },
    ...schemaData.form,
  });

  // 表单项的json数据
  const schema = schemaData.schema;

  useEffect(() => {
    getFormData(prop);
  }, [prop]);

  return (
    <>
      <FormProvider form={form}>
        <FormLayout labelCol={6} wrapperCol={10} style={{ marginTop: '32px' }}>
          <SchemaField schema={schema} />
          {/* <FormItem>
            <button
              onClick={() => {
                form.submit();
              }}
            >
              Submit
            </button>
          </FormItem> */}
        </FormLayout>
      </FormProvider>

      {(schema === undefined || JSON.stringify(schema.properties) === '{}') && (
        <div style={{ textAlign: 'center' }}>
          <img src={noData} />
          <p>
            {intl.formatMessage({
              id: 'component.noticeIcon.empty',
              defaultMessage: '暂无数据',
            })}
          </p>
        </div>
      )}
    </>
  );
};

export default memo(SchemaForm);
