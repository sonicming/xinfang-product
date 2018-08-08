import moment from "moment";

/**
 * 基本CRUD视图功能
 */
export default {
  computed: {
    sysCode() {
      return this.$store.state.base.sysCode;
    }
  },
  methods: {
    /**
     * 时间列格式化
     */
    formatterDate(row, column, cellValue) {
      return cellValue ? moment(cellValue).format("L") : null;
    },
    formatterDateTime(row, column, cellValue) {
      return cellValue
        ? moment(cellValue).format("L") + "  " + moment(cellValue).format("LTS")
        : null;
    },
    /**
     * 使用确认框
     */
    confirm(data, txt = "您确定要这样做么?") {
      return this.$confirm(txt, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => data);
    }
  }
};
