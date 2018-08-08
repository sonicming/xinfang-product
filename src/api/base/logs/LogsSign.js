import ajax from "../../../libs/Ajax";
/**
 * 登录日志管理父页面
 */
export default {
  // 执行查询登录日志请求
  queryLogsSign(params) {
    return ajax.get("/logs/LogsSign/queryLogsSign", { params: params });
  },

  // 执行查询交互日志请求
  queryLogsOper(params) {
    return ajax.get("/logs/LogsSign/queryLogsOper", { params: params });
  },

  // 执行查询服务日志请求
  queryLogsServ(params) {
    return ajax.get("/logs/LogsSign/queryLogsServ", { params: params });
  },
  getLogsSignByUuid(uuid) {
    return ajax.get("/logs/LogsSign/getLogsSignByUuid", { params: { uuid } });
  }
};
