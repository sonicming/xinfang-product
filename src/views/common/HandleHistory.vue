<template>
  <div>
    <div v-if="mode==='dialog'">
      <el-dialog append-to-body v-draggable width="auto" auto-height :visible.sync="view.visible" title="经办历史信息">
        <div v-if="view.visible && uuid">
          <table class=" el-table el-table--fit el-table--striped el-table--border  info-table" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th>创建人</th>
                <th>创建时间</th>
                <th>最后操作人</th>
                <th>最后操作时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  \{{crUserInfo.userName}}
                </td>
                <td>{{crTime|date}}</td>
                <td>{{opUserInfo.userName}}</td>
                <td>{{opTime|date}}</td>
              </tr>
            </tbody>
          </table>
          <HandleDetail style="width:1024px" v-if="uuid" :bizUuid="uuid"></HandleDetail>
        </div>
      </el-dialog>
      <div slot="reference" class="href" @click="view.visible=true">
        <slot></slot>
      </div>
    </div>
    <!-- 直接显示table的模式 -->
    <div v-if=" mode==='plan'  && uuid" slot="reference">
      <table class=" el-table el-table--fit el-table--striped el-table--border  info-table  el-table--compact" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>创建人</th>
            <th>创建时间</th>
            <th>最后操作人</th>
            <th>最后操作时间</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <el-tooltip class="item" effect="dark" :content="crUserInfo.userCode" placement="top">
                <el-button>{{crUserInfo.userName}}</el-button>
              </el-tooltip>
            </td>
            <td>{{crTime|moment('lll')}}</td>
            <td>
              <el-tooltip class="item" effect="dark" :content="opUserInfo.userCode" placement="top">
                <el-button>{{opUserInfo.userName}}</el-button>
              </el-tooltip>
            </td>
            <td>{{opTime|moment('lll')}}</td>
          </tr>
        </tbody>
      </table>
      <HandleDetail v-if="uuid" :bizUuid="uuid"></HandleDetail>
    </div>
  </div>
</template>
<script>
/**
 * 显示经办历史字段:
 * attributes:
 *  mode:['popover'|'plan'] popover 则在悬浮提示中显示,使用slot作为渲染内容. plan 直接显示table
 *
 */
import HandleDetail from "./HandleDetail";
import UserAPI from "../../api/base/usrm/UserAPI";

export default {
  components: { HandleDetail },
  props: {
    uuid: {
      type: String
    },
    crTime: {
      type: Number
    },
    opUserUuid: {
      type: String
    },
    crUserUuid: {
      type: String
    },
    opTime: {
      type: Number
    },
    mode: {
      type: String,
      default: "plan"
    }
  },
  data() {
    return {
      crUserInfo: {},
      opUserInfo: {},
      data: [],
      view: {
        visible: false
      }
    };
  },
  watch: {
    uuid(val) {
      this.loadUserInfo();
    }
  },
  mounted() {
    if (this.uuid) {
      this.loadUserInfo(this.uuid);
    }
  },
  methods: {
    handleShow() {
      this.view.visible = true;
    },
    handleHide() {
      this.view.visible = false;
    },
    loadUserInfo() {
      if (this.crUserUuid && this.opUserUuid) {
        UserAPI.getUser(this.crUserUuid).then(resp => {
          this.crUserInfo = Object.assign({}, resp.data.data);
        });
        UserAPI.getUser(this.opUserUuid).then(resp => {
          this.opUserInfo = Object.assign({}, resp.data.data);
        });
      }
    }
  }
};
</script>
<style scoped>
.info-table th {
  padding: 2px 10px;
  font-weight: normal;
}

.info-table td {
  padding: 2px 10px;
  font-weight: normal;
}
</style>
