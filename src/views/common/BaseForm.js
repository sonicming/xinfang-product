import { mapGetters } from "vuex";
import BaseViewCRUD from "../common/BaseViewCRUD";
/**
 * 基本表单功能
 * 在提交之前,可以注册 preSubmit 来后处理(整理)你的数据,比如[]转字符串
 */
export default {
  mixins: [BaseViewCRUD],
  computed: {},
  props: {
    data: {
      type: Object
    },
    error: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    // 数据提交之前处理
    preSubmit(data) {
      return data;
    },
    // 提交方法
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 拷贝一份.
          let data = JSON.parse(JSON.stringify(this.data));
          // 通知调用者,处理下提交方法
          this.$emit("submit", data);
        }
      });
    },
    // 取消方法
    cancel() {
      this.$refs.form.resetFields();
      this.$emit("cancel");
    },
    // 重置方法
    reset() {
      this.$refs.form.resetFields();
    }
  }
};
