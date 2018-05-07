<style>
.head {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
</style>

<template>
    <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="分类名" prop="name">
            <Input v-model="formData.name" placeholder="请输入你的名字"></Input>
        </FormItem>
        <FormItem label="图片">
            <img :src="formData.imageEntity.url" v-if="formData.imageEntity.url" class="head">
            <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="/api/attachment/upload"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
        </FormItem>
        <FormItem label="价格" prop="price">
            <Input v-model="formData.price" placeholder="请输入价格"></Input>
        </FormItem>
        <FormItem label="描述" prop="des">
            <Input v-model="formData.des" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入相关描述"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        </FormItem>
    </Form>
</template>
<script>
import { util } from "../../lib/tools";
export default {
  props: ["formData"],
  data() {
    return {
      formValidate: this.formData || { name: "", img: "", price: "", des: "",parentId:0 },
      ruleValidate: {
        name: [{ required: true, message: "分类名不能为空", trigger: "blur" }],
        price: [{ required: true, message: "价格不能为空" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          let actionName = "saveCategory";
          if (this.formData.id) {
            actionName = "updateCategory";
          }
          let postData = util.clone(this.formData);
          if(!postData.imageEntity.id){
            delete postData.imageEntity;
          }
          this.$store.dispatch("proxyAction", {
              name: actionName,
              queries: null,
              data: postData,
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
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleSuccess(res, file) {
      this.formData.imageEntity.url = res.data.url;
      this.formData.imageEntity.id=res.data.id;
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
    },
    handleBeforeUpload() {}
  }
};
</script>
