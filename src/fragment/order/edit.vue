<template>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">

        {{formData}}
        <FormItem label="手机号" prop="phone">
            <Input v-model="formData.phone" placeholder="请输入你的手机号"></Input>
        </FormItem>
        <FormItem label="总价格" prop="totalPrice">
            <Input v-model="formData.totalPrice" placeholder="请输入总价格"></Input>
        </FormItem>
        <FormItem label="总数量" prop="totalNum">
            <Input v-model="formData.totalNum" placeholder="请输入总数量"></Input>
        </FormItem>
        <!--<Smart-table :columns="columns7" :data="formData.categoryEntitySet" :total="tabel.total" :show-page="true"-->
                     <!--:current-page="data.orderList.number+1" @on-page-change="pageChange"-->
                     <!--default-value="-"></Smart-table>-->


        <Table height="200" :columns="columns1" :data="formData.categoryEntitySet"></Table>



















        <FormItem label="订单相关图片" >
            <div class="demo-upload-list" v-for="item in formData.imageSet">
                <template>
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
            </div>
            <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="formData.imageSet"
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
            <Modal title="View Image" v-model="visible" class="view-image">
                <img :src="bigImgUrl" v-if="visible" style="width: 100%">
            </Modal>
        </FormItem>
        <FormItem label="支付方式" >
            <Select v-model="formData.paymentEntity.id" placeholder="请选择支付方式">
                <Option v-for="pay in formData.paySet " :value="pay.id">{{pay.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="订单状态">
            <Select v-model="formData.stateEntity.id" placeholder="请选择订单状态">
                <Option v-for="state in formData.stateSet " :value="state.id">{{state.name}}</Option>
            </Select>
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
                    phone: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' }
                    ],
                    totalPrice: [
                        { required: true, message: '价格不能为空', trigger: 'blur' }
                    ],
                    des: [
                        { required: true, message: '店铺描述不能为空', trigger: 'blur' }
                    ],

                },
                bigImgUrl: '',
                visible: false,
                columns1: [
                    {
                        title: '衣物名称',
                        key: 'name'
                    },
                    {
                        title: '衣物价格',
                        key: 'price'
                    }
                    ,
                    {
                        title: '操作',
                        key: 'id',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            const row = params.row;
                            const edit = () => {
                                this.formData = Object.assign(this.formData, row);
                                if (!this.formData.paymentEntity) {
                                    this.formData.paymentEntity
                                        = {
                                        id: 0,
                                        name: ""
                                    }
                                }
                                if (!this.formData.stateEntity) {
                                    this.formData.stateEntity = {
                                        id: 0,
                                        name: ""
                                    }
                                }
                                this.show = true;
                            };
                            const reset = () => {
                                this.reset(row);
                            };
                            const select = () => {
                                this.selectClass(row);
                            };
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            edit()
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let id = row.id;
                                            this.deleteHandler(id)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data2: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    },
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
            }
        },
        methods: {
            handleSubmit () {
                this.$refs["formData"].validate((valid) => {
                    if (valid) {
                        let actionName="saveOrder";
                        if(this.formData.id){
                            actionName="updateClothesOrder";
                        }
                        let postData=util.clone(this.formData);
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
                var imageEntity={
                    url:res.data.url,
                    id:res.data.id,
                }
                this.formData.imageSet.push(imageEntity)
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
            },
            handleView (url) {
                this.bigImgUrl = url;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.formData.imageSet;
                this.formData.imageSet.splice(fileList.indexOf(file), 1);
            },
            // handleSuccess (res, file) {
            //     file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            //     file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            // },
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
        }
    }
</script>

<style  lang="less">
    .view-image{
        .ivu-modal-wrap{
            z-index: 10000 !important;
        }
    }
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

</style>