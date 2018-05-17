<style lang="less">

</style>

<template>
    <div class="order">
        <!--{{data}}-->
        <div class="search-bar">
            <Form :model="searchData" inline>
                <FormItem label="订单手机号" :label-width="80">
                    <Input v-model="searchData.name" placeholder="请输入订单手机号"></Input>
                </FormItem>
                <FormItem label="">
                    <Button type="success" @click="searchHandler()">搜索</Button>
                </FormItem>
            </Form>
        </div>

        <Smart-table :columns="columns7" :data="data.orderList.content" :total="tabel.total" :show-page="true"
                     :current-page="data.orderList.number+1" @on-page-change="pageChange"
                     default-value="-"></Smart-table>
        <Modal v-model="show" title="编辑店铺" okText="" cancelText="">
            <order-edit :form-data="formData"></order-edit>
        </Modal>
    </div>
</template>

<script>
    import Cookies from "js-cookie";
    import orderEdit from "../fragment/order/edit.vue";

    export default {
        props: ["data"],
        data() {
            return {
                searchData: {
                    phone: "",
                },
                tabel: {
                    total: parseInt(this.data.orderList.totalElements)
                },
                formData: {
                    phone: "",
                    storageNum: 0,
                    des: "",
                    categoryEntitySet: [],
                    stateEntity: {
                        id: 0,
                        name: ""
                    },
                    orderId: "",
                    imageSet: [],
                    totalNum: 0,
                    totalPrice: 0,
                    paymentEntity: {
                        id: 0,
                        name: ""
                    },
                    paySet: this.data.paymentList,
                    stateSet: this.data.stateList,
                },
                show: false,
                columns7: [
                    {
                        title: "订单号",
                        key: "orderId"
                    },
                    {
                        title: "手机号",
                        key: "phone",
                    },
                    {
                        title: "件数(单位件)",
                        key: "totalNum",
                    },
                    {
                        title: "金额(单位元)",
                        key: "totalPrice",
                    },
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
                ]
            };
        },
        components: {
            orderEdit
        },
        methods: {
            pageChange(page) {
                this.$store.dispatch("reload", {
                    routeName: this.$route.name,
                    query: {name: this.searchData.name, page: page - 1}
                })
            },
            searchHandler() {
                this.$store.dispatch("reload", {
                    routeName: this.$route.name,
                    query: {name: this.searchData.name}
                })
            },
            deleteHandler(id) {
                this.$store
                    .dispatch("proxyAction", {
                        name: "deleteStoreById",
                        queries: null,
                        data: {
                            id: id
                        },
                        param: null,
                        message: false
                    })
                    .then(res => {
                        this.$store.dispatch("reload", {
                            routeName: this.$route.name
                        })
                    });
            },

            edit() {
                this.show = true;
            },
            add() {
                (this.formDat = {
                    name: "",
                    address: "",
                    des: "",
                    imageEntity: {
                        url: "",
                        id: ""
                    },
                    storeLaundryExpertSet: []

                }),
                    (this.show = true);
            }
        }
    };
</script>

<style>

</style>
