import Vue from "vue";
import config from "../../resources/config";
import AcesAPI from "../../api/base/sysm/AcesAPI";
import SysAPI from "../../api/base/sysm/SysAPI";
import QueryDesignerAPI from "../../api/base/sysm/QueryDesignerAPI";

let defaultTabsData = {
  currTabName: "/",
  tabPagesName: [
    {
      name: "Home",
      path: "/",
      keep: false
    }
  ]
};

export default {
  namespaced: true,
  state: {
    asideCollapsed: false,
    lang: Vue.config.lang,
    queryDesign: [],
    sysMenus: [],
    sysUser: {},
    sysCode: {},
    sysLogin: {
      timeout: false,
      needCaptcha: false,
      loading: false,
      disLogin: false,
      changepwd: false
    },
    tabsData: JSON.parse(JSON.stringify(defaultTabsData))
  },
  mutations: {
    updateState(state, tab) {
      Object.assign(state, tab);
    },
    SET_SYSCODE(state, code) {
      Vue.set(state.sysCode, code.codeType, code.data);
      state.sysCode[code.codeType] = code.data;
    },
    REMOVE_SYSCODE(state, codeType) {
      state.sysCode = [];
    },
    SET_LOGIN(state, sysLogin) {
      Object.assign(state.sysLogin, sysLogin);
    }
  },
  actions: {
    //添加Tab页面
    addTabPagesName({ state }, tabObj) {
      let idx = state.tabsData.tabPagesName.findIndex(
        item => item.path === tabObj.path
      );
      if (idx === -1) state.tabsData.tabPagesName.push(tabObj);
      state.tabsData.currTabName = tabObj.path;
    },
    //删除tab页面
    delTabPagesName({ state }, tabPath) {
      return new Promise(function(resolve, reject) {
        let currindex = state.tabsData.tabPagesName.findIndex(item => {
          return item.path === tabPath.path;
        });
        if (currindex > -1) {
          if (tabPath.path === state.tabsData.currTabName) {
            state.tabsData.currTabName =
              state.tabsData.tabPagesName[currindex - 1].path;
            resolve(state.tabsData.tabPagesName[currindex - 1].path);
          }
          state.tabsData.tabPagesName.splice(currindex, 1);
        }
      });
    },
    //关闭其它标签页
    closeOtherTabPage({ dispatch, state }) {
      let currIndex = state.tabsData.tabPagesName.findIndex(item => {
        return item.path === state.tabsData.currTabName;
      });
      if (currIndex > -1) {
        state.tabsData.tabPagesName.splice(1, currIndex - 1);
        dispatch("closeRightTabPage");
      }
    },
    //关闭右侧标签页
    closeRightTabPage({ state }) {
      let currIndex = state.tabsData.tabPagesName.findIndex(item => {
        return item.path === state.tabsData.currTabName;
      });
      if (currIndex > -1) {
        if (currIndex !== state.tabsData.tabPagesName.length - 1) {
          state.tabsData.tabPagesName.splice(currIndex + 1);
        }
      }
    },
    //关闭全部标签页
    closeAllTabPage({ state }) {
      state.tabsData = JSON.parse(JSON.stringify(defaultTabsData));
    },
    /**
     * 展开缩小侧边栏
     */
    asideCollapsed({ commit, dispatch, state }) {
      commit("updateState", { asideCollapsed: !state.asideCollapsed });
    },
    /**
     * 读取系统字典
     */
    loadSysCode({ commit, dispatch, state }, codeType) {
      // 假设当前code已经加载过,就放弃本次处理
      if (state.sysCode[codeType] !== undefined) {
        return new Promise((resolve, reject) => {
          resolve({ codeType: codeType, data: state.sysCode[codeType] });
        });
      }
      // 否则从本地存储读取,读取不到从服务器读取
      return (
        SysAPI.getAllCodes(codeType)
          // 成功设置到系统状态
          .then(data => {
            commit("SET_SYSCODE", { codeType, data });
            // 返回数据,交给下一承诺处理
            return { codeType, data };
          })
      );
    },
    /**
     * 刷新缓存sysCode
     */
    refreshSysCode({ commit, state }, codeType) {
      return SysAPI.getAllCodes(codeType, true).then(data => {
        commit("SET_SYSCODE", { codeType, data });
        return data;
      });
    },
    /**
     * 登录系统
     */
    login({ commit, dispatch }, loginForm) {
      commit("SET_LOGIN", {
        loading: true
      });
      let promise = new Promise((resolve, reject) => {
        function doLogin() {
          AcesAPI.login(loginForm)
            .then(data => {
              window.localStorage.setItem(config.loginToken, true);
              window.localStorage.setItem(
                config.loginTokenNeedChangePwd,
                data.changepwd
              );
              commit("SET_LOGIN", {
                timeout: false,
                loading: false,
                changepwd: data.changepwd
              });
              resolve();
            })
            .catch(e => {
              console.error(e);
              commit("SET_LOGIN", {
                needCaptcha: e.data.captcha,
                loading: false
              });
            });
        }

        function processCkFail(err) {
          if (err.data.respCode === "020110") {
            let continueLogin = window.confirm(err.data.respDesc);
            if (continueLogin) {
              doLogin();
            }
            commit("SET_LOGIN", {
              loading: false,
              disLogin: !continueLogin,
              changepwd: false
            });
          }
        }

        AcesAPI.logck(loginForm.userid)
          .then(doLogin)
          .catch(processCkFail);
      });
      return promise;
    },
    /**
     *登录检查
     */
    logck({ commit, dispatch }, userid) {
      AcesAPI.logck(userid).then(data => {
        commit("SET_LOGIN", { needCaptcha: data.captcha });
      });
    },
    /**
     * 登录超时
     */
    timeout({ commit, dispatch }) {
      commit("SET_LOGIN", { timeout: true });
    },
    /**
     * 获取登录信息
     */
    getLoginInfo({ commit }) {
      return AcesAPI.getLoginInfo().then(data => {
        commit("updateState", { sysUser: data });
        commit("updateState", { sysMenus: data.menus });
        return data;
      });
    },
    /**
     * 获取查询定义
     */
    getQueryDesign({ commit }) {
      return QueryDesignerAPI.loadDesignMine().then(data => {
        commit("updateState", { queryDesign: data });
        return data;
      });
    }
  }
};
