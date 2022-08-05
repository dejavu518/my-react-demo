/*
 * @Author: WhiteWen 849019060@qq.com
 * @Date: 2022-07-14 16:28:55
 * @LastEditors: WhiteWen 849019060@qq.com
 * @LastEditTime: 2022-07-14 16:38:54
 * @FilePath: \BM.Web.CIMS\src\services\swagger\eservice.js
 * @Description: eService 接口文件
 *
 */

import { request } from 'umi';

/**
 * @description: 保存工单类型
 * @param {*} data
 * @param {*} options
 * @return {*}
 */
export async function saveWorkOrderType(data, options) {
  return request('/eserviceapi/workordertype/saveWorkOrderType', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/**
 * @description: 修订订单类型状态
 * @param {*} data
 * @param {*} options
 * @return {*}
 */
export async function saveWorkOrderTypeStatus(data, options) {
  return request('/eserviceapi/workordertype/changeWorkOrderTypeStatus', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/**
 * @description: 工单类型列表
 * @param {*} params
 * @param {*} options
 * @return {*} Promise
 */
export async function getWorkOrderList(params, options) {
  return request('/eserviceapi/workordertype/workOrderTypeList', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/**
 * @description: 获取工单类型信息
 * @param {*} params
 * @param {*} options
 * @return {*} Promise
 */
export async function getWorkOrderInfo(params, options) {
  return request('/eserviceapi/workordertype/workOrderTypeInfo', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/**
 * @description: 工单模板列表
 * @param {*} params
 * @param {*} options
 * @return {*} Promise
 */
export async function getWorkOrderTemplateList(params, options) {
  return request('/eserviceapi/workordertype/workOrderTemplateList', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/**
 * @description: 保存工单模板信息
 * @param {*} data
 * @param {*} options
 * @return {*}
 */
export async function saveWorkOrderTemplate(data, options) {
  return request('/eserviceapi/workordertype/saveWorkOrderTemplate', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
/** 修改工单模板状态 /workordertype/changeStatus*/
export async function updateTemplateStatus(params, options) {
  return request('/eserviceapi/workordertype/updateTemplateStatus', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

/** 批量修改工单模板状态 /workordertype/batchUpdateTemplateStatus*/
export async function batchUpdateTemplateStatus(params, options) {
  return request('/eserviceapi/workordertype/batchUpdateTemplateStatus', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

/** 发布工单模板 /workordertype/publishworkordertype*/
export async function publishTemplate(params, options) {
  return request('/eserviceapi/workordertype/publishworkordertype', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

/** 批量工单模板状态 /workordertype/batchPublishworktype*/
export async function batchPublishTemplate(params, options) {
  return request('/eserviceapi/workordertype/batchPublishworkordertype', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

/** 获取工单模板信息 /workordertype/workOrderTemplate*/
export async function getTemplateDetail(params, options) {
  return request('/eserviceapi/workordertype/workOrderTemplate', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
// ######### 人员管理 ##########
/** 人员管理列表 /teamuser/userList*/
export async function getTeamUserList(params, options) {
  return request('/eserviceapi/teamuser/userList', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 获取人员基本信息 /teamuser/userTeamInfo*/
export async function getUserTeamInfo(params, options) {
  return request('/eserviceapi/teamuser/userTeamInfo', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 获取变更团队列表 /teamuser/changeteamList*/
export async function getChangeTeamList(params, options) {
  return request('/eserviceapi/teamuser/changeteamList', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 更改团队 /teamuser/changeTeam*/
export async function changeTeam(params, options) {
  return request('/eserviceapi/teamuser/changeTeam', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}
/** 获取变更责任人列表 /teamuser/principalList*/
export async function getPrincipalList(params, options) {
  return request('/eserviceapi/teamuser/principalList', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 移除人员信息 /teamuser/removeTeamUserInfo*/
export async function removeTeamUser(params, options) {
  return request('/eserviceapi/teamuser/removeTeamUserInfo', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

/** 获取团队维护列表 /teamuser/teamList*/
export async function getTeamList(params, options) {
  return request('/eserviceapi/teamuser/teamList', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/**  保存团队信息 /teamuser/saveTeam*/
export async function saveTeam(data, options) {
  return request('/eserviceapi/teamuser/saveTeam', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
/** 修改团队状态*/
export async function changeTeamStatus(params, options) {
  return request('/eserviceapi/teamuser/changeTeamStatus', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}
/** 批量修改团队状态*/
export async function batchChangeTeamStatus(params, options) {
  return request('/eserviceapi/teamuser/batchChangeTeamStatus', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}
/** 获取团队信息*/
export async function getTeamInfo(params, options) {
  return request('/eserviceapi/teamuser/teamInfo', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 导出团队信息*/
export async function exportTeamExcel(params, options) {
  return request('/eserviceapi/teamuser/exportExcel', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 获取组织职位信息 /teamuser/positionTreeInfo*/
export async function getPositionTree(params, options) {
  return request('/eserviceapi/teamuser/positionTreeInfo', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
