<template>
 <div> 
    <div class="collect">
        <div class="categroy">
            <Card>
                <Tabs value="name1">
                    <TabPane  v-for="(item,index) in this.data.categoryList" :label="item.name" :name="item.name" v-if="item.parentId==0">
                        <Table :columns="categroyColumns"  :data="item.childrenClothesCategoryEntitySet" @on-row-click="selectCategroy"></Table>
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
                                        <Input  v-model="formValidate.phone" placeholder="请输入手机号" ></Input>
                                    </div> 
                                    <Button type="success"  @click="searchMember" >查询</Button>
                                 </div>
                             </div>
                             <div class="detail">
                                <div class="item">
                                     <Input   v-model="formValidate.name" placeholder="请输入姓名"></Input> 
                                 </div>                           
                            </div>
                             <div class="detail">
                                <div class="item">
                                    <Select v-model="formValidate.payment.id" style="width:200px">
                                        <Option v-for="item in data.paymentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                 </div>                           
                            </div>
                            <div class="detail">
                                <div class="item">
                                    <Select v-model="formValidate.state.id" style="width:200px">
                                        <Option v-for="item in data.stateEntity" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </div>
                            </div>
                             <div class="detail">
                                <div class="item">
                                       
                                      <img v-for="item in formValidate.imageSet" :src="item.url" class="image">
                                      <Upload
                                          ref="upload"
                                          :show-upload-list="false"
                                          :on-success="handleSuccess"
                                          :format="['jpg','jpeg','png']"
                                          :max-size="2048"
                                          multiple
                                          type="drag"
                                          action="/api/attachment/upload"
                                          style="display: inline-block;width:58px;">
                                          <div style="width: 58px;height:58px;line-height: 58px;">
                                              <Icon type="camera" size="20"></Icon>
                                          </div>
                                      </Upload>
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
                    <Table :columns="columns7"  :data="selectGood"></Table>
                </div>
                <div class="button">
                    <div class="total">数量：共{{total}}件</div>
                    <div class="total">应收金额：{{amount}}元</div>
                    <div class="button-group">
                          <Button type="primary" @click="save()">完成支付</Button>
                    </div>
                </div>
                
            </div>
        </Card>
            <!-- </Affix> -->
    </div>
     <Modal v-model="show" title="编辑会员" okText="" cancelText="">
           <member-edit :form-data="categoryData"></member-edit>  
      </Modal>
      <Modal v-model="showCamera" title="拍照" okText="" @on-cancel="cancelCamera" cancelText="">
           <camera ref="camera" @upload-success="uploadBase64Success"></camera>  
      </Modal>
</div>
</template>

