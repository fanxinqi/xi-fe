<template>
  <div class="modify">
    <div class="top">
      <mt-button @click="cancel">取消</mt-button>
      {{title}}
      <mt-button type="primary" @click="submit">确定</mt-button>
    </div>
    <div class="content">
      <input type="text" :placeholder="placeholder" v-model="inputVal">
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  export default {
    data () {
      return {
        // inputVal: this.inputVal
      }
    },
    props: ['title','queries','placeholder','inputVal'],
    watch: {
      inputVal(val) {
        this.$emit('getInputVal',val);
      }
    },
    methods: {
      cancel () {
        // this.$route.go(-1);
      },
      submit () {
        this.handleUserInfo('updateUserInfo');
      },
      handleUserInfo (name) {
        let me = this;
        this.$store.dispatch('proxyAction',{
          name: name,
          message: false,
          queries: null,
          data: me.queries
        }).then((res)=>{

        });
      }
    }
  }
</script>

<style>
  
</style>