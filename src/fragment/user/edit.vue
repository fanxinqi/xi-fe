<style>
.head {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
</style>

<template>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="账号" prop="name">
            <Input v-model="formData.name" placeholder="请输入你的姓名"></Input>
        </FormItem>
        <FormItem label="密码" prop="passWord">
            <Input v-model="formData.passWord" placeholder="请输入你的电话"></Input>
        </FormItem>
        <FormItem label="角色" prop="roleId">
            <Select v-model="formData.roleId" placeholder="请选择角色">
                <Option v-for="role in formData.roleList " :value="role.id" >{{role.des}}</Option>
            </Select>
        </FormItem>
        <FormItem label="店铺" prop="storeId">
            <Select v-model="formData.storeId" placeholder="请选择店铺">
                <Option v-for="store in formData.storeList " :value="store.id" >{{store.name}}</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">保存</Button>
        </FormItem>
    </Form>
</template>
<script>
import { util } from "../../lib/tools";
export default {
  props: ["formData"],
  data() {
    return {
      ruleValidate: {
        name: [{ required: true, message: "姓名不能为空", trigger: "change" }],
        passWord:[{ required: true, message: "密码不能为空", trigger: "change" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("proxyAction", {
              name: "user-save",
              queries: null,
              data: this.formData,
              param: null
            })
            .then(res => {
              this.$store.dispatch("reload", {
                routeName: this.$route.name
              });
            });
        } else {
          this.$Message.error("验证失败!");
        }
      });
    }
  }
};
</script>
