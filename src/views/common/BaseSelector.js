import Emitter from 'element-ui/lib/mixins/emitter'
import SysAPI from '../../api/base/sysm/SysAPI'
/**
 * 选择器基础类
 */
export default {
  mixins: [Emitter],
  data() {
    return {
      table: {
        // 表格
        data: [], // 表格-数据
        params: {}, // 表格-参数 直接代表默认参数
      },
    }
  },
  methods: {
    /**
     * 查询数据,要传递类型,和参数
     * @param {String} params
     */
    apiQuery(params) {
      let dataType = this.dataType
      return SysAPI.querySelectorData(dataType, params)
    },
    /**
     *  响应选中 一条
     * @param {Object} row
     */
    selectTableRow(row) {
      // 如果在 EtSelector 中包裹,要通知
      this.dispatch('EtSelector', 'selectTableRow', row)
      this.$emit('select', row)
    },
    /**
     * 响应选中 一组
     * @param {Array} selection
     */
    selectTable(selection) {
      // 如果在 EtSelector 中包裹,要通知
      this.dispatch('EtSelector', 'selectTable', [selection])
      this.$emit('select', [selection])
    },
    // 提供给表格的事件
    dataTableLoad(params, resolve) {
      this.apiQuery(params)
        .then(resolve) // 让表格解析你提供的数据 (主要解析页码等)
        .then(datarows => (this.table.data = datarows)) // 本地也记录一下数据 (提供给表示显示的数据)
        .catch(resolve)
    },
    // 查询数据
    queryData() {
      this.$refs.dataTable.load(this.table.params)
    },
    // 重置查询条件
    resetQuery() {
      this.$refs.queryForm.resetFields()
    },
  },
}
