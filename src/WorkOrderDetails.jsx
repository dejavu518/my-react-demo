/*
 * @Author: liaoyh liaoyh@gl.com
 * @Date: 2022-10-13 17:09:34
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2022-11-02 14:46:30
 * @FilePath: \my-react-demo\src\WorkOrderDetails.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// @全部工单-详情
import {
  getWorkOrderHistoryBaseInfo,
  getWorkOrderDetails,
  transferWorkOrder,
  backWorkOrder,
  changePlan,
} from '@/services/swagger/eservice';
import { getCommonUserList } from '@/services/swagger/user';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Col,
  Descriptions,
  Row,
  Tabs,
  Timeline,
  Form,
  Input,
  Button,
  Steps,
  Modal,
  Select,
  message,
  DatePicker,
} from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import SchemaForm from '@/pages/SchemaForm';
import Edit from './components/Edit';
import Completed from './components/Completed';
import Accepted from './components/Accepted';
const Detail = (props) => {
  const intl = useIntl();
  const [basicInfo, setBasicInfo] = useState({});
  const [orderDetail, setOrderDetail] = useState({});
  const [stepCurrent, setStepCurrent] = useState(0);
  const [transferVisible, setTransferVisible] = useState(false);
  const [backVisible, setBackVisible] = useState(false);
  const [changePlanVisible, setChangePlanVisible] = useState(false);

  const [newHandlerList, setNewHandlerList] = useState([]);
  const [editD, setEditD] = useState({
    open: false,
    type: props.location.query.type,
  });
  const [completeD, setCompleteD] = useState({
    open: false,
    type: props.location.query.type,
  });
  const [acceptD, setAcceptD] = useState({
    open: false,
    type: props.location.query.type,
  });
  const Query = props.location.query;
  const [transferForm] = Form.useForm();
  const [backForm] = Form.useForm();
  const [changeForm] = Form.useForm();
  const { Step } = Steps;
  const tab = (v) => {
    if (v === 1) {
      return (
        <div style={{ width: '80px', textAlign: 'center' }}>
          {intl.formatMessage({ id: 'pages.eservice.workOrderInfo', defaultMessage: '工单信息' })}
        </div>
      );
    } else if (v === 2) {
      return (
        <div style={{ width: '80px', textAlign: 'center' }}>
          {intl.formatMessage({
            id: 'pages.eservice.workOrderProgress',
            defaultMessage: '工单进度',
          })}
        </div>
      );
    }
  };
  // 获取新处理人
  function getNewHandlerList() {
    let info = {
      type: -1,
    };
    getCommonUserList(info).then((res) => {
      if (res.success) {
        setNewHandlerList(res.data);
      }
    });
  }
  //获取基本信息
  function getBaseInfo() {
    let info = {
      workorder_guid: Query.workorder_guid,
    };
    getWorkOrderHistoryBaseInfo(info).then((res) => {
      if (res.success) {
        setBasicInfo(res.data[0]);
      }
    });
  }

  //获取工单详情
  function getODetail() {
    let info = {
      workorder_guid: Query.workorder_guid,
      template_guid: Query.template_guid,
      template_type: Query.template_type,
    };
    getWorkOrderDetails(info).then((res) => {
      if (res.success) {
        setOrderDetail(res.data[0]);
      }
    });
  }

  //工单类型
  function transformAttr(attr) {
    if (attr) {
      return attr.trim() === 'N'
        ? 'N/A'
        : attr.trim() === 'S'
        ? intl.formatMessage({
            id: 'pages.eservice.plat',
            defaultMessage: '平台',
          })
        : attr.trim() === 'P'
        ? intl.formatMessage({
            id: 'pages.eservice.project',
            defaultMessage: '项目',
          })
        : '';
    }
  }
  // 保存转办工单
  function onSaveTransfer() {
    transferForm.validateFields().then((values) => {
      let info = {
        sysrsc_no: 'TREE001',
        menursc_no: 'TREE001_06',
        handlersc_no: 'ACTION009',
        workorder_guid: Query.workorder_guid,
        new_accept_by: values.new_handler,
        complaint_reason: values.reason,
      };
      transferWorkOrder(info).then((res) => {
        if (res.success) {
          setTransferVisible(false);
          message.success(
            intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功' }),
          );
        }
      });
    });
  }
  // 保存退回工单
  function onSaveBack() {
    backForm.validateFields().then((values) => {
      let info = {
        sysrsc_no: 'TREE001',
        menursc_no: 'TREE001_06',
        handlersc_no: 'ACTION011',
        workorder_guid: Query.workorder_guid,
        back_reason: values.back_reason,
        main_email: values.main_obj.join(';'),
        cc_email: values.cc_obj,
      };
      backWorkOrder(info).then((res) => {
        if (res.success) {
          setBackVisible(false);
          message.success(
            intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功' }),
          );
        }
      });
    });
  }
  // 保存变更计划
  function onSaveChangePlan() {
    changeForm.validateFields().then((values) => {
      let info = {
        sysrsc_no: 'TREE001',
        menursc_no: 'TREE001_06',
        handlersc_no: 'ACTION007',
        workorder_guid: Query.workorder_guid,
        plancomplete_date: values.plan_date,
        plancomplete_na: '1',
        change_reason: values.change_reason,
      };
      changePlan(info).then((res) => {
        if (res.success) {
          setChangePlanVisible(false);
          message.success(
            intl.formatMessage({ id: 'pages.operate.success', defaultMessage: '操作成功' }),
          );
        }
      });
    });
  }
  useEffect(() => {
    getBaseInfo();
    getODetail();
  }, []);

  return (
    <>
      <PageContainer
        subTitle={
          Query.source === 'new-workorder' ? (
            <span
              style={{
                fontSize: '16px',
                color: Query.type === '3' ? '#c0c0c0' : '#ff4d4f',
                fontWeight: 'bold',
              }}
            >
              (
              {Query.type === '0'
                ? intl.formatMessage({ id: 'pages.eservice.pending', defaultMessage: '待受理' })
                : Query.type === '1'
                ? intl.formatMessage({ id: 'pages.eservice.processing', defaultMessage: '处理中' })
                : Query.type === '2'
                ? intl.formatMessage({ id: 'pages.eservice.completed', defaultMessage: '已完成' })
                : Query.type === '3'
                ? intl.formatMessage({ id: 'pages.eservice.returned', defaultMessage: '已退回' })
                : ''}
              )
            </span>
          ) : null
        }
        extra={
          Query.source === 'new-workorder' ? (
            <>
              <Button style={{ display: Query.type !== '3' ? 'block' : 'none' }}>
                {intl.formatMessage({ id: 'pages.usermanage.invalidate', defaultMessage: '无效' })}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setEditD({
                    ...editD,
                    open: true,
                  });
                }}
              >
                {intl.formatMessage({ id: 'pages.edit', defaultMessage: '编辑' })}
              </Button>
            </>
          ) : Query.source === 'pending' ? (
            <>
              <Button
                onClick={() => {
                  getNewHandlerList();
                  setBackVisible(true);
                }}
              >
                {intl.formatMessage({ id: 'pages.eservice.sendBack', defaultMessage: '退回' })}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setTransferVisible(true);
                  getNewHandlerList();
                }}
              >
                {intl.formatMessage({ id: 'pages.eservice.Transfer', defaultMessage: '转办' })}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setAcceptD({
                    ...acceptD,
                    open: true,
                  });
                }}
              >
                {intl.formatMessage({ id: 'pages.eservice.acceptance', defaultMessage: '受理' })}
              </Button>
            </>
          ) : Query.source === 'processing' ? (
            <>
              <Button
                onClick={() => {
                  setBackVisible(true);
                }}
              >
                {intl.formatMessage({ id: 'pages.eservice.sendBack', defaultMessage: '退回' })}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setChangePlanVisible(true);
                }}
              >
                {intl.formatMessage({
                  id: '888',
                  defaultMessage: '变更计划',
                })}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setTransferVisible(true);
                  getNewHandlerList();
                }}
              >
                {intl.formatMessage({ id: 'pages.eservice.Transfer', defaultMessage: '转办' })}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setCompleteD({
                    ...completeD,
                    open: true,
                  });
                }}
              >
                {intl.formatMessage({ id: '888', defaultMessage: '完成' })}
              </Button>
            </>
          ) : (
            <>
              <a> {intl.formatMessage({ id: '888', defaultMessage: '回执邮件' })}</a>
              <Button
                onClick={() => {
                  setBackVisible(true);
                }}
              >
                {intl.formatMessage({ id: '888', defaultMessage: '签章痕迹' })}
              </Button>
              <Button type="primary">
                {intl.formatMessage({ id: '888', defaultMessage: '编辑签章' })}
              </Button>
              <Button type="primary">
                {intl.formatMessage({ id: '888', defaultMessage: '下载回执' })}
              </Button>
            </>
          )
        }
      />
      {/* 编辑弹窗 */}
      <Edit
        editD={editD}
        setEditD={setEditD}
        orderDetail={orderDetail}
        Template_GUID={Query.template_guid}
        otherParam={{
          workorder_guid: Query.workorder_guid,
          workordertype_guid: Query.workordertype_guid,
          type: Query.type,
          template_type: Query.template_type,
        }}
      />
      {/* 完成弹窗 */}
      <Completed
        completeD={completeD}
        setCompleteD={setCompleteD}
        orderDetail={orderDetail}
        Template_GUID={Query.template_guid}
        otherParam={{
          workorder_guid: Query.workorder_guid,
          workordertype_guid: Query.workordertype_guid,
          type: Query.type,
          template_type: Query.template_type,
        }}
      />
      {/* 受理弹窗 */}
      <Accepted
        acceptD={acceptD}
        setAcceptD={setAcceptD}
        orderDetail={orderDetail}
        Template_GUID={Query.template_guid}
        otherParam={{
          workorder_guid: Query.workorder_guid,
          workordertype_guid: Query.workordertype_guid,
          type: Query.template_type,
          Template_GUID: Query.template_guid,
          template_type: Query.template_type,
        }}
      />
      {/* 转办工单弹窗 */}
      <Modal
        visible={transferVisible}
        maskClosable={false}
        destroyOnClose
        width={392}
        title={intl.formatMessage({
          id: 'pages.eservice.transferWorkOrder',
          defaultMessage: '转办工单',
        })}
        onOk={() => {
          onSaveTransfer();
        }}
        onCancel={() => {
          setTransferVisible(false);
        }}
      >
        <Form labelCol={{ span: 24 }} form={transferForm}>
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.personnelManagement.newHandler',
              defaultMessage: '新处理人',
            })}
            name="new_handler"
            rules={[{ required: true }]}
          >
            <Select
              showArrow
              placeholder={intl.formatMessage({
                id: 'pages.pleaseInput',
                defaultMessage: '请输入',
              })}
            >
              {newHandlerList.map((item) => {
                return (
                  <Select.Option key={item.User_GUID} value={item.User_GUID}>
                    {item.User_FullName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="reason"
            label={intl.formatMessage({
              id: 'pages.eservice.transfer.reason',
              defaultMessage: '转办原因',
            })}
          >
            <Input.TextArea
              placeholder={intl.formatMessage({
                id: 'pages.pleaseInput',
                defaultMessage: '请输入',
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* 退回工单弹窗 */}
      <Modal
        visible={backVisible}
        maskClosable={false}
        destroyOnClose
        width={784}
        title={intl.formatMessage({
          id: 'pages.eservice.backWorkOrder',
          defaultMessage: '退回工单',
        })}
        onCancel={() => {
          setBackVisible(false);
        }}
        onOk={() => {
          onSaveBack();
        }}
      >
        <Form labelCol={{ span: 24 }} form={backForm}>
          <p style={{ color: '#fb5531' }}>
            提示：退回工单会使工单的当前状态变更为“已退回”状态，可在全部工单中查看
          </p>
          <Form.Item
            rules={[{ required: true }]}
            name="back_reason"
            label={intl.formatMessage({
              id: 'pages.eservice.back.reason',
              defaultMessage: '退回原因',
            })}
          >
            <Input.TextArea
              placeholder={intl.formatMessage({
                id: 'pages.pleaseInput',
                defaultMessage: '请输入',
              })}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.notice.mainObj',
              defaultMessage: '主送对象',
            })}
            name="main_obj"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              showArrow
              placeholder={intl.formatMessage({
                id: 'pages.pleaseInput',
                defaultMessage: '请输入',
              })}
            >
              {newHandlerList.map((item) => {
                return (
                  <Select.Option key={item.User_GUID} value={item.User_GUID}>
                    {item.User_Email}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="cc_obj"
            label={intl.formatMessage({
              id: 'pages.notice.ccObj',
              defaultMessage: '抄送对象',
            })}
          >
            <Input.TextArea
              placeholder={intl.formatMessage({
                id: 'pages.pleaseInput',
                defaultMessage: '请输入',
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* 变更计划弹窗 */}
      <Modal
        visible={changePlanVisible}
        maskClosable={false}
        destroyOnClose
        width={392}
        title={intl.formatMessage({
          id: '888',
          defaultMessage: '变更计划',
        })}
        onOk={() => {
          onSaveChangePlan();
        }}
        onCancel={() => {
          setChangePlanVisible(false);
        }}
      >
        <Form labelCol={{ span: 24 }} form={changeForm}>
          <Form.Item
            label={intl.formatMessage({
              id: '888',
              defaultMessage: '计划完成日期',
            })}
            name="plan_date"
            rules={[{ required: true }]}
          >
            <DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="reason"
            label={intl.formatMessage({
              id: '888',
              defaultMessage: '变更原因',
            })}
          >
            <Input.TextArea
              placeholder={intl.formatMessage({
                id: 'pages.pleaseInput',
                defaultMessage: '请输入',
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
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
              <span
                className="line"
                style={{
                  display: 'inline-block',
                  width: '4px',
                  height: '16px',
                  marginRight: '5px',
                  background: '#21bb7e',
                }}
              />
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {intl.formatMessage({
                  id: 'pages.searchTable.updateForm.basicConfig',
                  defaultMessage: '基本信息',
                })}
              </span>
            </div>
            <Descriptions
              column={1}
              style={{ marginTop: '16px' }}
              contentStyle={{ fontSize: '12px' }}
              labelStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            >
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.workOrderNo',
                  defaultMessage: '工单编号',
                })}
              >
                {basicInfo.WorkOrder_No}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.workOrderName',
                  defaultMessage: '工单名称',
                })}
              >
                {basicInfo.WorkOrder_Name}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.workOrderType',
                  defaultMessage: '工单类型',
                })}
              >
                {transformAttr(basicInfo.WorkOrder_Attribute)}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.platformID',
                  defaultMessage: '平台ID',
                })}
              >
                {basicInfo.Customer_No}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.platformName',
                  defaultMessage: '平台名称',
                })}
              >
                {basicInfo.Customer_Name}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.databaseID',
                  defaultMessage: '数据库ID',
                })}
              >
                {basicInfo.Database_ID}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.projectName',
                  defaultMessage: '项目名称',
                })}
              >
                {basicInfo.Project_Name}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.initiator',
                  defaultMessage: '发起人',
                })}
              >
                {basicInfo.Sponsor_By}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.submitter',
                  defaultMessage: '提交人',
                })}
              >
                {basicInfo.Create_By_Name}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.handler',
                  defaultMessage: '处理人',
                })}
              >
                {basicInfo.Accept_By}
              </Descriptions.Item>
              <Descriptions.Item
                label={intl.formatMessage({
                  id: 'pages.eservice.submitTime',
                  defaultMessage: '提交时间',
                })}
              >
                {Query.type === '0'
                  ? basicInfo.Update_Time
                  : Query.type === '1'
                  ? basicInfo.Change_Time
                  : Query.type === '2'
                  ? basicInfo.Complete_Time
                  : Query.type === '3'
                  ? basicInfo.Back_Time
                  : ''}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Col>
        <Col className="gutter-row" span={19}>
          <div style={{ background: '#fff', minHeight: '780px', padding: '16px' }}>
            <Tabs>
              <Tabs.TabPane tab={tab(1)} key="1">
                <Row>
                  <Col
                    span={5}
                    style={{
                      // width: '150px',
                      height: '150px',
                      background: '#f8f8f8',
                      padding: '16px',
                      display: 'inline-block',
                    }}
                  >
                    {/* <Timeline>
                      <Timeline.Item>1.请求</Timeline.Item>
                      <Timeline.Item>2.受理</Timeline.Item>
                      <Timeline.Item>3.完成</Timeline.Item>
                    </Timeline> */}
                    <Steps progressDot current={stepCurrent} direction="vertical">
                      <Step
                        title={
                          <span style={{ color: stepCurrent === 0 ? 'rgb(33, 187, 126)' : '' }}>
                            {'1.' +
                              intl.formatMessage({
                                id: 'pages.eservice.onrequest',
                                defaultMessage: '请求',
                              })}
                          </span>
                        }
                      />
                      <Step
                        title={
                          <span style={{ color: stepCurrent === 1 ? 'rgb(33, 187, 126)' : '' }}>
                            {'2.' +
                              intl.formatMessage({
                                id: 'pages.eservice.received',
                                defaultMessage: '受理',
                              })}
                          </span>
                        }
                      />
                      <Step
                        title={
                          <span style={{ color: stepCurrent === 2 ? 'rgb(33, 187, 126)' : '' }}>
                            {'3.' +
                              intl.formatMessage({
                                id: 'pages.eservice.finished',
                                defaultMessage: '完成',
                              })}
                          </span>
                        }
                      />
                    </Steps>
                  </Col>
                  <Col
                    span={18}
                    style={{
                      display: 'inline-block',
                      // width: '85%',
                      height: '600px',
                      overflowY: 'auto',
                      border: '1px solid #999',
                      marginLeft: '16px',
                      padding: '32px',
                    }}
                  >
                    <SchemaForm
                      step={Query.type}
                      Template_GUID={Query.template_guid}
                      setFormData={orderDetail}
                    />
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab={tab(2)} key="2">
                <Timeline>
                  <Timeline.Item>
                    <p>
                      <b>完成工单</b>&nbsp;&nbsp;<span>2022-06-16 17:15</span>
                    </p>
                    <div style={{ border: '1px solid #ECECEC' }}>
                      <p style={{ padding: '8px', marginBottom: '0', fontSize: '12px' }}>
                        工单编号为20220623005的【平台基础信息维护】工单已完成处理
                        ，反馈说明：这是一条文案。这是一条文案。这是一条文案。这是一条文案。已为客户【云南白药】发送回执单：
                      </p>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                  <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                  <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                </Timeline>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Detail;
