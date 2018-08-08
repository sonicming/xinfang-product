import ajax from "@/libs/Ajax";

export default {
  // 查询所有用户
  queryUser(params) {
    return ajax.get("/usr/user/queryUsers", { params: params });
  },
  // 查询一条用户
  getUser(uuid) {
    return ajax
      .get("/usr/user/getUser", { params: { uuid: uuid } })
      .then(data => {
        return { data };
      });
  },
  // 用户编辑
  userEdit(user) {
    return ajax.post("/usr/user/userEdit", user);
  },
  // 用户新建
  saveUser(user) {
    return ajax.post("/usr/user/userSave", user);
  },
  // 用户注销
  shutUser(params) {
    return ajax.post("/usr/user/shutUser", params);
  },
  // 用户锁定
  lockUser(params) {
    return ajax.post("/usr/user/lockUser", params);
  },
  // 用户解锁
  openUser(params) {
    return ajax.post("/usr/user/openUser", params);
  },
  // 重置
  userPWReSet(uuid) {
    return ajax.delete("/usr/user/userPWReSet", { params: { uuids: uuid } });
  },
  // 修改密码
  resetPwd(params) {
    return ajax.post("/usr/user/resetPwd", params);
  },
  // 查询所有用户
  getRoleUserByOrgId(params) {
    return ajax.get("/usr/user/getRoleUserByOrgId", { params: params });
  },
  // 获取用户信息,公共组件使用
  getUserInfo(uuid) {
    return ajax.get("/usr/user/getUserInfo", { params: { uuid } });
  },
  //批量解锁或锁定用户
  lockAndOpenUsers(data) {
    return ajax.post("/usr/user/lockAndOpenUsers", data);
  },
  //获取用户操作时间轴
  getTimeLine(data) {
    return ajax.get("/usr/user/getTimeLine", { params: data });
  },
  //批量重置用户密码
  resetUserPw(data) {
    return ajax.post("/usr/user/resetUserPw", data);
  }
};
