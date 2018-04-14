<template>
    <div class="information">
      <header-view :notShowRight=true :title="title" class="header border-bottom-1px" :show-back=true>
        <mt-button slot="other" type="primary" @click="handleClick">保存</mt-button> 
      </header-view>
      <div class="my-info border-top-1px border-bottom-1px" v-if="userInfo">
        <qiniu-upload
          :passport-token="passportToken"
          :on-progress="handdleUploadProgress"
          :on-success="handleUploadSuccess"
          class="border-bottom-1px">
          <div class="head-img"><span>头像</span><i class="icon-right-arrow"></i><img v-lazy="imgThumb(userInfo.headImg,54,54)"> 
          </div>
        </qiniu-upload>
        <!-- <div class="user-id border-bottom-1px"><span>用户ID</span><span>{{userInfo.userid}}</span></div> -->
        <div class="account border-bottom-1px"><span>账号</span><span>{{passportInfo.mobile}}</span></div>
        <mt-field class="nickname border-bottom-1px" label="昵称" placeholder="请输入昵称" v-model="userInfo.nickName"></mt-field>
        <!-- <mt-field class="introduce" label="简介" placeholder="请输入简介" v-model="userInfo.nickName"></mt-field> -->
        <div class="gender border-bottom-1px" @click="handlePopup"><span>性别</span><span>{{gend[userInfo.sex]}}</span></div>
        <div class="birthday border-bottom-1px" @click="datePicker"><span>生日</span><span>{{userInfo.birthday&&userInfo.birthday.split(' ')[0]}}</span></div>
        <mt-field class="mobile" label="手机" type="tel" placeholder="请输入手机" v-model="userInfo.mobile" :attr="{maxlength:11}" :state="isTel"></mt-field>
        <!-- <mt-field class="email border-bottom-1px" label="邮箱" placeholder="请输入邮箱" v-model="userInfo.email" :state="isEmail"></mt-field> -->
        <mt-actionsheet
          v-model="popupVisible"
          :actions="actions"
          cancelText=""
          class="sex-popup border-bottom-1px">
          <!-- <p @click="chooseSex(0)">男</p>
          <p @click="chooseSex(1)">女</p> -->
        </mt-actionsheet>
        <mt-datetime-picker
          v-model="date"
          ref="picker"
          type="date"
          :startDate="minDate"
          :endDate="maxDate"
          year-format="{value} 年"
          month-format="{value} 月"
          date-format="{value} 日"
          @confirm="confirmDate"
          class="date-popup border-bottom-1px">
        </mt-datetime-picker>
      </div>
      <mt-spinner v-if="uploading" color="#00b3a4" type="fading-circle"></mt-spinner>
    </div>
</template>


<script>
import headerView from '../fragment/header/header.vue';
import QiniuUpload from '../component/qiniu-upload';

