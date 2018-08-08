import ajax from "@/libs/Ajax";

export default {
  // 查询
  queryPara(params) {
    return ajax.get(`/sys/para/queryPara`, { params });
  },
  // 保存客户端数据
  savePara(data) {
    return ajax.post(`/sys/para/savePara`, data);
  },
  // //查询一条数据
  getPara(uuid) {
    return ajax.get(`/sys/para/getPara`, { params: { uuid } });
  },
  // 保存客户端数据
  delPara(uuid) {
    return ajax.delete(`/sys/para/delPara`, { params: { uuid } });
  }
};
