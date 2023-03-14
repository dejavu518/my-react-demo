/*
 * @Author: liaoyh liaoyh@gl.com
 * @Date: 2022-10-26 16:37:45
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2023-03-14 14:06:19
 * @FilePath: \my-react-demo\src\消息通知.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Modal, Button, Descriptions, Tabs } from 'antd';
import { useIntl } from 'umi';
import { useEffect, useState, useRef } from 'react';
import SchemaForm from '@/pages/SchemaForm';

const Details = (props) => {
  const intl = useIntl();
  const submitRef = useRef();
  const [loading, setLoading] = useState({
    save: false,
  });

  return (
    <Modal
      visible={props.detailsOpen}
      onCancel={() => {
        props.setDetailsOpen(false);
      }}
      footer={null}
      width={800}
      title={intl.formatMessage({
        id: 'pages.notifyDetail',
        defaultMessage: '消息详情',
      })}
    >
      <Descriptions
        column={1}
        contentStyle={{ fontSize: '12px' }}
        labelStyle={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        <Descriptions.Item
          label={
            props.IsSystem === 1
              ? intl.formatMessage({
                  id: 'pages.notice.systemNoticeSubject',
                  defaultMessage: '系统通告主题',
                })
              : intl.formatMessage({ id: 'pages.subject', defaultMessage: '主题' })
          }
        >
          {props.IsSystem === 1 ? props.basicInfo.Template_Subject : props.basicInfo.Notice_Subject}
        </Descriptions.Item>
        {props.IsSystem === 1 && (
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.sysParams.notice.instruction',
              defaultMessage: '详细说明',
            })}
          >
            {props.basicInfo.Template_Detailes}
          </Descriptions.Item>
        )}
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.notice.sendTime',
            defaultMessage: '发送时间',
          })}
        >
          {props.basicInfo.Send_Time}
        </Descriptions.Item>
      </Descriptions>

      {/* 内容 */}
      <b style={{ marginBottom: '8px', display: 'block' }}>
        {intl.formatMessage({
          id: 'pages.notice.content',
          defaultMessage: '内容',
        })}
      </b>

      {/* 邮件 */}
      <Tabs defaultActiveKey="1">
        {props.emailArea && (
          <Tabs.TabPane tab="邮件" key="1">
            <Tabs type="card">
              <Tabs.TabPane
                tab={intl.formatMessage({
                  id: 'pages.notice.Chinese',
                  defaultMessage: '中文',
                })}
                key="1"
              >
                <div
                  style={{
                    width: '750px',
                    minHeight: '240px',
                    border: '1px solid #ececec',
                    marginTop: '-17px',
                    padding: '16px',
                  }}
                  dangerouslySetInnerHTML={{ __html: props.emailChinese }}
                >
                  {/* {props.IsSystem === 1 ? props.emailChinese : null} */}
                </div>
              </Tabs.TabPane>
              {props.IsSystem === 0 && (
                <Tabs.TabPane tab="English" key="2">
                  <div
                    style={{
                      width: '750px',
                      minHeight: '240px',
                      border: '1px solid #ececec',
                      marginTop: '-17px',
                      padding: '16px',
                    }}
                    dangerouslySetInnerHTML={{ __html: props.emailEnglish }}
                  ></div>
                </Tabs.TabPane>
              )}
            </Tabs>
          </Tabs.TabPane>
        )}

        {/* 系统 */}
        {props.systemArea && (
          <Tabs.TabPane tab="系统" key="2">
            <Tabs type="card">
              <Tabs.TabPane
                tab={intl.formatMessage({
                  id: 'pages.notice.Chinese',
                  defaultMessage: '中文',
                })}
                key="1"
              >
                <div
                  style={{
                    width: '750px',
                    minHeight: '240px',
                    border: '1px solid #ececec',
                    marginTop: '-17px',
                    padding: '16px',
                  }}
                  dangerouslySetInnerHTML={{ __html: props.systemChinese }}
                >
                  {/* {props.IsSystem === 1 ? props.systemChinese : null} */}
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="English" key="2">
                <div
                  style={{
                    width: '750px',
                    minHeight: '240px',
                    border: '1px solid #ececec',
                    marginTop: '-17px',
                    padding: '16px',
                  }}
                  dangerouslySetInnerHTML={{ __html: props.systemEnglish }}
                >
                  {/* {props.IsSystem === 1 ? props.systemEnglish : null} */}
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Tabs.TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

export default Details;
