import ajax from "@/libs/Ajax";

export default {
  /**
   * 获取系统菜单,直接返回菜单数据
   * @param {*} id
   */
  getRoleChildren(puuid) {
    return ajax
      .get(`/usrm/usr/role/getRoleByPID`, { params: { puuid } })
      .then(data => data || []);
  },
  // 查询权限
  queryPerm(uuid) {
    return ajax
      .get("/usrm/usr/role/queryPerm", { params: { uuid: uuid } })
      .then(data => {
        return { data };
      });
  },
  /**
   * 保存菜单数据
   * @param {*} puuid
   */
  editRoleNode(role) {
    return ajax.post(`/usrm/usr/role/saveRole`, role);
  },
  /**
   * 复制角色数据
   * @param {*} puuid
   */
  copyRoleNode(role) {
    return ajax.post(`/usrm/usr/role/copyRole`, role);
  },
  /**
   * 保存角色权限表数据
   * @param {*} puuid
   */
  editRolePermNode(role) {
    return ajax.post(`/usrm/usr/role/saveRolePerm`, role);
  },
  /**
   * 删除菜单
   * @param {*} uuid
   */
  delRoleNode(uuid) {
    return ajax.delete(`/usrm/usr/role/deleteRole`, { params: { uuid } });
  },
  /**
   * 加载角色编辑器需要的信息
   * @param {String} uuid
   */
  loadRoleEditInfo(uuid) {
    return ajax.get(`/usrm/usr/role/queryRoleEditInfo`, { params: { uuid } });
  },
  // 获取关区
  getRoleTree(parRoleUuid) {
    return ajax
      .get("/usrm/usr/role/getRoleTree", { params: { parRoleUuid } })
      .then(data => data || []);
  },

  getOrgRoleTree(parRoleUuid) {
    return ajax
      .get("/usrm/usr/role/getOrgRoleTree", { params: { parRoleUuid } })
      .then(data => data || []);
  },
  getCopyRoleTree(orgUuid) {
    return ajax
      .get("/usrm/usr/role/getCopyRoleTree", { params: { orgUuid } })
      .then(data => data || []);
  }
};
