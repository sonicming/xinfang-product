<template>
  <div v-loading="view.loading" element-loading-text="服务器受理中...">
    <el-form ref="pwForm" :model="form" :rules="formRules" label-position="top" :show-message="false" status-icon>
      <el-form-item label="原密码" prop="oldpasswd">
        <el-input type="password" v-model="form.oldpasswd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="passwd">
        <el-input type="password" v-model="form.passwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repasswd">
        <el-input type="password" v-model="form.repasswd"></el-input>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span='24' style='text-align: center;margin-bottom: 10px;'>
        <el-button @click="submit" type="primary" size='small'>确认修改</el-button>
        <el-button @click="cancel" size='small'>取消修改</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AcesAPI from "@/api/base/sysm/AcesAPI";

export default {
  data() {
    let validateNewpass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else {
        if (value.length < 6) {
          callback(new Error("密码长度至少6位"));
        }
        if (this.form.repasswd !== "") {
          this.$refs.pwForm.validateField("repasswd");
        }
        callback();
      }
    };
    let validateReNewpass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.passwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        oldpasswd: "",
        passwd: "",
        repasswd: ""
      },
      view: {
        loading: false
      },
      formRules: {
        oldpasswd: [{ required: true, min: 6 }],
        passwd: [{ required: true, validator: validateNewpass }],
        repasswd: [{ required: true, validator: validateReNewpass }]
      }
    };
  },
  computed: {
    ...mapGetters(["sysLogin"])
  },
  methods: {
    submit() {
      this.$refs.pwForm.validate(validate => {
        if (validate) {
          this.view.loading = true;
          AcesAPI.changePwd(this.form.oldpasswd, this.form.passwd)
            .then(data => {
              this.view.loading = false;
              this.$store.dispatch("base/logout").then(() => {
                this.$router.replace("/login");
              });
            })
            .catch(() => {
              this.view.loading = false;
            });
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>
