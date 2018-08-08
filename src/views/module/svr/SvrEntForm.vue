<template>
  <el-form ref="form" label-position='top' v-loading="loading" :model="data" :rules="rules">
    <el-alert title="请先进行企业基本信息的保存，再进行DXP和IC卡的管理！" type="warning" />
    <el-tabs v-model="activeName2" type="border-card">
      <el-tab-pane label="基本信息" name="first">
        <el-row>
          <el-col :span='8'>
            <el-form-item label="关联平台" prop="biztppuuid" :error="error.biztppuuid">
              <Selector v-model="data.biztppuuid" clearable label-key="tppname" value-key="uuid" :init-label="data.biztppname">
                <SelectorTpp></SelectorTpp>
              </Selector>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="企业名称" prop="copname" :error="error.copname">
              <el-input v-model="data.copname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="企业编码" prop="copcode" :error="error.copcode">
              <el-input type="copcode" :minlength="6" v-model="data.copcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="备注" prop="note">
              <el-input v-model="data.note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="授权信息" name="second">
        <el-card>
          <div slot="header">
            <span>服务列表</span>
            <div class="pull-right">
              <el-button type="primary" :class='celet' style="padding: 3px;" icon="el-icon-check" title="全选" @click="allSelet" />
            </div>
          </div>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <el-tree show-checkbox class="filter-tree" node-key="uuid" highlight-current :data="getuuids" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2"></el-tree>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="DXP管理" name="three" :disabled='dxpic'>
        <PageTable ref="dataTable" :auto-load="false" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border title="DXP列表" hideExport>
          <template slot="buttons">
            <el-button type="primary" title="新增DXP" icon="el-icon-plus" @click.stop="fastAddData" />
            <el-button type="primary" @click="queryData" icon="el-icon-refresh" title="刷新" />
          </template>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="dxpid" label="DXPID">
            <template slot-scope="scope">
              <el-input v-if="scope.row.$editing" v-model="scope.row.dxpid"></el-input>
              <span v-if="!scope.row.$editing">{{scope.row.dxpid}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="描述">
            <template slot-scope="scope">
              <el-input v-if="scope.row.$editing" v-model="scope.row.note"></el-input>
              <span v-if="!scope.row.$editing">{{scope.row.note}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="primary" v-if="!scope.row.$editing" @click="fastEditData(scope.row)" icon="el-icon-fa-edit" title="编辑" />
              <el-button type="primary" v-if="scope.row.$editing" @click="SaveData(scope.row)" icon="el-icon-fa-check" title="完成" />
              <el-button type="primary" v-if="scope.row.$editing" @click="closeFastEdit(scope.row)" icon="el-icon-fa-close" title="取消" />
              <el-button type="primary" v-if="scope.row.uuid" @click="doDelete(scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除" />
            </template>
          </el-table-column>
        </PageTable>
      </el-tab-pane>
      <el-tab-pane label="IC卡管理" name="four" :disabled='dxpic'>
        <PageTable ref="icTable" :auto-load="false" @load-data="icTableLoad" :data="ictable.data" highlight-current-row stripe border title="IC卡列表" hideExport>
          <template slot="buttons">
            <el-button type="primary" title="新增IC卡" icon="el-icon-plus" @click.stop="fastAddIcData" />
            <el-button type="primary" @click="queryIcData" icon="el-icon-refresh" title="刷新" />
          </template>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="cardno" label="卡号" :sortable="true" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-if="scope.row.$editing" v-model="scope.row.cardno"></el-input>
              <span v-if="!scope.row.$editing">{{scope.row.cardno}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cardkeyname" label="证书号" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-if="scope.row.$editing" v-model="scope.row.cardkeyname"></el-input>
              <span v-if="!scope.row.$editing">{{scope.row.cardkeyname}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cardcert" label="证书" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-if="scope.row.$editing" v-model="scope.row.cardcert"></el-input>
              <span v-if="!scope.row.$editing">{{scope.row.cardcert}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-if="scope.row.$editing" v-model="scope.row.note"></el-input>
              <span v-if="!scope.row.$editing">{{scope.row.note}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="primary" v-if="!scope.row.$editing" @click="fastEditIcData(scope.row)" icon="el-icon-fa-edit" title="编辑" />
              <el-button type="primary" v-if="scope.row.$editing" @click="SaveIcData(scope.row)" icon="el-icon-fa-check" title="完成" />
              <el-button type="primary" v-if="scope.row.$editing" @click="closeIcFastEdit(scope.row)" icon="el-icon-fa-close" title="取消" />
              <el-button type="primary" v-if="scope.row.uuid" @click="doIcDelete( scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除" />
            </template>
          </el-table-column>
        </PageTable>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>
<script>
import SelectorTpp from "@/views/common/SelectorTpp";
import PretEntAPI from "@/api/svr/SvrEnt";
import SvrMaintAPI from "@/api/svr/SvrMaint";
import BaseViewCRUD from "@/views/common/BaseViewCRUD";
import PretDXPAPI from "@/api/svr/SvrDXP";
import PretIccardAPI from "@/api/svr/SvrIccard";

let defultData = {
  uuid: "",
  biztppuuid: "",
  copname: "",
  copcode: "",
  dxpList: [],
  iccardList: [],
  uuidList: [],
  note: ""
};

export default {
  extends: { ...BaseViewCRUD },
  components: {
    SelectorTpp,
    SvrMaintAPI,
    PretDXPAPI,
    PretIccardAPI
  },
  data() {
    return {
      celet: "allSelet",
      dxpic: true,
      activeName2: "first",
      data: Object.assign({}, defultData),
      rules: {
        copname: [{ required: true, message: "请输入企业名称!" }]
      },
      getuuids: [],
      loading: false,
      filterText: "",
      defaultProps: {
        label: "note"
      },
      table: {
        params: {
          bizentuuid: null,
          dxpid: null,
          note: null
        }
      },
      ictable: {
        params: {
          bizentuuid: null,
          cardno: null,
          cardkeyname: null,
          note: null
        },
        data: []
      }
    };
  },
  props: {
    uuid: String,
    error: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    uuid(val) {
      this.loadData();
    },
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted() {
    //  最开始显示的时候要加载数据
    this.loadData();
  },
  methods: {
    // 权限信息全选按钮
    allSelet() {
      if (this.getuuids.length !== this.$refs.tree2.getCheckedKeys().length) {
        let t = [];
        this.getuuids.forEach((value, index) => {
          t.push(value.uuid);
        });
        this.$refs.tree2.setCheckedKeys(t);
        this.celet = "allSelet";
      } else {
        this.$refs.tree2.setCheckedKeys([]);
        this.celet = "noAllSelet";
      }
    },
    doIcDelete(index, rowData) {
      this.confirm(rowData) // 提示确认
        .then(this.deleteDataFun) // 然后删除数据
        .then(this.queryIcData); // 然后查询数据
    },
    // 执行删除
    deleteDataFun(data) {
      Object.assign(data, { $editing: false });
      return PretIccardAPI.deleteIccard(data.uuid);
    },
    fastAddIcData() {
      this.fastEditDataCancelFun();
      let data = Object.assign({ $editing: true }, {});
      this.fastEditIcData(data);
      this.ictable.data.splice(0, 0, data);
    },
    // 快速编辑时进行数据拷贝,方法名可能比较怪异,不要被迷惑,这个方法是用来复制数据到临时空间,方便取消修该的时候还原.
    fastEditIcData(data) {
      this.fastEditDataCancel();
      data.$editing = true;
      this.fastData = Object.assign({}, data);
    },
    //  快速保存数据
    fastSaveIcData(data) {
      this.ictable.loading = true;
      PretIccardAPI.saveIccard(data) // 保存数据
        .then(resp => {
          data.$editing = false;
          data.uuid = resp.saveuuid; // 快速编辑要求服务器一定要返回编辑的数据的UUID,来同步数据
          this.ictable.loading = false;
        })
        .catch(() => {
          this.ictable.loading = false;
        });
    },
    // 找到没保存的数据 删除之
    fastEditDataCancelFun() {
      let deleteQueue = [];
      this.ictable.data.forEach(rc => {
        if (!rc.uuid) {
          deleteQueue.push(rc);
        } else if (rc.$editing) {
          this.closeIcFastEdit(rc);
        }
      });
      deleteQueue.forEach(rc => {
        let index = this.ictable.data.indexOf(rc);
        this.ictable.data.splice(index, 1);
      }, this);
    },
    // 关闭快速编辑
    closeIcFastEdit(data) {
      this.fastData.$editing = false;
      Object.assign(data, this.fastData);
      this.fastData = {};
      this.fastEditDataCancelFun();
    },
    queryIcData() {
      this.$refs.icTable.load(this.ictable.params);
    },
    // 加载表格数据
    icTableLoad(params, resolve) {
      PretIccardAPI.queryIccard(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => this.initFastData(respData)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    initFastData(data) {
      data.datarows.forEach((value, index) => {
        value.$editing = false;
      });
      this.ictable.data = data.datarows;
    },
    SaveData(data) {
      data.bizentuuid = this.uuid;
      this.fastSaveData(data);
    },
    SaveIcData(data) {
      data.bizentuuid = this.uuid;
      this.fastSaveIcData(data);
    },
    //  快速修改状态
    changstatus: PretDXPAPI.saveDxp,
    //  加载一条
    apiLoadOne: PretDXPAPI.getDxp,
    //  保存一条
    apiSaveOne: PretDXPAPI.saveDxp,
    //  删除一条
    apiDeleteOne: PretDXPAPI.delDxp,
    //  查询列表
    apiQueryList: PretDXPAPI.queryDxp,
    queryData() {
      this.$refs.dataTable.load(this.table.params);
    },
    getTreeList() {
      this.data.uuidList = this.$refs.tree2.getCheckedKeys();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.svrdesc.indexOf(value) !== -1;
    },
    addNewSites() {
      if (this.data.dxpList) {
        this.data.dxpList.push({});
      }
    },
    addiccardList() {
      if (this.data.iccardList) {
        this.data.iccardList.push({});
      }
    },
    delNewSites(index) {
      if (this.data.dxpList) {
        this.data.dxpList.splice(index, 1);
      }
    },
    deliccardList(index) {
      if (this.data.iccardList) {
        this.data.iccardList.splice(index, 1);
      }
    },
    //  重置方法
    reset() {
      this.$refs.form.resetFields();
    },
    validate() {
      return this.$refs.form.validate().then(() => this.data);
    },
    //  加载数据方法,如果有UUID,就加载数据,如果没有,就重置表单
    loadData() {
      //  查询单条
      this.loading = true;
      this.data = Object.assign({}, defultData);
      SvrMaintAPI.querySvrMaint().then(respData => {
        this.getuuids = respData.datarows;
        this.loading = false;
      });
      if (!this.uuid) {
        this.loading = true;
        this.data = Object.assign({}, defultData);
        this.loading = false;
      } else {
        this.loading = true;
        PretEntAPI.getEnt(this.uuid).then(respData => {
          this.dxpic = false;
          this.table.params.bizentuuid = this.uuid;
          this.queryData();
          this.ictable.params.bizentuuid = this.uuid;
          this.queryIcData();
          this.data = respData.data;
          let arr = [];
          respData.data.svrMaintList.forEach((value, index) => {
            arr.push(value.uuid);
          });
          this.data.uuidList = arr;
          this.$refs.tree2.setCheckedKeys(this.data.uuidList);
          this.loading = false;
        });
      }
    }
  }
};
</script>
<style lang="scss">
.allSelet {
  color: #fff !important;
  background-color: #409eff !important;
}
.noAllSelet {
  color: #000 !important;
  background-color: #eee !important;
}
</style>
