<template>
    <!--<div>-->
        <!--<Row class="expand-row">-->
            <!--<Col span="8">-->
             <!--<span class="expand-key">Job: </span>-->
             <!--<span class="expand-value">{{ row.job }}</span>-->
            <!--</Col>-->
            <!--<Col span="8">-->
            <!--<span class="expand-key">Interest: </span>-->
            <!--<span class="expand-value">{{ row.interest }}</span>-->
            <!--</Col>-->
            <!--<Col span="8">-->
            <!--<span class="expand-key">Birthday: </span>-->
            <!--<span class="expand-value">{{ row.birthday }}</span>-->
            <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
            <!--<Col span="8">-->
            <!--<span class="expand-key">Favorite book: </span>-->
            <!--<span class="expand-value">《{{ row.book }}》</span>-->
            <!--</Col>-->
            <!--<Col span="8">-->
            <!--<span class="expand-key">Favorite movie: </span>-->
            <!--<span class="expand-value">{{ row.movie }}</span>-->
            <!--</Col>-->
            <!--<Col span="8">-->
            <!--<span class="expand-key">Favorite music: </span>-->
            <!--<span class="expand-value">{{ row.music }}</span>-->
            <!--</Col>-->
        <!--</Row>-->
    <!--</div>-->
    <Table   :data="row.appendixEntitySet"></Table>
</template>

<script>
    export default {
        props: {
            row: Object
        },

        data () {
            return {
                columns1: [
                    {
                        title: '附件名称',
                        key: 'name'
                    },
                    {
                        title: '描述',
                        key: 'des'
                    },
                    {
                        title: '当前状态',
                        key: "stateEntity",
                        render:(h,params)=>{
                            const row = params.row;
                            return (<span>{row.name}</span>);
                        }
                    }
                    ,
                    {
                        title: '操作',
                        key: 'id',
                        width: 150,
                        align: 'center',
                        // render: (h, params) => {
                        //     const row = params.row;
                        //     const edit = () => {
                        //         this.formData = Object.assign(this.formData, row);
                        //         if (!this.formData.paymentEntity) {
                        //             this.formData.paymentEntity = {
                        //                 id: 0,
                        //                 name: ""
                        //             }
                        //         }
                        //         if (!this.formData.stateEntity) {
                        //             this.formData.stateEntity = {
                        //                 id: 0,
                        //                 name: ""
                        //             }
                        //         }
                        //         this.show = true;
                        //     };
                        //     const reset = () => {
                        //         this.reset(row);
                        //     };
                        //     const select = () => {
                        //         this.selectClass(row);
                        //     };
                        //     return h('div', [
                        //         h('Button', {
                        //             props: {
                        //                 type: 'info',
                        //                 size: 'small'
                        //             },
                        //             style: {
                        //                 marginRight: '5px'
                        //             },
                        //             on: {
                        //                 click: () => {
                        //                     edit()
                        //                 }
                        //             }
                        //         }, '编辑'),
                        //         h('Button', {
                        //             props: {
                        //                 type: 'warning',
                        //                 size: 'small'
                        //             },
                        //             on: {
                        //                 click: () => {
                        //                     let id = row.id;
                        //                     this.deleteHandler(id)
                        //                 }
                        //             }
                        //         }, '删除')
                        //     ]);
                        // }
                    }
                ]
            }
        },
    };
</script>

<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>