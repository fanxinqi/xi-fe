<style lang="less">

</style>

<template>
    <div class="order">
        {{data}}
       order
        <Smart-table :columns="columns7" :data="data.content" :total="tabel.total" :show-page="true" :current-page="data.number+1" @on-page-change="pageChange" default-value="-"></Smart-table>
        <Modal v-model="show" :title="title" okText="" cancelText="">
            <store-edit :form-data="formData"></store-edit>
        </Modal>
    </div>
</template>

<script>
    import Cookies from "js-cookie";
    import storeEdit from "../fragment/store/edit.vue";
export default {
    props:["data"],
    data() {
        return {
            searchData: {
                name: "",
            },
            tabel:{
                total:parseInt(this.data.totalElements)
            },
            formData: {
                name: "",
                address: "",
                des:"",
                imageEntity:{
                    url:"",
                    id:""
                },
                storeLaundryExpertSet:[]
            },
            show: false,
            columns7: [
                {
                    title: "店铺名",
                    key: "name"
                },
                {
                    title: "logo",
                    key: "imageEntity.url",
                    render:(h, params) =>{
                        return h('img',{
                            attrs:{
                                class:"logo",
                                src:params.row.imageEntity.url
                            }
                        });
                    }
                },
                {
                    title: "地址",
                    key: "address"
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
                            if(!this.formData.imageEntity)
                            {
                                this.formData.imageEntity={
                                    url:"",
                                    id:""
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
                                        let id=row.id;
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
};
</script>

<style>

</style>
