<template>
    <Table  :columns="columns1" :data="row.appendixEntitySet"></Table>
</template>

<script>
export default {
  props: {
    row: Object
  },
    watch:{
        haha(newValue){
            debugger;
            console.log(newValue);
        }
    },
  data() {
    return {
        haha:this.row,
      columns1: [
        {
          title: "附件名称",
          key: "name",
          render: (h, params) => {
            const row = params.row;
              console.log(row);
              if(row.isEdit){
                  return <input value={row.name}/>;
              }
              else{
                  return <span>{row.name}</span>;
              }
          }
        },
        {
          title: "描述",
          key: "des",
          render: (h, params) => {
            const row = params.row;
              if(row.isEdit){
                  return <input value={row.des}/>;
              }
              else{
                  return <span>{row.des}</span>;
              }
          }
        },
        {
          title: "操作",
          key: "id",
          width: 150,
          align: "center",
            render: (h, params) => {
                const row = params.row;
                const deleteHandler=()=>{
                    this.row.appendixEntitySet=this.row.appendixEntitySet.splice(row._index,1);
                    console.log(this.row.appendixEntitySet);
                }
                return h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        let id = row.id;
                                        deleteHandler(id)
                                    }
                                }
                            }, '删除')
            }

        }
      ]
    };
  }
};
</script>

<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>