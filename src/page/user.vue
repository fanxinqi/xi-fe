<style lang="less">

</style>
<template>
    <div class="member">
        <div class="search-bar">
            <Form :model="searchData" :label-width="80" inline>
                <FormItem label="账号名">
                    <Input v-model="searchData.name" placeholder="请输入账号名..."></Input>
                </FormItem>
                
                <FormItem label="">
                    <Button type="primary" @click="searchHandler()">搜索</Button>
                </FormItem>
                <FormItem label="">
                    <Button type="primary" @click="add()">添加账号</Button>
                </FormItem>
            </Form>
        </div>
        <Smart-table :columns="columns7" :data="data.userList.content" :total="tabel.total" :show-page="true" :current-page="data.userList.number+1" @on-page-change="pageChange" default-value="-"></Smart-table>
        <Modal v-model="show" title="编辑账号" okText="" cancelText="">
           <user-edit :form-data="formData"></user-edit>  
        </Modal>
    </div>
   
</template>

<script>
import Cookies from "js-cookie";
import userEdit from "../fragment/user/edit.vue";
export default {
  props: ["data"],
  data() {
    return {
      searchData: {
        name: ""
      },
      tabel: {
        total: parseInt(this.data.userList.totalElements)
      },
      formData: {
        name: "",
        passWord: "",
        storeId: 1,
        roleId: 1,
        storeList:this.data.storeList,
        roleList:this.data.roleList
      },
      show: false,
      columns7: [
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "密码",
          key: "passWord"
        },
        {
          title: "角色",
          key: "roleId",
          render: (h, params) => {
            const row = params.row;
            const roleDes = this.data.roleList.filter(item => {
              return item.id == row.roleId;
            })[0].des;
            return <span>{roleDes}</span>;
          }
        },
        {
          title: "店铺",
          key: "roleId",
          render: (h, params) => {
            const row = params.row;
            const storeName = this.data.storeList.filter(item => {
              return item.id == row.storeId;
            })[0].name;
            return <span>{storeName}</span>;
          }
        },
        {
          key: "userId",
          title: "操作",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const edit = () => {
              this.formData = Object.assign(this.formData, row);
              this.show = true;
            };
            const reset = () => {
              this.reset(row);
            };
            const select = () => {
              this.selectClass(row);
            };
            return (
              <span class="setting-buttons">
                <a href="javascript:;"
                  style="margin-right:10px;"
                  onClick={edit}>
                  修改
                </a>
              </span>
            );
          }
        }
      ]
    };
  },
  components: {
    userEdit
  },
  methods: {
    pageChange(){

    },
    clear() {
      this.formData =Object.assign(this.formData,{
        name: "",
        passWord: "",
        storeId: 1,
        roleId: 1
      });
    },
    add() {
      this.clear();
      this.show = true;
    }
  }
};
</script>

<style>

</style>
