<template>
 <div> 
    <div class="collect">
        <div class="categroy">
            <Card>
                <Tabs value="name1">
                    <TabPane  v-for="(item,index) in this.data.content" :label="item.name" :name="item.name" v-if="item.parentId==0">
                        <Table :columns="categroyColumns" size="large"  :data="item.childrenClothesCategoryEntitySet" @on-row-click="selectCategroy"></Table>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
        <div class="member-order">
            <Card >
                <div class="order-form">
                  
                    <div class="member-info">
                        <div class="title">会员信息</div>
                        <Form ref="formValidate" :model="formValidate"  :label-width="80">
                            <FormItem label="" prop="headUrl">
                                <img :src="formValidate.headUrl" alt="" class="head">
                            </FormItem>
                            <div class="detail">
                                <div class="item">
                                    <div class="phone">
                                        <Input  size="large" v-model="formValidate.phone" placeholder="请输入手机号" ></Input>
                                        
                                    </div> 
                                    <Button type="success"  @click="searchMember" >查询</Button>
                                 </div>
                             </div>
                             <div class="detail">
                                <div class="item">
                                     <Input  size="large" v-model="formValidate.name" placeholder="请输入姓名"></Input> 
                                 </div>                           
                            </div>
                        </Form>
                        <div class="button-group">
                             <!-- <Button type="primary" @click="save()">下单</Button> -->
                        </div>
                       
                    </div>
                </div>         
            </Card>
        </div>
    </div>
     <div class="bottom">
        <!-- <Affix :offset-bottom="100"> -->
        <Card>
            <div class="bottom-card">  
                <div class="order-info">
                    <div class="title">订单信息</div>
                    <Table :columns="columns7"  size="large" :data="selectCategroyData"></Table>
                </div>
                <div class="button">
                    <div class="total">数量：共5件</div>
                    <div class="total">应收金额：10元</div>
                    <div class="button-group">
                            <Button type="primary" @click="save()">完成支付</Button>
                    </div>
                </div>
                
            </div>
        </Card>
            <!-- </Affix> -->
    </div>
</div>
</template>

<script>
const headUrl = require("./img/default-head.jpg");
export default {
  props: ["data"],
  data() {
    return {
      formValidate: {
        phone: "",
        name: "",
        headUrl
      },

      selectCategroyData: [],
      categroyColumns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "价格",
          key: "price"
        }
      ],
      columns7: [
        {
          title: "序号",
          key: "name"
        },
        {
          title: "名称",
          key: "phone"
        },
        {
          title: "价格",
          key: "des"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const remove = () => {
              this.removeCategroy(params);
            };
            return (
              <span class="setting-buttons">
                <a
                  href="javascript:;"
                  style="margin-right:10px;"
                  onClick={remove}>
                  删除
                </a>
              </span>
            );
          }
        }
      ]
    };
  },
  methods: {
    removeCategroy(params) {
      // this.selectCategroyData.remove(params.index)
      this.selectCategroyData.splice(params.index, 1);
    },
    selectCategroy(row) {
      this.selectCategroyData.push(row);
    },
    reset() {
      this.formValidate = {
        phone: "",
        name: "",
        headUrl
      };
    },
    searchMember() {
      this.$store
        .dispatch("proxyAction", {
          name: "collect-search-member",
          queries: {
            phone: this.formValidate.phone
          },
          message: false
        })
        .then(res => {
          let member = res.data.data;
          if (member) {
            this.formValidate =Object.assign(this.formValidate,res.data.data);
            if(!this.formValidate.headUrl){
              this.formValidate.headUrl=headUrl;
            }
          } else {
            this.reset();
            this.$Modal.confirm({
              title: "选择",
              content: "<p>确定充会员？</p>",
              onOk: () => {},
              onCancel: () => {}
            });
          }
        });
    }
  }
};
</script>

<style lang="less">
.collect {
  display: flex;
  flex-direction: row;
  .categroy {
    width: 700px;
  }
  .member-order {
    flex: 1;
    .order-form {
      display: flex;
      flex-direction: row;
      height: 500px;
      overflow-y: scroll;
      .member-info {
        flex: 1;
        .ivu-form-item-content {
          margin-left: 0px !important;
          text-align: center;
        }
        .head {
          height: 150px;
          width: 150px;
          border-radius: 50%;
        }
        .phone {
          display: inline-block;
        }
        .detail {
          // text-align: center;
          padding: 10px 50px;
          .item {
            display: inline-block;
            width: 250px;
          }
        }
      }
    }
  }
  .button-group {
    text-align: right;
  }
}

.bottom {
  position: fixed;
  background: #f8f8fe;
  bottom: 30px;
  width: 100%;
  .total {
    line-height: 30px;
  }
  .bottom-card {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .order-info {
    height: 200px;
    overflow-y: scroll;
    // padding:20px;
    //  flex:1;
    width: 700px;
  }
  .button {
    flex: 1;
    padding: 50px;
  }
  .button-group {
    padding: 30px 0px;
  }
}
</style>
