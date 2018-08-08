<!-- 字典管理 -->
<template>
  <div class="flex-h" v-loading="loading">
    <el-card class="flex-2 full">
      <template slot="header">
        <span>代码项分组</span>
        <div class="pull-right">
          <el-input class="margin-right-3" style="width:100px;" v-model="codeType.keyword" placeholder="分组过滤" prefix-icon="el-icon-search"></el-input>
          <el-button type="primary" @click="queryCodeType" icon="el-icon-fa-refresh" title="刷新"></el-button>
          <el-button type="primary" @click="handleAddCodeType" icon="el-icon-fa-plus" title="添加"></el-button>
        </div>
      </template>
      <el-table ref="codeTypeTable" class="group-table" v-loading="codeType.loading" :data="filterBy(codeType.data, codeType.keyword,'codeTypeName','codeTypeValue')" @current-change="handleCurrentCodeTypeChange" border stripe highlight-current-row>
        <el-table-column label="名称" prop="codeTypeName"></el-table-column>
        <el-table-column label="编码" prop="codeTypeValue"></el-table-column>
        <el-table-column label="类型" prop="codeKind" :formatter="formatterCodeKind"></el-table-column>
        <el-table-column label="操作" fixed='right' width="70">
          <template slot-scope="scope">
            <el-button type="primary" @click.stop="handleEditCodeType(scope.$index, scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
            <el-button type="primary" @click.stop="handleDeleteCodeType(scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="flex-2 margin-left-3 full" style="min-height:400px;">
      <template slot="header">
        <span>代码详情编辑</span>
        <div class="pull-right">
          <el-input style="width:100px;" v-model="codeDetail.keyword" placeholder="字典过滤" prefix-icon="el-icon-search"></el-input>
          <el-button type="primary" @click="queryCodeByType" :disabled="!current.codeType" icon="el-icon-fa-refresh" title="查询"></el-button>
          <el-button type="primary" @click="handleAddCode" :disabled="!current.codeType" icon="el-icon-fa-plus" title="新增字典"></el-button>
        </div>
      </template>
      <el-table v-show="detailType==='list'" :data="filterBy(codeDetail.data, codeDetail.keyword,'codeValue','codeName')" border stripe highlight-current-row>
        <el-table-column prop="codeValue" label="代码名称"></el-table-column>
        <el-table-column prop="codeName" label="代码值"></el-table-column>
        <el-table-column prop="ordeNo" label="排序级别"> </el-table-column>
        <el-table-column label="操作" fixed='right' width="70">
          <template slot-scope="scope">
            <el-button type="primary" @click.stop="handleEditCode(scope.$index, scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
            <el-button type="primary" @click.stop="handleDeleteCode(scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex-h" v-show="detailType==='tree'">
        <el-tree class="flex-1" ref="codeTree" node-key="uuid" :data="codeTreeData" :props="codeDetail.treeProps" highlight-current @current-change="handleTreeNodeChange" :expand-on-click-node="false" default-expand-all />
        <el-table class="flex-2 margin-left-1 " :data="current.code.children" border stripe highlight-current-row>
          <el-table-column prop="codeValue" label="代码键"></el-table-column>
          <el-table-column prop="codeName" label="代码值"></el-table-column>
          <el-table-column prop="ordeNo" label="排序级别"> </el-table-column>
          <el-table-column label="操作" fixed='right' width="120">
            <template slot-scope="scope">
              <el-button type="primary" @click.stop="handleEditCode(scope.$index, scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
              <el-button type="primary" @click.stop="handleDeleteCode(scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- <el-card class="flex-1 margin-left-3 full" v-loading="codeSearch.loading">
      <template slot="header">
        <span>代码快速定位</span>
      </template>
      <div class="flex-h">
        <el-input style="width:170px;" class="flex-1" prefix-icon="el-icon-search" v-model="codeSearch.keyword" placeholder="输入以定位字典" clearable>
          <template slot="append">
            <i class=" cursor-pointer el-icon-fa el-icon-fa-close" @click="codeSearch.keyword=''"></i>
          </template>
        </el-input>
        <el-button type="primary" :disabled="!codeSearch.keyword" class="margin-left-1" @click="findCode" icon="el-icon-fa-search" title="定位"></el-button>
      </div>
      <div v-show="codeSearch.result" class="margin-2 code-result">
        <div class="code-result__field">
          <span class="code-result__label">代码名称</span>
          <input v-model="codeSearch.result.codeTypeName" />
        </div>
        <div class="code-result__field">
          <span class="code-result__label">代码标识</span>
          <input v-model="codeSearch.result.codeTypeValue" />
        </div>
        <div class="code-result__field">
          <span class="code-result__label">代码键</span>
          <input v-model="codeSearch.result.codeValue" />
        </div>
        <div class="code-result__field">
          <span class="code-result__label">代码值</span>
          <input v-model="codeSearch.result.codeName" />
        </div>
      </div>
      <div class="text-center padding-3" v-show=" !codeSearch.result">
        没有找到记录!
      </div>
    </el-card> -->
    <el-dialog append-to-body v-draggable width="500px" title="代码项编辑" :visible.sync="codeType.editor.visible" :close-on-click-modal="false">
      <div class='dialog-button'>
        <el-button type="primary" plain :loading="codeType.editor.saving" icon="el-icon-fa-save" title="提交" @click="handleSubmitCodeType"></el-button>
      </div>
      <CodeTypeEditor v-if="codeType.editor.visible" v-loading="codeType.editor.saving" ref="codeTypeEditor" :data="codeType.editor.data" :error="codeType.editor.error" />
    </el-dialog>
    <el-dialog append-to-body v-draggable width="600px" title="代码详情编辑" :visible.sync="codeDetail.editor.visible" :close-on-click-modal="false">
      <div class='dialog-button'>
        <el-button type="primary" plain :loading="codeDetail.editor.saving" icon="el-icon-fa-save" title="提交" @click="handleSubmitCode"></el-button>
      </div>
      <CodeEditor v-if="codeDetail.editor.visible" v-loading="codeDetail.editor.saving" ref="codeEditor" :data="codeDetail.editor.data" :error="codeDetail.editor.error" />
    </el-dialog>
  </div>
