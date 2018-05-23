<style>
.head {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
</style>

<template>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="姓名" prop="name">
            <Input v-model="formData.name" placeholder="请输入你的姓名"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
            <Input v-model="formData.phone" placeholder="请输入你的电话"></Input>
        </FormItem>
        <FormItem label="类型" prop="memberCategoryId">
            <Select v-model="formData.memberCategoryId" placeholder="请选择会员类型">
                <Option v-for="member in formData.memberCategoryEntity " :value="member.id" >{{member.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="头像">
               <img :src="formData.headUrl" v-if="formData.headUrl" class="head">
            <Upload
        ref="upload"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        multiple
        type="drag"
        action="/api/attachment/upload"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
        </div>
    </Upload>
        <!-- <Modal title="View Image" v-model="visible">
            <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
        </Modal> -->
        </FormItem>
        <FormItem label="性别">
            <RadioGroup v-model="formData.gender">
                <Radio  label="男"></Radio>
                <Radio  label="女"></Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="生日" prop="birthday">
            <DatePicker type="date" placeholder="请选择生日" v-model="parseDate" ></DatePicker>
        </FormItem>
        <FormItem label="身份证号" prop="idNum">
            <Input v-model="formData.idNum" placeholder="请输入身份证号码"></Input>
        </FormItem>
        <FormItem label="地址" prop="address">
            <Input v-model="formData.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入地址"></Input>
        </FormItem>
        <FormItem label="描述" prop="des">
            <Input v-model="formData.des" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述"></Input>
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
      parseDate: this.formData.birthday
        ? new Date(parseInt(this.formData.birthday))
        : new Date(),
      ruleValidate: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        phone: [{ required: true, message: "电话不能为空", trigger: "blur" }],
        // memberCategoryId: [
        //   { required: true, message: "会员类型必填", trigger: "change" }
        // ]
      },
      headeUrl: ""
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let actionName = "saveMember";
          if (this.formData.id) {
            actionName = "updateMember";
          }
          let postData = util.clone(this.formData);

          postData.birthday = this.parseDate.getTime();

          // formData.birthday
          this.$store
            .dispatch("proxyAction", {
              name: actionName,
              queries: null,
              data: postData,
              param: null
            })
            .then(res => {
               this.$emit('update',postData)
              // this.$store.dispatch("reload", {
              //   routeName: this.$route.name
              // });
            });
        } else {
          this.$Message.error("验证失败!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleSuccess(res, file) {
      this.formData.headUrl = res.data.url;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    }
  }
};
</script>
