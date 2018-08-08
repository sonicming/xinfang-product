<template>
  <div>
    <el-form inline :model="table.params" ref="queryForm" class="margin-bottom-1">
      <el-form-item prop="tppname" label="平台名称">
        <el-input v-model="table.params.tppname"></el-input>
      </el-form-item>
      <el-form-item prop="diviscode" label="行政编码">
        <el-input v-model="table.params.diviscode" placeholder=""></el-input>
      </el-form-item>
      <el-form-item prop="divisname" label="行政地区">
        <el-input v-model="table.params.divisname" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
        <el-button @click="resetQuery" icon="el-icon-fa-reply-all" title="重置"></el-button>
      </el-form-item>
    </el-form>

    <PageTable page-layout="total,  prev, pager, next" :hideExport="true" ref="dataTable" :auto-load="true" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border :export="false">
      <el-table-column type="selection" width="55" v-if="multiple"></el-table-column>
      <el-table-column prop="tppname" label="平台名称" sortable width="180">
        <template slot-scope="scope">
          <a @click.stop="selectTableRow(scope.row)" class="href">{{scope.row.tppname}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="diviscode" label="行政编码" width="180"></el-table-column>
      <el-table-column prop="divisname" label="行政地区" width="180"> </el-table-column>
      <el-table-column prop="tppdesc" label="说明" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contactinfo" label="联系信息" show-overflow-tooltip> </el-table-column>
      <el-table-column prop=" tppstatus " label="启用" width="50" align="center">
        <template slot-scope="scope ">
          <span v-if="scope.row.tppstatus==1" class="font-green-success">可用</span>
          <span v-else class="font-red-error">停用</span>
        </template>
      </el-table-column>
    </PageTable>

  </div>
</template>

<script>
import BaseSelector from '../common/BaseSelector'
export default {
  extends: BaseSelector,
  props: {
    multiple: Boolean
  },
  data () {
    return {
      // 选择数据是 平台数据
      dataType: 'tpp',
      // 表格配置
      table: {
        // 默认参数
        params: {
          divisname: null,
          diviscode: null,
          tppname: null
        }
      }
    }
  }
}
</script>
