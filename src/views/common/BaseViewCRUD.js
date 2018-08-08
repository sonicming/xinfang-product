/**
 * 基本CRUD视图功能
 * 组件初始化的时候会把默认数据(table.defaultParams,editor.defaultData) 应用(this.$set)到对应数据中.保证属性相同
 * 如果属性不相同 VUE无法检测属性增减来响应页面(与NG机制不同)
 * 2017年9月29日18:11:55 增加可编辑表格支持
 */
export default {
  data() {
    return {
      table: {
        // 表格
        data: [], // 表格-数据
        params: {}, // 表格-参数 直接代表默认参数
        loading: false, // 表格-加载中?
      },
      editor: {
        // 编辑器
        error: {}, // 编辑器-错误
        data: {}, // 编辑器-数据
        visible: false, // 编辑器-显示
        loading: false, // 编辑器-加载状态
      },
      fastData: null, // 快速编辑时用于存放原始数据
    }
  },
  mounted() {},
  methods: {
    //  API传入 ------------------------------------------

    //  [占位] 加载一条数据
    apiLoadOne(uuid) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    //  [占位] 保存一条数据
    apiSaveOne(data) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    //  [占位] 删除一条数据
    apiDeleteOne(data) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    //  [占位] 查询数据列表
    apiQueryList(params) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },

    //  画面控制 ------------------------------------------

    // 删除数据
    doDelete(index, rowData) {
      this.confirm(rowData) // 提示确认
        .then(this.deleteData) // 然后删除数据
        .then(this.queryData) // 然后查询数据
    },
    // 打开编辑画面
    doEdit(index, rowData) {
      // 打开dialog
      this.editor.visible = true // 显示编辑dialog
      this.editor.loading = true // dialog默认是loading状态
      this.apiLoadOne(rowData.uuid) // 加载一条数据
        .then(this.applyEditData) // 加载到的数据应用到表单中
        .then(this.cancelEditorLoading) //  正常- 取消编辑器加载状态
        .catch(this.cancelEditorLoading) //  异常- 取消编辑器加载状态
    },
    // 打开编辑画面
    doCopy(index, rowData) {
      // 打开dialog
      this.editor.visible = true // 显示编辑dialog
      this.editor.loading = true // dialog默认是loading状态
      this.apiLoadOne(rowData.uuid) // 加载一条数据
        .then(this.applyCopyData) // 加载到的数据应用到表单中
        .then(this.cancelEditorLoading) //  正常- 取消编辑器加载状态
        .catch(this.cancelEditorLoading) //  异常- 取消编辑器加载状态
    },
    // 打开新建画面
    doAdd() {
      // 防止 v-if 控制表单
      this.$refs.editor && this.$refs.editor.reset()
      this.editor.visible = true
      // 新建防止存在UUID
      delete this.editor.data['uuid']
      delete this.editor.data['biztppname']
      delete this.editor.data['bizentname']
    },
    //  提供给表格的事件
    dataTableLoad(params, resolve) {
      this.apiQueryList(params)
        .then(resolve) // 让表格解析你提供的数据 (主要解析页码等)
        .then(this.processTableData) //  处理
        .then(datarows => (this.table.data = datarows)) // 本地也记录一下数据 (提供给表示显示的数据)
    },
    // 加载完成 加工一下数据
    processTableData(resp) {
      let datarows = resp.datarows
      datarows.forEach(data => {
        Object.assign(data, { $editing: false })
      }, this)
      return datarows
    },
    // 重置查询条件
    resetQuery() {
      this.$refs.queryForm.resetFields()
    },
    //  不需要对外 ------------------------------------------

    //  应用一条数据到表单
    applyEditData(respData) {
      Object.assign(this.editor.data, respData.data)
    },
    //  应用一条复制数据
    applyCopyData(respData) {
      Object.assign(this.editor.data, respData.data, { uuid: null })
    },
    //  服务器的校验失败应用到表单上
    applyFormError(error) {
      this.editor.error = error.validError
    },
    // 不显示编辑画面了.
    cancelEditor() {
      this.$refs.editor.reset()
      this.editor.visible = false
    },
    // 编辑画面的loading状态
    cancelEditorLoading() {
      this.editor.loading = false
    },
    // 保存之后
    afterSave() {
      this.cancelEditor()
    },

    //  API调用 ------------------------------------------

    // 执行删除
    deleteData(data) {
      Object.assign(data, { $editing: false })
      return this.apiDeleteOne(data.uuid)
    },
    // 保存数据
    saveData(data) {
      this.editor.loading = true
      this.editor.error = {} // 还原错误信息(必须先还原)
      this.apiSaveOne(data) // 保存数据
        .then(this.queryData) // 查询数据
        .then(this.afterSave) // 保存之后处理
        .catch(this.applyFormError) // 如果服务器校验错误,应用到表单上
        .then(this.cancelEditorLoading) // 最终要取消loading
    },
    //  快速保存数据
    fastSaveData(data) {
      this.table.loading = true
      this.apiSaveOne(data) // 保存数据
        .then(resp => {
          data.$editing = false
          data.uuid = resp.uuid // 快速编辑要求服务器一定要返回编辑的数据的UUID,来同步数据
          this.queryData()
          this.table.loading = false
        })
        .catch(() => {
          this.table.loading = false
        })
    },
    // 关闭快速编辑
    closeFastEdit(data) {
      this.fastData.$editing = false
      Object.assign(data, this.fastData)
      this.fastData = {}
      this.fastEditDataCancel()
    },
    // 快速编辑时进行数据拷贝,方法名可能比较怪异,不要被迷惑,这个方法是用来复制数据到临时空间,方便取消修该的时候还原.
    fastEditData(data) {
      this.fastEditDataCancel()
      data.$editing = true
      this.fastData = Object.assign({}, data)
    },
    // 快速添加数据
    fastAddData() {
      this.fastEditDataCancel()
      let data = Object.assign({ $editing: true }, this.editor.data)
      this.fastEditData(data)
      this.table.data.splice(0, 0, data)
    },
    // 找到没保存的数据 删除之
    fastEditDataCancel() {
      let deleteQueue = []
      this.table.data.forEach(rc => {
        if (!rc.uuid) {
          deleteQueue.push(rc)
        } else if (rc.$editing) {
          this.closeFastEdit(rc)
        }
      })
      deleteQueue.forEach(rc => {
        let index = this.table.data.indexOf(rc)
        this.table.data.splice(index, 1)
      }, this)
    },
    // 查询数据
    queryData() {
      this.$refs.dataTable.load(this.table.params)
    },
  },
}
