<!--节点管理-->
<template>
  <div>
    <el-card>
      <!--节点数据管理-->
      <template slot="header">
        <span>信息类型管理</span>
        <div class="pull-right">
          <el-button type="primary" title="新增节点" icon="el-icon-fa-plus" @click="fastAddData"></el-button>
        </div>
      </template>
      <el-form :model="table.params" ref="queryForm">
        <el-row>
          <el-col :lg='4' :sm='12'>
            <el-form-item prop="msgstatus" label="信息状态">
              <el-select placeholder="状态" v-sys-code="'clistatus'" v-model="table.params.msgstatus" clearable>
                <el-option v-for="item in sysCode.clistatus" :key="item.key" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item prop="msgtype" label="信息类型">
              <el-input v-model="table.params.msgtype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item prop="envtype" label="运行环境">
              <el-input class='msgtype-f' placeholder="请输入内容" v-model="table.params.envtype" readonly>
                <el-select v-model="table.params.envtype" slot="prepend" placeholder="请选择" @change="queryData">
                  <el-option :value="1" label="16号运行"></el-option>
                  <el-option :value="2" label="16号联调"></el-option>
                  <el-option :value="3" label="TCS运行"></el-option>
                  <el-option :value="4" label="TCS联调"></el-option>
                  <el-option :value="5" label="SW运行"></el-option>
                  <el-option :value="6" label="SW联调"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <template slot="header">
        <span>信息类型列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetQuery" icon="el-icon-fa-refresh" title="重置"></el-button>
        </div>
      </template>
      <PageTable hideTitle :auto-load="true" ref="dataTable" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
        <el-table-column type="index" width="40" fixed='left'>
        </el-table-column>
        <el-table-column label="信息类型">
          <template slot-scope="scope">
            <el-input v-if="scope.row.$editing" v-model="scope.row.msgtype"></el-input>
            <span v-if="!scope.row.$editing">{{scope.row.msgtype}}</span>
          </template>
        </el-table-column>
        <el-table-column label="DXPID">
          <template slot-scope="scope">
            <el-input v-if="scope.row.$editing" v-model="scope.row.dxpid"></el-input>
            <span v-if="!scope.row.$editing">{{scope.row.dxpid}}</span>
          </template>
        </el-table-column>
        <el-table-column label="信息状态">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.uuid" v-model="scope.row.msgstatus" on-text="启用 " off-text="禁用 " active-value="1" inactive-value="0" on-color="#13ce66 " off-color="#ff4949 " @change="changstatus(scope.row) "></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="字符编码">
          <template slot-scope="scope">
            <el-input v-if="scope.row.$editing" v-model="scope.row.msgencode"></el-input>
            <span v-if="!scope.row.$editing">{{scope.row.msgencode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input v-if="scope.row.$editing" v-model="scope.row.note"></el-input>
            <span v-if="!scope.row.$editing">{{scope.row.note}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed='right'>
          <template slot-scope="scope">
            <el-button type="primary" v-if="!scope.row.$editing" @click="fastEditData(scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
            <el-button type="primary" v-if="scope.row.$editing" @click="SaveData(scope.row)" icon="el-icon-fa-check" title="完成"></el-button>
            <el-button type="primary" v-if="scope.row.$editing" @click="closeFastEdit(scope.row)" icon="el-icon-fa-close" title="取消"></el-button>
            <el-button type="primary" v-if="scope.row.uuid" @click="doDelete(scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>
  </div>

  <!--节点描述管理-->
</template>
<script>
import PertMsgtupeAPI from "@/api/svr/SvrMsgtype";
import BaseViewCRUD from "@/views/common/BaseViewCRUD";

export default {
  name: "msgtype",
  extends: BaseViewCRUD,
  filters: {
    statFormat(stat) {
      if (!stat) {
        return "";
      } else {
        if (stat === "1") {
          return "启用";
        } else if (stat === "0") {
          return "禁用";
        } else {
          return "错误数据";
        }
      }
    }
  },
  data() {
    return {
      table: {
        params: {
          msgstatus: "",
          msgtype: "",
          envtype: 3
        }
      },
      editor: {
        //  编辑器默认数据
        data: {
          msgstatus: "1",
          msgtype: "",
          note: "",
          envtype: "",
          dxpid: ""
        }
      }
    };
  },
  methods: {
    //  快速修改状态
    changstatus: PertMsgtupeAPI.saveMsgType,
    //  删除方法
    apiDeleteOne: PertMsgtupeAPI.delMsgType,
    //  查询方法
    apiQueryList: PertMsgtupeAPI.queryMsgType,
    //  保存方法
    apiSaveOne: PertMsgtupeAPI.saveMsgType,
    //  重写保存方法
    SaveData(data) {
      data.envtype = this.table.params.envtype;
      this.fastSaveData(data);
    }
  }
};
</script>
<style lang="scss">
.msgtype-f {
  & .el-input-group__prepend {
    width: 79px;
    position: relative;
    overflow: hidden;
    & .el-select {
      width: 100%;
      position: absolute;
      right: 20px;
    }
  }
}
</style>

