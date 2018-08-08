import ajax from "@/libs/Ajax";

export default {
  // 查询所有字典
  queryCodeByType(codeType) {
    return ajax.get("/sys/code/queryCodeByType", { params: { codeType } });
  },
  // 字典编辑
  saveCode(code) {
    return ajax.post("/sys/code/saveCode", code);
  },
  // 删除
  delCode(uuid) {
    return ajax.delete("/sys/code/delCode", { params: { uuid: uuid } });
  },
  // 获取一条
  getCode(uuid) {
    return ajax.get("/sys/code/getCode", { params: { uuid: uuid } });
  },
  // 获取分组信息
  queryCodeType() {
    return ajax.get("/sys/code/queryCodeType");
  },
  // 保存分组信息
  saveCodeType(codeType) {
    return ajax.post("/sys/code/saveCodeType", codeType);
  },
  // 删除分组信息
  deleteCodeType(uuid) {
    return ajax.delete("/sys/code/deleteCodeType", { params: { uuid } });
  },
  // 搜索字典项
  findCode(keyword) {
    return ajax.get("/sys/code/findCode", { params: { keyword } });
  }
};
