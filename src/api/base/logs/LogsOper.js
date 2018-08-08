import ajax from "../../../libs/Ajax";

export default {
  queryLogsOper(params) {
    return ajax.get("/logs/LogsOper/queryLogsOper", { params: params });
  },
  queryLogsOperData(params) {
    return ajax.get("/logs/LogsOper/queryLogsOperData", { params: params });
  },
  /**
   * 查询指定业务数据的数据操作历史.
   * @param {Object} params 要查询记录的业务数据主键,以及其他分页参数,不支持模糊搜索
   */
  queryQueryDataHis(params) {
    return ajax.get("/logs/LogsSqlData/dataHandleHis", { params: params });
  },
  getLogsOperByUuid(uuid) {
    return ajax.get("/logs/LogsOper/getLogsOperByUuid", { params: { uuid } });
  }
};
