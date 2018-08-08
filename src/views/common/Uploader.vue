<template>
  <div class="uploader" v-loading="loading" elemeur-loading-text="服务器受理中...">
    <el-card class="flex-1">
      <template slot="header">
        <span>资源管理</span>
      </template>
      <el-form :model="queryform" ref="queryform">
        <el-row>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="文件名称" prop="fileName">
              <el-input v-model="queryform.fileName" />
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="文件类别" prop="fileType">
              <el-select placeholder="请选择" v-sys-code="'fileType'" v-model="queryform.fileType" clearable>
                <el-option v-for="item in sysCode.fileType" :key="item.key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="上传时间区间" prop="picker">
              <el-date-picker v-model="picker" type="datetimerange" placeholder="选择时间范围">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="flex-1">
      <template slot="header">
        <span>资源列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryUserData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetquery" icon="el-icon-fa-reply-all" title="重置"></el-button>
          <el-button type="primary" @click="saveUpload" icon="el-icon-fa-save" v-if="uuid&&allowSave" title="批量保存"></el-button>
          <el-button type="primary" @click="queryUserData" icon="el-icon-fa-refresh" title="刷新"></el-button>
        </div>
      </template>
      <el-alert style='margin-bottom:10px;' title="文件名带有红色的(*),说明此时文件处于临时状态并没有关联主键，请点击“批量保存”按钮！" type="warning">
      </el-alert>
      <PageTable hideTitle ref="dataTable" :data="successFiles" border @load-data="dataTableLoad" stripe highlight-current-row title="已上传列表">
        <el-table-column type="index" fixed='left'></el-table-column>
        <el-table-column prop="filename" label="文件名" width="180" show-overflow-tooltip sortable>
          <template slot-scope="scope">
            <span class="font-red" v-if="scope.row.state==='0'">*</span>
            <span>{{scope.row.filename}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="filesize" label="文件大小" width="100" sortable align="right" :formatter="fileSizeFormat"></el-table-column>
        <el-table-column prop="crtime" label="上传时间" sortable :formatter="formatterDate" width='100'></el-table-column>
        <el-table-column prop="filetype" label="格式" width='80' sortable></el-table-column>
        <el-table-column prop="filemd5" label="MD5" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="filepath" label="服务器路径" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="fileurl" label="下载路径" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="操作" fixed='right' width="96" v-if="!readonly">
          <template slot-scope="scope">
            <a :href="proxyUrl(scope.row.fileurl)" target="_blank" class='margin-right-1'>
              <el-button type="primary" icon="el-icon-fa-cloud-download" title="下载"></el-button>
            </a>
            <el-button v-if="allowTrash" icon="el-icon-fa-trash" title="作废" type="primary" @click="deleteUpdata(scope.$index,scope.row)"></el-button>
            <el-button v-if="allowSave && scope.row.state==='0'" icon="el-icon-fa-check" title="保存" type="primary" @click="sureFile(scope.$index,scope.row)"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>
    <el-card class="flex-1">
      <template slot="header">
        <span>待上传列表</span>
        <div style="float: right;">
          <el-upload style='display: inline-block;margin-right: 3px;' :on-error="fileUploadError" :on-change="fileUploadChange" :show-file-list="false" :accept="accept" multiple :data="data" ref="upload" :action="uploadPath" :auto-upload="false" :on-success='uploadSuccess'>
            <el-button type="primary" icon="el-icon-tickets" title="选择文件"></el-button>
          </el-upload>
          <el-button type="primary" icon="el-icon-fa-cloud-upload" @click="submitUpload" title="批量上传"></el-button>
        </div>
      </template>
      <el-table hideTitle style="min-height:100px;" :data="fileList" border row-key="uid" stripe highlight-current-row v-if="!readonly">
        <el-table-column prop="name" label="文件名" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="size" label="文件大小" width="80" align="right" :formatter="fileSizeFormat"></el-table-column>
        <el-table-column label="进度">
          <template slot-scope="scope">
            <el-progress style="line-height:unset;" :text-inside="true" :stroke-width="14" :percentage="parseInt(scope.row.percentage)" :status="scope.row.status==='fail'?'exception':''"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed='right' width="80">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-fa-cloud-upload" title="上传" :disabled="scope.row.status==='fail'" @click="hanleUpload(scope.$index,scope.row)"></el-button>
            <el-button type="primary" icon="el-icon-fa-trash" title="取消" @click="hanleRemove(scope.$index,scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import FilesAPI from "../../api/base/sysm/FilesAPI";
import config from "../../resources/config";

export default {
  props: {
    uuid: String,
    module: String,
    accept: String,
    allowTrash: {
      type: Boolean,
      default: false
    },
    allowSave: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      uploadPath: config.ajaxUrl + "/sys/file/upload",
      successFiles: [],
      fileList: [],
      picker: [],
      queryform: {
        starTime: null,
        endTime: null,
        fileType: null,
        fileName: null
      }
    };
  },
  computed: {
    data() {
      return {
        module: this.module,
        uuid: this.uuid
      };
    }
  },
  mounted() {
    this.queryUserData();
  },
  watch: {
    uuid() {
      if (!this.readonly) {
        this.$refs.upload.clearFiles();
      }
      this.queryUserData();
    },
    picker(val) {
      if (val && val.length > 0) {
        this.queryform.starTime = val[0];
        this.queryform.endTime = val[1];
      } else {
        this.queryform.starTime = null;
        this.queryform.endTime = null;
      }
    }
  },
  methods: {
    queryUserData() {
      this.$refs.dataTable.load(this.queryform);
    },
    dataTableLoad(params, resolve) {
      params.uuid = this.uuid;
      FilesAPI.selectResource(params)
        .then(resolve) // 让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.successFiles = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    proxyUrl(url) {
      return config.ajaxUrl + "/" + url;
    },
    fileSizeFormat(row, column, cellValue) {
      if (cellValue === 0) return "0 B";
      let k = 1000;
      let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      let i = Math.floor(Math.log(cellValue) / Math.log(k));
      return (cellValue / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
    // 手动触发文件上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 文件上传成功回调函数
    uploadSuccess(response, file, fileList) {
      if (response.respCode === "000000" && response.fileInfo) {
        let keys = Object.keys(response.fileInfo);
        let tem = {};
        keys.forEach((value, index) => {
          let t = value.toLowerCase();
          tem[t] = response.fileInfo[value];
        });
        this.successFiles.splice(0, 0, tem);
        this.$refs.upload.handleRemove(file);
      } else {
        this.$message.error("上传失败!");
      }
    },
    hanleUpload(index, file) {
      this.$refs.upload.$refs["upload-inner"].upload(file.raw);
    },
    hanleRemove(index, file) {
      this.$refs.upload.handleRemove(file);
    },
    fileUploadError(e, file, fileList) {
      fileList.push(file);
      this.$message.error("有文件上传失败!");
    },
    // 添加文件
    fileUploadChange(file, fileList) {
      this.fileList = fileList;
    },
    // 删除上传的企业附件
    deleteUpdata(index, data) {
      this.loading = true;
      FilesAPI.delete(data.uuid)
        .then(() => {
          this.successFiles.splice(index, 1);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    saveUpload() {
      FilesAPI.useAll(this.uuid)
        .then(() => {
          this.$emit("save", this.successFiles);
          this.queryUserData();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    sureFile(index, data) {
      this.loading = true;
      FilesAPI.use(data.uuid)
        .then(() => {
          this.loading = false;
          data.state = "1";
        })
        .catch(() => {
          this.loading = false;
        });
    },
    resetquery() {
      this.$refs.queryform.resetFields();
      this.queryform.starTime = null;
      this.queryform.endTime = null;
      this.picker = [];
    }
  }
};
</script>
<style lang="scss">
.filetitlt {
  height: 30px;
  line-height: 30px;
  border: 1px solid #ddd;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #f6f7fb;
  position: relative;
  padding: 0px 10px;
  & h3 {
    margin: 0px;
    padding: 0px;
    height: 100%;
    line-height: 30px;
    font-weight: 400;
    color: #000;
    font-size: 12px;
    display: inline-block;
  }
}
</style>