<script>
import memberEdit from "../fragment/member/edit.vue";
import camera from "../component/camera/camera.vue";
const headUrl = require("./img/default-head.jpg");
export default {
  props: ["data"],
  data() {
    return {
      showCamera: false,
      showc: false,
      show: false,
      formValidate: {
        phone: "",
        name: "",
        headUrl,
        goodsEntitySet: [],
        stateEntity: {
          id: 1
        },
        storeId: 1,
        payment: { id: 1 },
        state: { id: 1 },
        imageSet: [],
        goodList: []
      },
      categoryData: {
        name: "",
        phone: "",
        memberCategoryId: 0,
        idNum: "",
        headUrl: "",
        birthday: "",
        address: "",
        desc: "",
        memberCategoryEntity: this.data.memberCategory
      },
      payment: [],
      selectGood: [],
      selectCategroyData: [],
      categroyColumns: [
        {
          title: "缩略图",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            return h("img", {
              attrs: {
                src: row.imageEntity ? row.imageEntity.url : ""
              }
            });
          }
        },
        {
          title: "分类",
          key: "name"
        },
        {
          title: "价格",
          key: "price"
        }
      ],
      columns7: [
        {
          title: "缩略图",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            return h("img", {
              attrs: {
                src: row.imageEntity ? row.imageEntity.url : ""
              }
            });
          }
        },
        {
          title: "分类",

          render: (h, params) => {
            const row = params.row;
            return <span>{row.name}</span>;
          }
        },
        {
          title: "价格",
          key: "price"
        },
        {
          title: "备注",
          render: (h, params) => {
            const row = params.row;
            return <span>{row.des}</span>;
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const remove = () => {
              this.removeCategroy(params);
            };
            const camera = () => {
              this.showCamera = true;
              this.currentGoodId=row.id;
              this.$refs.camera.initCamera();
            };
            return (
              <span class="setting-buttons">
                <a
                  href="javascript:;"
                  style="margin-right:10px;"
                  onClick={camera}
                >
                  拍照
                </a>
                <a
                  href="javascript:;"
                  style="margin-right:10px;"
                  onClick={remove}
                >
                  删除
                </a>
              </span>
            );
          }
        }
      ]
    };
  },
  components: {
    memberEdit,
    camera
  },
  created() {},
  computed: {
    total() {
      return this.selectCategroyData.length;
    },
    amount() {
      let amount = 0;

      this.selectCategroyData.forEach(item => {
        amount += item.price;
      });

      return amount;
    }
  },
  methods: {
    uploadBase64Success(data) {
       this.selectGood.forEach((item)=>{
          if(item.id==this.currentGoodId)
          {
            item["imageEntity"]=data;
          }
       });
    },
    save() {
      this.formValidate.goodList = this.selectGood;
      this.$store
        .dispatch("proxyAction", {
          name: "saveClothesOrder",
          queries: null,
          data: this.formValidate,
          message: true
        })
        .then(res => {
          if (res.res.data.error != 0) {
            this.$Notice.success({
              title: "提醒",
              desc: `${res.res.data.data.message}`
            });
          } else {
            this.$Notice.success({
              title: "提醒",
              desc: `该衣服的货架号：${res.data.data.storageNum}`
            });
          }
        });
    },
    handleSuccess(res, file) {
      this.formValidate.imageSet.push(res.data);
    },
    removeCategroy(params) {
      // this.selectCategroyData.remove(params.index)
      this.selectCategroyData.splice(params.index, 1);
      this.selectGood.splice(params.index, 1);
    },

    selectCategroy(row) {
      this.selectCategroyData.push(row);
      //说明存在
      // let isNew=true;
      // this.selectGood.forEach((good)=>{
      //   if(good.clothesCategoryEntity.id==row.id){
      //     isNew=false;
      //     good.num++;
      //   }
      // });
      //已经选择过同类型的商品
      //if(isNew){
      this.selectGood.push(row);
      //}
    },
    reset() {
      this.formValidate = Object.assign(this.formValidate, {
        name: "",
        headUrl,
        goodsEntitySet: [],
        stateEntity: {
          id: 1
        },
        storeId: 1,
        payment: { id: 1 },
        imageSet: []
      });
    },
    cancelCamera() {
      this.$refs.camera.stop();
    },
    searchMember() {
      this.reset();
      this.$store
        .dispatch("proxyAction", {
          name: "collect-search-member",
          queries: {
            phone: this.formValidate.phone
          },
          message: false
        })
        .then(res => {
          let member = res.data.data.content;
          if (member && member.length > 0 && member[0]) {
            this.formValidate = Object.assign(this.formValidate, member[0]);
            if (!this.formValidate.headUrl) {
              this.formValidate.headUrl = headUrl;
            }
          } else {
            this.$Modal.confirm({
              title: "选择",
              content: "<p>确定创建会员？</p>",
              onOk: () => {
                this.show = true;
                this.categoryData.phone = this.formValidate.phone;
                this.reset();
              },
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
    img {
      width: 30px;
      height: 30px;
    }
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
        .ivu-form-item {
          margin-bottom: 0px !important;
        }
        .ivu-form-item-content {
          margin-left: 0px !important;
          text-align: center;
        }
        .head {
          height: 100px;
          width: 100px;
          border-radius: 50%;
        }
        .phone {
          display: inline-block;
        }
        .detail {
          // text-align: center;
          padding: 5px 50px;
          .item {
            display: inline-block;
            width: 250px;
            .image {
              width: 50px;
              height: 50px;
            }
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
  img {
    width: 30px;
    height: 30px;
  }
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