</template>
<script>
import CodeApi from "@/api/base/sysm/CodeAPI";
import CodeTypeEditor from "./CodeTypeEditor";
import CodeEditor from "./CodeEditor";

let defaultCodeType = {
  codeTypeName: "",
  codeTypeValue: "",
  codeKind: "1"
};

let defaultCode = {
  enabled: "1",
  extend: "",
  ordeNo: "1",
  codeName: "",
  codeValue: "",
  codeTypeName: "",
  codeTypeValue: ""
};

export default {
  name: "CodeMgr",
  components: { CodeEditor, CodeTypeEditor },
  data() {
    return {
      loading: false,
      current: {
        code: "",
        codeType: ""
      },
      codeSearch: {
        loading: false,
        result: false,
        keyword: ""
      },
      codeDetail: {
        loading: false,
        data: [],
        keyword: "",
        treeProps: {
          children: "children",
          label: "codeName",
          disabled: "disabled"
        },
        editor: {
          data: {},
          error: {},
          visible: false,
          saving: false
        }
      },
      codeType: {
        loading: false,
        data: [],
        currentRowUuid: "",
        keyword: "",
        editor: {
          data: {},
          error: {},
          visible: false,
          saving: false
        }
      }
    };
  },
  mounted() {
    this.queryCodeType();
  },
  watch: {
    "current.codeType"(currentCodeType) {
      if (currentCodeType && currentCodeType.uuid) {
        this.queryCodeByType();
      } else {
        this.codeDetail.data = [];
      }
    }
  },
  computed: {
    codeTreeData() {
      if (this.current.codeType)
        return [
          {
            disabled: true,
            codeName: "代码项 : " + this.current.codeType.codeTypeName,
            children: this.codeDetail.data
          }
        ];
    },
    detailType() {
      if (!this.current.codeType) {
        return "none";
      }
      if (this.current.codeType.codeKind === "1") {
        return "list";
      }
      if (this.current.codeType.codeKind === "2") {
        return "tree";
      }
    }
  },
  methods: {
    queryCodeType() {
      this.codeType.loading = true;
      CodeApi.queryCodeType()
        .then(respData => {
          this.codeType.data = respData;
          this.codeType.loading = false;
        })
        .catch(() => {
          this.codeType.loading = false;
        });
    },
    queryCodeByType() {
      CodeApi.queryCodeByType(this.current.codeType.uuid).then(respData => {
        this.codeDetail.data = respData;
      });
    },
    //  提交 字典分组数据
    submitCodeType(data) {
      this.codeType.editor.saving = true;
      this.codeType.editor.error = {};
      CodeApi.saveCodeType(data)
        .then(respData => {
          this.queryCodeType();
          this.codeType.editor.saving = false;
          this.codeType.editor.visible = false;
        })
        .catch(error => {
          this.codeType.editor.error = error.validError;
          this.codeType.editor.saving = false;
        });
    },
    deleteCodeType(data) {
      this.loading = true;
      CodeApi.deleteCodeType(data.uuid)
        .then(respData => {
          this.queryCodeType();
          this.current.codeType = "";
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteCode(data) {
      this.loading = true;
      return CodeApi.delCode(data.uuid)
        .then(respData => {
          this.loading = false;
          this.queryCodeByType();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //  提交 数据字典数据
    submitCode(data) {
      this.codeDetail.editor.saving = true;
      this.codeDetail.editor.error = {};
      CodeApi.saveCode(data)
        .then(respData => {
          this.queryCodeByType();
          this.codeDetail.editor.saving = false;
          this.codeDetail.editor.visible = false;
        })
        .catch(error => {
          this.codeDetail.editor.error = error.validError;
          this.codeDetail.editor.saving = false;
        });
    },
    // 代码项搜索
    findCode() {
      this.codeSearch.loading = true;
      CodeApi.findCode(this.codeSearch.keyword)
        .then(respData => {
          this.codeSearch.result = respData || false;
          this.codeSearch.loading = false;
        })
        .catch(() => {
          this.codeSearch.loading = false;
        });
    },
    // 格式化 字典 类型
    formatterCodeKind(row, column, cellValue) {
      if (cellValue === "1") {
        return "列表";
      } else if (cellValue === "2") {
        return "树状";
      } else {
        return "错误数据";
      }
    },
    //    响应 当前选中字典分类改变
    handleCurrentCodeTypeChange(currentRow, oldCurrentRow) {
      this.current.codeType = currentRow;
    },
    //    响应[添加 字典分类 按钮]
    handleAddCodeType() {
      this.codeType.editor.data = Object.assign({}, defaultCodeType);
      this.codeType.editor.visible = true;
    },
    //  响应 [ 保存 字典分组 按钮]
    handleSubmitCodeType() {
      this.$refs.codeTypeEditor.validate().then(this.submitCodeType);
    },
    //  响应 [ 编辑 字典分组 按钮]
    handleEditCodeType(index, codeType) {
      this.codeType.editor.data = codeType;
      this.codeType.editor.visible = true;
    },
    //  响应 [ 删除 字典分组 按钮]
    handleDeleteCodeType(index, codeType) {
      this.confirm(codeType).then(this.deleteCodeType);
    },
    //  响应 [ 删除 字典 按钮]
    handleDeleteCode(index, codeType) {
      this.confirm(codeType)
        .then(this.deleteCode)
        .then(() => {
          this.current.code.children.splice(index, 1);
        });
    },

    //  响应 [ 添加 字典 按钮]
    handleAddCode() {
      this.codeDetail.editor.data = Object.assign({}, defaultCode, {
        codeTypeName: this.current.codeType.codeTypeName,
        codeTypeValue: this.current.codeType.codeTypeValue,
        codeTypeUuid: this.current.codeType.uuid,
        puuid: this.current.code.uuid
      });
      this.codeDetail.editor.visible = true;
    },
    // 响应 提交代码
    handleSubmitCode() {
      this.$refs.codeEditor.validate().then(this.submitCode);
    },
    // 响应 编辑 代码项
    handleEditCode(index, code) {
      code.codeTypeUuid = this.current.codeType.uuid;
      this.codeDetail.editor.data = code;
      this.codeDetail.editor.visible = true;
    },
    // 响应 [ 树行菜单当前选中节点切换 ]
    handleTreeNodeChange(code) {
      this.current.code = code;
    }
  }
};
</script>

<style lang="scss" >
.group-table {
  .el-table__body {
    td {
      cursor: pointer;
    }
    tr:hover {
      font-weight: 600;
    }
    tr.current-row > td {
      background-color: #bbb !important;
    }
  }
}

.code-result {
  &__label {
    text-align: right;
    display: inline-block;
    cursor: pointer;
    padding-right: 5px;
    box-sizing: border-box;
    width: 60px;
    & ~ input {
      width: 48%;
      display: inline-block;
      border: 1px solid #ccc;
      outline: none;
      padding: 2px 3px;
    }
  }
  &__field {
    width: 100%;
    padding: 3px;
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
