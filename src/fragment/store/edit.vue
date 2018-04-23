<template>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="店铺名称" prop="name">
            <Input v-model="formData.name" placeholder="请输入你的店铺名称"></Input>
        </FormItem>
        <FormItem label="头像">
            <img :src="formData.imageEntity.url" class="head">
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


        <FormItem label="地址" prop="address">
            <Input v-model="formData.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入店铺地址"></Input>
        </FormItem>
        <FormItem label="描述" prop="des">
            <Input v-model="formData.des" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入店铺描述"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">保存</Button>
        </FormItem>
    </Form>
</template>

<script>
    import {util} from '../../lib/tools';
    export default {
        props:["formData"],
        data () {
            return {
                ruleValidate: {
                    name: [
                        { required: true, message: '店铺名称不能为空', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '店铺地址不能为空', trigger: 'blur' }
                    ],
                    des: [
                        { required: true, message: '店铺描述不能为空', trigger: 'blur' }
                    ],

                },
            }
        },
        methods: {
            handleSubmit () {
                this.$refs["formData"].validate((valid) => {
                    if (valid) {
                        let actionName="saveStore";
                        if(this.formData.id){
                            actionName="updateStore";
                        }
                        let postData=util.clone(this.formData);
                        if(!postData.imageEntity.id)
                        {
                            postData.imageEntity=null;
                        }
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
                this.formData.imageEntity.url=res.data.url;
                this.formData.imageEntity.id=res.data.id;
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

<style scoped>
    .head{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

</style>