export default {
    props: ['data', 'params'],
    components: {
      headerView,
      QiniuUpload
    },
    data() {
      return {
        passportToken: '',
        gend: {
          "0": "男",
          "1": "女"
        },
        gendItem: {
          "男": 0,
          "女": 1
        },
        title: "个人信息",
        popupVisible: false,
        actions: [{
          name:'男',
          method: this.chooseSex
        },{
          name:'女',
          method: this.chooseSex
        }],
        message: '',
        date: new Date(),
        minDate: new Date('1900-01-01'),
        maxDate: new Date(),
        isNew: true,
        placeholder: '',
        inputVal: '',
        passportInfo: {
          mobile: this.data.user.passport
        },
        userInfo: {
          headImg:this.data.user.headImg,
          userid:this.data.user.userid,
          nickName:this.data.user.nickName,
          sex:this.data.user.sex,
          birthday:this.data.user.birthday,
          mobile:this.data.user.mobile,
          email:this.data.user.email
        },
        uploading: false
      };
    },
    created () {
      // this.getUserInfo();
      if(this.data.user.nickName||this.data.user.birthday||this.data.user.mobile||this.data.user.email) {
        this.isNew = false;
      }
      this.passportToken = localStorage.getItem('token');
    },
    methods: {
      getUserInfo () {
        let me = this;
        this.$store.dispatch('proxyAction',{
          name: 'asynMyInfo',
          message: false,
          queries: null
        }).then((res)=>{
          if(res.res && res.res.data.data.code==300) {
            me.$router.push('login');
          }else if(res.data.code==0) {
            if(res.data.data.userInfo){
              me.isNew = false;
              me.userInfo = res.data.data.userInfo;
              me.passportInfo = res.data.data.passportInfo;
            }else{
              me.isNew = true;
            }
          }
        });
      },
      handdleUploadProgress (event, file, fileList) {
        this.uploading = true;
        console.log(new Array(event.percent>>0 + 1).join("="));
      },
      handleUploadSuccess (response, file, fileList) {
        console.log(file.url);
        console.log("%c", "padding:50px 300px;line-height:120px;background:url('"+file.url+"') no-repeat;");
        this.uploading = false;
        this.userInfo.headImg = file.url;
        this.updateHeadImg();
      },
      handleClick () {
        if(this.isNew) {
          this.handleUserInfo('createUserInfo');
        }else{
          this.handleUserInfo('updateUserInfo');
        }
      },
      handleUserInfo (name) {
        let me = this;
        if(this.validate()){
          this.$store.dispatch('proxyAction',{
            name: name,
            message: false,
            queries: null,
            data: me.userInfo
          }).then((res)=>{
            if(res.data.code == 0) {
              me.$toast(res.data.message);
              me.getUserInfo();
            }else{
              me.$toast(res.data.message);
            }
          });
        };
          
      },
      updateHeadImg () {
        let me = this;
        this.$store.dispatch('proxyAction',{
          name: 'updateHeadImg',
          message: null,
          queries: null,
          data: {
            headImg: me.userInfo.headImg
          }
        }).then((res)=>{
          if(res.data.code==0) {
            me.$toast(res.data.message);
          }
        });
      },
      handlePopup (){
        this.popupVisible = true;
      },
      chooseSex (action,index) {
        this.userInfo.sex = this.gendItem[action.name];
        this.popupVisible = false;
      },
      datePicker () {
        this.$refs.picker.open();
      },
      confirmDate () {
        this.userInfo.birthday = this.formatDate(this.date);
      },
      formatDate (date) {
        return date.getFullYear()+"-"+this.addZero((date.getMonth()+1))+"-"+this.addZero(date.getDate())+" 00:00:00";
      },
      addZero (val) {
        return val<10?('0'+val):val
      },
      imgThumb(imgUrl,w,h) {
        return imgUrl?(imgUrl + '?imageMogr2/thumbnail/' + w + 'x' + h) : 'http://s2.jsyxw.cn/yanxiu/h2.jpg';
      },
      validate () {
        if(!this.userInfo.nickName) {
          this.$toast('请输入昵称！');
          return false;
        }
        if(this.userInfo.sex==null) {
          this.$toast('请选择性别！');
          return false;
        }
        if(!this.userInfo.birthday) {
          this.$toast('请输入生日！');
          return false;
        }
        if(!this.userInfo.mobile||this.isTel!='success') {
          this.$toast('请输入正确的手机号！');
          return false;
        }else{
          return true;
        }
      }
    },
    computed: {
      isTel () {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/; 
        if (reg.test(this.userInfo.mobile)) {  
          return 'success';  
        } else if(this.userInfo.mobile) {  
          return 'error'; 
        }
      },
      isEmail () {
        let reg =  new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$');
        if (reg.test(this.userInfo.email)) {  
          return 'success';
        } else if(this.userInfo.email) {  
          return 'error';
        }
      }
    }
};
</script>
<style scoped lang="scss">
  @import '../lib/mixin.scss';
  .information {
    background: #f4f5f6;
    height: 100vh;
    .header {
      background: #fff;
      color: #333;
      @include border-bottom-1px(#ccc)
    }
    .my-info {
      @include border-top-1px(#ccc)
      @include border-bottom-1px(#ccc)
      background: #fff;
      margin-top: 30px;
      .head-img,.mobile {
        border-bottom: 0;
      }
      .srt-upload,
      .user-id,
      .account,
      .nickname,
      .introduce,
      .gender,
      .birthday {
        @include border-bottom-1px(#ccc)
      }
      .srt-upload,
      .user-id,
      .account,
      .nickname,
      .introduce,
      .gender,
      .birthday,
      .mobile,
      .email {
        height: 100px;
        line-height: 100px;
        margin-left: 30px;
        color: #333;
        font-size: 32px;
        span:nth-of-type(1) {
          font-size: 32px;
          color: #333;
          display: block;
          width: 200px;
          float: left;
        }
        span:nth-of-type(2) {
          font-size: 28px;
          color: #999;
          float: left;
        }
        // .icon-right-arrow {
        //   display: block;
        //   width: 28px;
        //   height: 28px;
        //   float: right;
        //   margin: 30px 30px 0 20px;
        // }
      }
      .gender,.birthday {
        span:nth-of-type(2) {
          color: #666;
        }
      }
      .head-img {
        img {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          vertical-align: middle;
          float: right;
          margin-top: 23px;
          object-fit: cover;
        }
        .icon-right-arrow {
          display: block;
          width: 28px;
          height: 28px;
          float: right;
          margin: 36px;
          background: url(./img/desc.png) no-repeat center center;
          background-size: 28px 28px;
        }
      }
      .nickname,.introduce {
        @include border-bottom-1px(#ccc)
      }
    }
  }
</style>

<style lang="scss">
  @import '../lib/mixin.scss';
  .information {
    .my-info {
      .srt-upload-select {
        height: 100px;
        width: 720px;
        -webkit-tap-highlight-color:transparent; 
      }
    }
    .mint-cell-title {
      width: 200px;
    }
    .mint-field .mint-cell-value {
      // display: block;
      height: 100px;
      line-height: 100px;
      width: 470px;
      .mintui {
        font-size: 40px;
        margin-right: 20px;
      }
    }
    .mint-cell-wrapper {
      padding: 0;
    }
    .mint-field-core {
      font-size: 28px;
      color: #666;
    }
    .mint-button--primary {
      height: 60px;
      width: 120px;
      margin-top: 20px;
      font-size: 24px;
      background: #00b3a4;
      float: right;
      margin-right: 30px;
      position: absolute;
      right: 0;
    }
    .mint-button-text {
      font-size: 28px;
      top: 0;
      left: 0;
    }
    .mint-datetime-action {
      color: #00b3a4;
      font-size: 28px;
      height: 80px;
      line-height: 80px;
    }   
    .sex-popup {
      width: 100%;
      margin: 0;
      left: 50%;
      .mint-actionsheet-listitem {
        font-size: 28px;
        height: 100px;
      }
    }
    .sex-popup p {
      height: 100px;
      line-height: 100px;
      text-indent: 60px;
      color: #333;
      &:first-child {
        @include border-bottom-1px(#ccc)
      }
    }
    .date-popup {
      min-height: 600px;
    }
    .picker-toolbar {
      height: 80px;
      border-bottom: none;
    }
    .mint-spinner-fading-circle {
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }   
</style>
