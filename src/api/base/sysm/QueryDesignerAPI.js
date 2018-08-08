import ajax from "@/libs/Ajax";

export default {
  /**
   *
   * @param {*} data
   */
  loadDesignList(params) {
    return ajax.get("/queryDesigner/loadDesignList", { params });
  },
  /**
   * 查询定义的大纲
   */
  loadDesignMine(params) {
    return ajax.get("/queryDesigner/loadDesignMine");
  },

  /**
   * 获取系统可用的表
   */
  loadAllTable() {
    return ajax.get("/queryDesigner/loadAllTable");
  },
  /**
   * 获取表信息
   * @param {String} tableName
   */
  loadTableInfo(tableName) {
    return ajax.get("/queryDesigner/loadTableInfo", { params: { tableName } });
  },
  /**
   * 保存设计信息
   * @param {Object} data
   */
  saveDesign(data) {
    return ajax.post("/queryDesigner/saveDesign", data);
  },

  /**
   * 服务器端测试运行结果
   * @param {Object} data  同 saveDesign
   */
  debugDesign(data) {
    return ajax.post("/queryDesigner/debugDesign", data);
  },
  /**
   * 删除
   * @param {String} uuid
   */
  deleteDesign(uuid) {
    return ajax.delete("/queryDesigner/deleteDesign", { params: { uuid } });
  },
  /**
   * 加载设计信息
   * @param {String} uuid 要加载的信息
   */
  loadDesign(uuid) {
    return ajax.get("/queryDesigner/loadDesign", { params: { uuid } });
  }
};
