import ajax from "@/libs/Ajax";

export default {
  queryLogsServ(params) {
    return ajax.get("/logs/LogsServ/queryLogsServ", { params: params });
  },
  queryLogsOperData(params) {
    return ajax.get("/logs/LogsServ/queryLogsOperData", { params: params });
  },
  queryLogsSqlData(params) {
    return ajax.get("/logs/LogsServ/queryLogsSqlData", { params: params });
  },
  SqlFormat(sql) {
    return ajax.get("/logs/LogsServ/SqlFormat", { params: { sql: sql } });
  },
  getLogsServByUuid(uuid) {
    return ajax.get("/logs/LogsServ/getLogsServByUuid", { params: { uuid } });
  }
};
