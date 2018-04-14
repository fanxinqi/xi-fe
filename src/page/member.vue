<style lang="less">

</style>

<template>
    <div class="member">
        <Smart-table :columns="columns7" :data="data.data" total="10" :show-page="true" :current-page="1" @on-page-change="pageChange" default-value="-"></Smart-table>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        props:["data"],
        data(){
          return {
                columns7: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '电话',
                        key: 'phone'
                    },
                    {
                        title: '会员类型',
                        key: 'des'
                    },
                    {
                        title: '身份证号',
                        key: 'idNum',
                    
                    }
                ]
            }
        },
        methods:{
            pageChange(){

            }
        }
    };
</script>

<style>

</style>
