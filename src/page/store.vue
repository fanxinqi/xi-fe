<style lang="less">
.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>

<template>
    <div class="store">
        <div class="search-bar">
            <Form :model="searchData"  inline>
                <FormItem label="店铺名称" :label-width="80">
                    <Input v-model="searchData.name" placeholder="请输入店铺名称"></Input>
                </FormItem>
                <FormItem label="">
                    <Button type="success" @click="searchHandler()">搜索</Button>
                </FormItem>
                <FormItem label="">
                    <Button type="primary" @click="add()">添加店铺</Button>
                </FormItem>
            </Form>
        </div>
        <Smart-table :columns="columns7" :data="data.content" :total="tabel.total" :show-page="true" :current-page="data.number+1" @on-page-change="pageChange" default-value="-"></Smart-table>
        <Modal v-model="show" title="编辑店铺" okText="" cancelText="">
            <store-edit :form-data="formData"></store-edit>
        </Modal>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import storeEdit from "../fragment/store/edit.vue";
export default {
  props: ["data"],
  data() {
    return {
      searchData: {
        name: ""
      },
      tabel: {
        total: parseInt(this.data.totalElements)
      },
      formData: {
        name: "",
        address: "",
        des: "",
        imageEntity: {
          url: "",
          id: ""
        },
        storeLaundryExpertSet: []
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
          render: (h, params) => {
            const row = params.row;
            return h("img", {
              attrs: {
                class: "logo",
                src: row.imageEntity ? row.imageEntity.url : ""
              }
            });
          }
        },
        {
          title: "地址",
          key: "address"
        },
        {
          title: "操作",
          key: "id",
          width: 150,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const edit = () => {
              this.formData = Object.assign(this.formData, row);
              if (!this.formData.imageEntity) {
                this.formData.imageEntity = {
                  url: "",
                  id: ""
                };
              }
              this.show = true;
            };
            const reset = () => {
              this.reset(row);
            };
            const select = () => {
              this.selectClass(row);
            };
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      edit();
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      let id = row.id;
                      this.deleteHandler(id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  components: {
    storeEdit
  },
  methods: {
    pageChange(page) {
      debugger;
      this.$store.dispatch("reload", {
        routeName: this.$route.name,
        query: { name: this.searchData.name, page: page - 1 }
      });
    },
    searchHandler() {
      this.$store.dispatch("reload", {
        routeName: this.$route.name,
        query: { name: this.searchData.name }
      });
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
          });
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
