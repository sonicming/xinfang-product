<template>

  <el-container id="app-container" direction="vertical">
    <el-tabs type="card" ref="tabs" :value="$store.state.tabActive" @tab-remove="handleClose" @tab-click="handleTabClick">
      <el-tab-pane class="app-main" v-for="(tab) in $store.state.tabList" :key="tab.tabName" :name="tab.tabName" :label="tab.tabLabel" :closable="tab.closable!==false">
        <keep-alive>
          <router-view v-if="$store.state.tabActive==tab.tabName" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>

    <el-dropdown size="mini" @command="handleTabMenu" trigger="click">
      <el-button>
        <i class="el-icon-arrow-down"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="closeAll">
          <i class="el-icon-close"></i> 全部关闭</el-dropdown-item>
        <el-dropdown-item command="closeOther">
          <i class="el-icon-close"></i> 关闭其他</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </el-container>
</template>

<script>
export default {
  name: "Container",
  componentName: "Container",
  watch: {
    "$store.state.tabActive"(tabActive, old) {
      let tab = this.$store.state.tabList.find(
        itm => itm.tabName === tabActive
      );
      this.$router.push(tab.tabUrl);
    }
  },
  methods: {
    handleTabMenu(cmd) {
      let { tabList, tabActive } = this.$store.state;
      switch (cmd) {
        case "closeAll": {
          tabList.splice(1, tabList.length - 1);
          tabActive = "default";
          break;
        }
        case "closeOther": {
          tabList = tabList.filter(
            t => t.tabName === "default" || t.tabName === tabActive
          );
          break;
        }
        default:
          break;
      }
      this.$store.commit("updateState", { tabList, tabActive });
    },
    handleClose(name) {
      this.$store.dispatch("closeTab", name);
    },
    handleTabClick(tab) {
      this.$store.commit("updateState", { tabActive: tab.name });
    }
  }
};
</script>

<style>
#app-container {
  padding: 6px;
}
#app-container > .el-tabs {
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-shadow: 0 10px 10px 0 #0000001f, 0 0 6px 0 #0000000a;
}
#app-container > .el-tabs .el-tabs__header {
  margin: 0px;
  padding-right: 30px;
}
#app-container > .el-tabs .el-tabs__content {
  height: 100%;
  padding: 6px;
}
#app-container > .el-tabs .el-tab-pane {
  height: 100%;
}
#app-container .el-dropdown {
  position: absolute;
  right: 10px;
  margin-top: 3px;
}
</style>