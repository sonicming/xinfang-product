import ajax from "@/libs/Ajax";

// 后台命名空间
const NAME_SPACE = "/usrm/usr/org";

/**
 * 组织机构API
 */
export default {
  // 查询子节点数据
  getChildren(puuid) {
    return ajax
      .get(`${NAME_SPACE}/getChildren`, { params: { puuid } })
      .then(data => data || []);
  },
  // 编辑节点
  editNode(resm) {
    return ajax.post(`${NAME_SPACE}/editNode`, resm);
  },
  // 删除节点
  delNode(uuid) {
    return ajax.delete(`${NAME_SPACE}/delNode`, { params: { uuid } });
  },
  // 检查节点
  checkNode(uuid) {
    return ajax.put(`${NAME_SPACE}/checkNode`, { params: { uuid } });
  },
  // 修复节点异常
  repairNode(uuid) {
    return ajax.put(`${NAME_SPACE}/repairLRNode`, { params: { uuid } });
  }
};
