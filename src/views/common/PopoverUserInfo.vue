<template>
  <div>
    <el-popover v-if="uuid" placement="right" trigger="click" @show="hanleShow">
      <table class=" el-table el-table--fit el-table--striped el-table--border  info-table el-table--compact" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td align="right" class="margin-1 bg-default">最后登录于 </td>
            <td class="padding-1"> {{userInfo.laseLogDate|date}}</td>
          </tr>
          <tr>
            <td align="right" class="margin-1 bg-default">最后登录IP </td>
            <td class="padding-1"> {{userInfo.laseLogIp}}</td>
          </tr>
        </tbody>
      </table>
      <div slot="reference" class="href">
        <slot></slot>
      </div>
    </el-popover>
    <span v-if="!uuid">
      <slot></slot>
    </span>
  </div>
</template>
<script>
import UserAPI from "../../api/base/usrm/UserAPI";
export default {
  props: {
    uuid: {
      type: String
    }
  },
  data() {
    return {
      userInfo: []
    };
  },
  methods: {
    /**
     * 当显示的时候处理一下数据
     */
    hanleShow() {
      if (!this.uuid) {
        return;
      }
      this.loadUserInfo();
    },
    /**
     * 加载用户信息
     */
    loadUserInfo() {
      this.userInfo = [];
      UserAPI.getUserInfo(this.uuid)
        .then(userInfo => {
          this.userInfo = userInfo;
        })
        .catch(() => {
          // amazing....
        });
    }
  }
};
</script>
