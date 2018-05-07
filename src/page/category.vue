<style lang="less">
.tree-header{
  padding: 20px 0px;
}
.categroy-tree {
  // overflow-y: auto;
  background: #ffffff;
  padding: 20px;
  .ivu-tree-arrow {
    cursor: pointer;
    font-size: 25px !important;
    line-height: 60px !important;
    width: 26px !important;
    height: 60px !important;
    vertical-align: top;
    text-align: center;
    display: inline-block;
  }
  .icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    &.hide {
      display: none;
    }
  }
  .cell {
    height: 60px;
    line-height: 60px;
    display: inline-block;
    vertical-align: top;
    font-size: 16px;

    padding: 0px 95px;
    width: 100px;
  }
  .ivu-btn-small {
    // padding: 4px 20px !important;
    // border-radius: 50% !important;
    // font-size: 30px !important;
  }
  .ivu-tree-children {
    .row {
      border-bottom: 1px solid #e9eaec;
      &:hover {
        background: #f8f8f9;
      }
      .first {
        font-weight: bold;
     
        .cell {
          font-size: 18px !important;
          padding: 0;
        }
      }
    }
  }
}
</style>

<template>
<div>
    <div class="tree-header">
        <Button type="primary" @click="add">添加一级分类</Button>
    </div>
    <Tree :data="treeData" :render="renderContent" class="categroy-tree"></Tree>
    <Modal v-model="show" title="编辑分类" okText="" cancelText="">
        <category-edit :form-data="formData"></category-edit>  
    </Modal>
</div>
</template>
<script>
import categoryEdit from "../fragment/category/edit.vue";
export default {
  props: ["data"],
  data() {
    return {
      show: false,
      formData: {
        id: "",
        parentId: "",
        name: "",
        price: 0,
        des: "",
        imageEntity: {
          id: "",
          url: ""
        }
      },
      treeDataSource: this.data.content,
      buttonProps: {
        // type: "ghost",
        // size: "small"
      }
    };
  },
  computed: {
    treeData() {
      return this.parase(this.treeDataSource);
    }
  },
  components: {
    categoryEdit
  },
  methods: {
    parase(sourceData) {
      let targeTreeData = [];
      sourceData.forEach(item => {
        targeTreeData.push({
          title: item.name,
          id: item.id,
          parentId: item.parentId,
          imageEntity: item.imageEntity,
          price: item.price,
          des:item.des,
          expand: true,
          children: this.parase(item.childrenClothesCategoryEntitySet)
        });
      });
      return targeTreeData;
    },

    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          attrs: {
            class: "row"
          },
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h(
            "span",
            {
              attrs: {
                class: data.parentId == 0 ? " first " : ""
              }
            },
            [
              h("img", {
                attrs: {
                  src: data.imageEntity ? data.imageEntity.url : "",
                  class: "icon" + (data.parentId == 0 ? " hide " : "")
                }
              }),
              h(
                "span",
                {
                  attrs: {
                    class: "cell"
                  }
                },
                data.title
              ),
              h(
                "span",
                {
                  attrs: {
                    class: "cell"
                  }
                },
                data.parentId != 0 ? data.price + "元/件" : ""
              )
            ]
          ),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                lineHeight: "60px",
                marginRight: "32px"
              }
            },
            [
              h(
                "Button",
                {
                  props: {
                    type:"primary"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      // this.append(data)
                      this.formData = {
                        parentId: data.id,
                        name: "",
                        price: "",
                        des: "",
                        imageEntity: {
                          id: "",
                          url: ""
                        }
                      };
                      this.show = true;
                    }
                  }
                },
                "添加"
              ),
              h(
                "Button",
                {
                  props: {
                    type:"info"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.update(root, node, data);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: { type:"warning"},
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.remove(root, node, data);
                    }
                  }
                },
                "删除"
              )
            ]
          )
        ]
      );
    },
    add() {
      this.formData = {
        parentId: 0,
        name: "",
        price: "",
        des: "",
        imageEntity: {
          id: "",
          url: ""
        }
      };
      this.show = true;
    },
    append(data) {
      const children = data.children || [];
      children.push({
        title: "appended node",
        expand: true
      });
      this.$set(data, "children", children);
    },
    update(root, node, data) {
      this.formData = {
        id: data.id,
        name: data.title,
        price:data.price,
        des: data.des,
        imageEntity: data.imageEntity||{
          id: "",
          url: ""
        }
      };
      this.show = true;
    },
    remove(root, node, data) {
      this.$store
        .dispatch("proxyAction", {
          name: "deleteCategory",
          queries: null,
          data: { id: data.id },
          param: null
        })
        .then(res => {
          this.$store.dispatch("reload", {
            routeName: this.$route.name
          });
        });
    }
  }
};
</script>