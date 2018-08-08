import ajax from "@/libs/Ajax";

export default {
  /**
   * 获取系统菜单,直接返回菜单数据
   * @param {*} puuid
   */
  getPermByPID(puuid) {
    return ajax
      .get(`/usrm/usr/perm/getPermByPID`, { params: { puuid } })
      .then(data => data || []);
  },

  /**
   * 加载彩单树
   */
  loadPermTree() {
    return ajax.get(`/usrm/usr/perm/loadPermTree`).then(data => data || []);
  },
  /**
   * 保存菜单数据
   * @param {*} resm
   */
  savePerm(resm) {
    return ajax.post(`/usrm/usr/perm/savePerm`, resm);
  },
  /**
   * 删除菜单
   * @param {*} uuid
   */
  deletePerm(uuid) {
    return ajax.delete(`/usrm/usr/perm/deletePerm`, { params: { uuid } });
  },
  /**
   * 自动调整菜单
   */
  autoAligned() {
    return ajax.delete(`/usrm/usr/perm/autoAligned`);
  },
  /**
   * 保存排序
   */
  saveSort(data) {
    return ajax.post(`/usrm/usr/perm/saveSort`, data);
  }
};
