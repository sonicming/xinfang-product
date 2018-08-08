import querystring from "querystring";
import md5 from "md5";
import createHash from "sha.js";

import ajax from "@/libs/Ajax";

// 密码加密统一算法
function encodePasswd(pwd) {
  var sha256 = createHash("sha256");
  return md5(sha256.update(pwd).digest("hex"));
}

export default {
  /**
   * 用户登录
   * @param userid 用户ID
   * @param passwd 密码
   * @param captcha 验证码
   * @return {Promise}
   */
  login({ userid, passwd, captcha }) {
    passwd = encodePasswd(passwd);
    return ajax.request({
      method: "post",
      url: "/anon/aces/login",
      data: querystring.stringify({ userid, passwd, captcha }),
      headers: { "Content-type": "application/x-www-form-urlencoded" }
    });
  },
  /**
   * 检查这个用户登录状态.
   * @param {String} userid
   */
  logck(userid) {
    return ajax.get("/anon/aces/logck", { params: { userid }, message: false });
  },
  /**
   * 登出
   * @return {Promise}
   */
  logout() {
    return ajax.get("/base/init/logout");
  },
  /**
   * 获取用户登录信息
   * @return {AxiosPromise}
   */
  getLoginInfo() {
    return ajax.get("/base/init/lastLoginInfo");
  },
  /**
   * 获取系统菜单
   */
  getRootMenu() {
    return ajax.get("/sys/init/getRootMenu");
  },

  /**
   * 修改密码
   *  @param {String} oldpasswd
   *  @param {String} passwd
   */
  changePwd(oldpasswd, passwd) {
    passwd = encodePasswd(passwd);
    oldpasswd = encodePasswd(oldpasswd);
    return ajax.post("/base/init/changePwd", { oldpasswd, passwd });
  }
};
