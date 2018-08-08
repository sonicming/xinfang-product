export default {
  tabPagesName: state => {
    return {
      data: state.base.tabsData.tabPagesName,
      curr: state.base.tabsData.currTabName
    };
  },
  //缓存路由页面列表
  keepRouters: state => {
    let kr = [];
    state.base.tabsData.tabPagesName.forEach((value, index) => {
      //去掉空格
      kr.push(value.name.replace(/(^\s*)|(\s*$)/g, ""));
    });
    return kr;
  }
};
