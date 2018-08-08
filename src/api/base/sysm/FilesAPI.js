import ajax from "@/libs/Ajax";

export default {
  /**
   * 加载文件数据
   * @param {String} uuid
   */
  list(params) {
    return ajax.get("/sys/file/list", { params: params });
  },
  /**
   * 加载文件数据分页数据
   * @param {String} uuid
   */
  selectResource(params) {
    return ajax.get("/resource/ResourceManager", { params: params });
  },
  /**
   * 删除
   * @param {String} uuid
   */
  delete(uuid) {
    return ajax.delete("/sys/file/delete", { params: { uuid: uuid } });
  },
  /**
   * 使用文件
   * @param {String} uuid
   */
  use(uuid) {
    return ajax.delete("/sys/file/use", { params: { uuid: uuid } });
  },
  /**
   * 生效一批数据
   * @param {String} uuid
   */
  useAll(uuid) {
    return ajax.delete("/sys/file/useAll", { params: { uuid: uuid } });
  }
};
