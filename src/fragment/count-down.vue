<template>
  <div class="count">
    <span class="count-title">距开播时间</span><span class="day">{{day}}</span><span class="sep">天</span><span class="hour">{{hour}}</span><span class="sep">时</span><span class="minute">{{minute}}</span><span class="sep">分</span><!-- <span class="second">{{second}}</span><span class="sep">秒</span> -->
  </div>
</template>

<script>
  export default {
    props:['timeToStart'],
    data () {
      return {
        day: '00',
        hour: '00',
        minute: '00',
        second: '00'
      }
    },
    created () {
      this.countDown(this.timeToStart);
    },
    methods: {
      countDown(tostart){
        var me = this;
        let day=0,hour=0,minute=0,second=0;
        let timer=setInterval(() => {
          if(tostart>0){
            day=Math.floor(tostart/(60*60*24));
            hour=Math.floor(tostart/(60*60))-(day*24);
            minute=Math.floor(tostart/60)-(day*24*60)-(hour*60);
            second=Math.floor(tostart)-(day*24*60*60)-(hour*60*60)-(minute*60);
            day<=9?(me.day='0'+day):me.day=day;
            hour<=9?(me.hour='0'+hour):me.hour=hour;
            minute<=9?(me.minute='0'+minute):me.minute=minute;
            // second<=9?(me.second='0'+second):me.second=second;
            tostart--;
          } else if(tostart==0) {
            this.$emit('startPlay');
            tostart--;
          }
        },1000);
      }
    }
  }
</script>

<style scoped lang="scss">
  .count {
    height: 50px;
    // width: 400px;
    background: rgba(0,0,0,.2);
    padding-left:10px;
    border-radius: 8px;
    span {
      display: inline-block;
      color: #fff;
    }
    .count-title {
      // width: 120px;
      font-size: 24px;
      text-align: center;
      height: 50px;
      line-height: 50px;
      margin-right: 20px;
    }
    .day,.hour,.minute,/*.second*/ {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      background: #00b3a4;
      font-size: 24px;
      text-align: center;
      line-height: 36px;
    }
    .sep {
      width: 36px;
      height: 36px;
      font-size: 24px;
      text-align: center;
      line-height: 36px;
    }
  }
</style>