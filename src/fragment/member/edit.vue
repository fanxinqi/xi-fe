<style>
   .head{
    height: 50px;
    width: 50px;
    border-radius: 50%;
   }
   
</style>

<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入你的姓名"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入你的电话"></Input>
        </FormItem>
        <FormItem label="类型" prop="memberCategoryId">
            <Select v-model="formValidate.memberCategoryId" placeholder="请选择会员类型">
                <Option v-for="member in formData.memberCategoryEntity " :value="member.id">{{member.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="头像">
               <img :src="formValidate.headUrl" class="head">
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
        <!-- <Modal title="View Image" v-model="visible">
            <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
        </Modal> -->
        </FormItem>
        <FormItem label="性别" prop="gender">
            <RadioGroup v-model="formValidate.gender">
                <Radio label="1">男</Radio>
                <Radio label="2">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="生日" prop="birthday">
            <DatePicker type="date" placeholder="请选择生日" v-model="formValidate.birthday" ></DatePicker>
        </FormItem>
        <FormItem label="身份证号" prop="idNum">
            <Input v-model="formValidate.idNum" placeholder="请输入身份证号码"></Input>
        </FormItem>
        <FormItem label="地址" prop="address">
            <Input v-model="formValidate.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="描述" prop="des">
            <Input v-model="formValidate.des" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        </FormItem>
    </Form>
</template>
<script>
import {util} from '../../lib/tools';
    export default {
        props:["formData"],
        data () {
            return {
                formValidate: this.formData,
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '电话不能为空', trigger: 'blur' },
                    ],
                    member_category_id: [
                        { required: true, message: '会员类型必填', trigger: 'change' }
                    ]
                },
                headeUrl:"",
            }
        },
        methods: {
            handleSubmit () {
                this.$refs["formValidate"].validate((valid) => {
                    if (valid) {
                        let actionName="saveMember";
                        if(this.formValidate.id){
                            actionName="updateMember";
                        }
                        let postData=util.clone(this.formValidate);
                        postData.birthday= new Date(postData.birthday).getTime();
                        this.$store.dispatch('proxyAction',{
                             'name': actionName,
                             'queries': null,
                             'data':postData,
                             'param': null
                        }).then((res)=>{
                             this.$store.dispatch("reload",{
                                 routeName:this.$route.name
                             })
                        });
                
                    } else {
                        this.$Message.error('验证失败!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            handleSuccess (res, file) {
                this.formValidate.headUrl=res.data.url;
            },
             handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload () {
                // const check = this.uploadList.length < 5;
                // if (!check) {
                //     this.$Notice.warning({
                //         title: 'Up to five pictures can be uploaded.'
                //     });
                // }
                // return check;
            }
        }
    }
</script>
