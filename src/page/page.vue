<template>
 <section class="page">
    <layout-view v-if="isLogin">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition> 
    </layout-view>
    <section v-if="!isLogin"  class="page">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition> 
    </section>
 </section>

</template>


<script>
import config from '../config';
import Vue from 'vue';
import layoutView from './layout/home.vue';
export default {
    components: {
        layoutView
    },
    computed:{
        isLogin(){
            return this.$store.state.error!=100
        }
    },
    data() {
        return {
            dev: config.isDev
        };
    }
};
</script>

<style>
    .page{
        height:100%;
    }
</style>


