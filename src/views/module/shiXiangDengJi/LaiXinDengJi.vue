<template>
  <el-row>
    <el-col>
      <el-card>
        <template slot="header" shadow="always">
          <span>信访人信息</span>
        </template>
        <el-form ref="form" :model="form" :inline="true" label-width="80px" label-suffix=":">
          <el-form-item label="姓名">
            <el-input v-model="form.name" placeholder="请输入内容">
              <el-button slot="append" size="medium" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="是否匿名">
            <el-checkbox v-model="form.isNiMing"></el-checkbox>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model=" form.phone" placeholder="请输入内容">
            </el-input>
          </el-form-item>
          <el-form-item label="住址">
            <AddressSelector></AddressSelector>
          </el-form-item>
        </el-form>
        <el-form ref="form" :model="form" :inline="true" label-width="80px" label-suffix=":">
          <el-form-item label="信件来源">
            <XinJianLaiYuanSelector></XinJianLaiYuanSelector>
          </el-form-item>
          <el-form-item label="身份">
            <el-input v-model=" form.phone" placeholder="请输入内容">
            </el-input>
          </el-form-item>
          <el-form-item label="受信人">
            <AddressSelector></AddressSelector>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col>
      <el-card>
        <template slot="header" shadow="hover">
          <span>信访详情</span>
        </template>
        <el-form ref="form" :model="form" label-width="80px">

        </el-form>
      </el-card>
    </el-col>
    <el-col>
      <el-card>
        <template slot="header" shadow="hover">
          <span>概况</span>
        </template>
        <el-form ref="form" :model="form" label-width="80px">

        </el-form>
      </el-card>
    </el-col>
    <el-col>
      <el-card>
        <template slot="header" shadow="hover">
          <span>办理区域</span>
        </template>
        <el-form ref="form" :model="form" label-width="80px">

        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import AddressSelector from "@/components/custom/AddressSelector";
import XinJianLaiYuanSelector from "@/components/custom/XinJianLaiYuanSelector";
export default {
  name: "LaiXinDengJi",
  components: { AddressSelector, XinJianLaiYuanSelector },
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>