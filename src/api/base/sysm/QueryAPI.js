import ajax from "@/libs/Ajax";

export default {
  /**
   * 加载万能查询初始化信息
   * @param {String} queryName  查询定义名称
   */
  loadQueryInfo(queryName) {
    return ajax.get("/sys/query/loadQueryInfo", { params: { queryName } });
  },
  /**
   * 执行查询
   * @param {Object} params 查询参数
   */
  query(queryName, params) {
    params.queryName = queryName;
    return ajax.get("/sys/query/doQuery", { params });
  }
};
