<template>
    <Tree :data="treeData" :render="renderContent"></Tree>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      treeDataSource:this.data.content,
      // data5: [
      //   {
      //     title: "衣服分类",
      //     expand: true,
      //     render: (h, { root, node, data }) => {
      //       return h(
      //         "span",
      //         {
      //           style: {
      //             display: "inline-block",
      //             width: "100%"
      //           }
      //         },
      //         [
      //           h("span", [
      //             h("Icon", {
      //               props: {
      //                 type: "ios-folder-outline"
      //               },
      //               style: {
      //                 marginRight: "8px"
      //               }
      //             }),
      //             h("span", data.title)
      //           ]),
      //           h(
      //             "span",
      //             {
      //               style: {
      //                 display: "inline-block",
      //                 float: "right",
      //                 marginRight: "32px"
      //               }
      //             },
      //             [
      //               h("Button", {
      //                 props: Object.assign({}, this.buttonProps, {
      //                   icon: "ios-plus-empty",
      //                   type: "primary"
      //                 }),
      //                 style: {
      //                   width: "52px"
      //                 },
      //                 on: {
      //                   click: () => {
      //                     this.append(data);
      //                   }
      //                 }
      //               })
      //             ]
      //           )
      //         ]
      //       );
      //     }
      //   }
      // ],
      buttonProps: {
        type: "ghost",
        size: "small"
      }
    };
  },
  computed:{
     treeData(){
        return this.parase(this.treeDataSource);
     }
  },
  methods: {

    parase(sourceData){
       let targeTreeData=[];
       sourceData.forEach(item => {
          targeTreeData.push({
              title: item.name,
              expand: true,
              children:this.parase(item.childrenClothesCategoryEntitySet) 
          }) 
        });
      return targeTreeData;
    },

    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title)
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-plus-empty"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.append(data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-minus-empty"
                }),
                on: {
                  click: () => {
                    this.remove(root, node, data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    append(data) {
      const children = data.children || [];
      children.push({
        title: "appended node",
        expand: true
      });
      this.$set(data, "children", children);
    },
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    }
  }
};
</script>