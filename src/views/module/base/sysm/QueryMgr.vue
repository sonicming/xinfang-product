<template>
  <div>
    <el-card>
      <template slot="header">
        <span>查询定义</span>
        <div class="pull-right">
          <el-button type="primary" icon="el-icon-fa-plus" @click="handleAdd"></el-button>
        </div>
      </template>
      <el-form :model="queryform" label-width="8em" label-position="left" inline>
        <el-form-item label="查询名称">
          <el-input v-model="queryform.queryname"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template slot="header">
        <span>查询定义列表</span>
        <div class="pull-right">
          <el-button type="primary" icon="el-icon-fa-search" @click="handleQuery"></el-button>
        </div>
      </template>
      <PageTable hideTitle ref="dataTable" auto-load @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border hideExport>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div>
              <pre>{{scope.row.querysql}}</pre>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="queryname" label="查询名称" sortable></el-table-column>
        <el-table-column prop="querytitle" label="查询标题"></el-table-column>
        <el-table-column prop="tablename" label="使用表"></el-table-column>
        <el-table-column label="操作" fixed='right' width="160">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
            <el-button type="primary" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>
    <el-dialog append-to-body v-draggable width="1280px" height="840px" :visible.sync="designer.show" title="查询设计" maxable="false">
      <QueryDesigner v-if="designer.show" :uuid="designer.uuid"></QueryDesigner>
    </el-dialog>
  </div>
</template>
<script>
import QueryDesignerAPI from "@/api/base/sysm/QueryDesignerAPI";
import QueryDesigner from "./QueryDesigner";

export default {
  name: "QueryMgr",
  components: { QueryDesigner },
  data() {
    return {
      queryform: { queryname: "" },
      table: {
        data: []
      },
      designer: {
        uuid: "",
        show: false
      }
    };
  },
  methods: {
    handleAdd() {
      this.designer.uuid = "";
      this.designer.show = true;
    },
    handleEdit(index, row) {
      this.designer.show = true;
      this.designer.uuid = row.uuid;
    },
    handleQuery() {
      this.$refs.dataTable.load(this.queryform);
    },
    dataTableLoad(params, resolve) {
      QueryDesignerAPI.loadDesignList(params)
        .then(resolve)
        .then(respData => (this.table.data = respData.datarows));
    },
    handleDelete(index, row) {
      this.confirm(row).then(row => {
        QueryDesignerAPI.deleteDesign(row.uuid)
          .then(this.handleQuery)
          .catch();
      });
    }
  }
};
</script>
