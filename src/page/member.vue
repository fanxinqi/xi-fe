<style lang="less">

</style>
<template>
    <div class="member">
        <div class="search-bar">
            <Form :model="searchData" :label-width="80" inline>
                <FormItem label="电话">
                    <Input v-model="searchData.phone" placeholder="请输入电话号码..."></Input>
                </FormItem>
                  <FormItem label="会员姓名">
                    <Input v-model="searchData.name" placeholder="请输入会员姓名..."></Input>
                </FormItem>
                <FormItem label="">
                    <Button type="primary" @click="searchHandler()">搜索</Button>
                </FormItem>
                <FormItem label="">
                    <Button type="primary" @click="add()">添加会员</Button>
                </FormItem>
            </Form>
        </div>
        <Smart-table :columns="columns7" :data="data.memberEntity.content" :total="tabel.total" :show-page="true" :current-page="data.memberEntity.number+1" @on-page-change="pageChange" default-value="-"></Smart-table>
        <Modal v-model="show" title="编辑会员" okText="" cancelText="">
           <member-edit :form-data="formData"></member-edit>  
        </Modal>
    </div>
   
</template>

<script>
import Cookies from "js-cookie";
import memberEdit from "../fragment/member/edit.vue";
export default {
  props: ["data"],
  data() {
    return {
      searchData: {
        name: "",
        phone: ""
      },
      tabel:{
          total:parseInt(this.data.memberEntity.totalElements)
      },
      formData: {
        name: "",
        phone: "",
        memberCategoryId: 0,
        idNum: "",
        headUrl: "",
        birthday: "",
        address: "",
        desc: "",
        memberCategoryEntity: this.data.memberCategoryEntity
      },
      show: false,
      columns7: [
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "电话",
          key: "phone"
        },
        {
          title: "会员类型",
          key: "des"
        },
        {
          title: "身份证号",
          key: "idNum"
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
                <a
                  href="javascript:;"
                  style="margin-right:10px;"
                  onClick={edit}
                >
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
    memberEdit
  },
  methods: {
    pageChange() {},
    searchHandler() {},

    edit() {
      this.show = true;
    },
    add() {
      (this.formDat = {
        name: "",
        phone: "",
        memberCategoryId: 0,
        idNum: "",
        headUrl: "",
        birthday: "",
        address: "",
        desc: "",
        memberCategoryEntity: this.data.memberCategoryEntity
      }),
        (this.show = true);
    }
  }
};
</script>

<style>

</style>
