<template>
  <el-form v-loading="loading" label-position="top" ref="form" :model="data" :rules="rules">
    <el-form-item label="服务代码" prop="svrCode" :error="error.svrCode">
      <el-input v-model="data.svrCode"></el-input>
    </el-form-item>
    <div class="flex-h">
      <el-form-item class="flex-1" label="服务类" prop="svrClaz" :error="error.svrClaz">
        <el-input v-model="data.svrClaz"></el-input>
      </el-form-item>
      <el-form-item class="flex-1" prop="svrStat" :error="error.svrStat" label="服务状态">
        <el-select placeholder="服务状态" v-sys-code="'svrStat'" v-model="data.svrStat" clearable>
          <el-option v-for="item in sysCode.svrStat" :key="item.key" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </div>
    <el-form-item label="备注" prop="note" :error="error.note">
      <el-input v-model="data.note"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import SvrMaintApi from '@/api/svr/SvrMaint'

let dafaultData = {
  uuid: '',
  svrCode: '',
  svrStat: '',
  svrClaz: '',
  note: ''
}

export default {
  props: {
    //  一定要暴露一个UUID属性,用来做编辑操作.
    uuid: String,
    //  暴露出去一个属性用来显示服务器校验失败错误
    error: Object
  },
  data () {
    return {
      loading: false,
      data: Object.assign({}, dafaultData),
      rules: {
        svrCode: [{ required: true, message: '请输入服务代码!' }],
        note: [{ required: true, message: '请输入服务描述!' }],
        svrClaz: [{ required: true, message: '请输入服务类!' }],
        svrStat: [{ required: true, message: '请选择服务状态!' }]
      }
    }
  },
  watch: {
    uuid (val) {
      this.loadData()
    }
  },
  mounted () {
    //  最开始显示的时候要加载数据
    this.loadData()
  },
  methods: {
    //  因为表单里面没有按钮,所以需要暴露方法
    //  提供一个校验方法 ,
    validate () {
      return this.$refs.form.validate().then(() => this.data)
    },
    //  加载数据方法,如果有UUID,就加载数据,如果没有,就重置表单
    loadData () {
      if (!this.uuid) {
        this.data = Object.assign({}, dafaultData)
        this.loading = false
      } else {
        this.loading = true
        SvrMaintApi.getSvrMaint(this.uuid).then(respData => {
          this.data = respData.data
          this.loading = false
        })
      }
    }
  }
}
</script>
