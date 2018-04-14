<template>
    <div class="login-info">
        <span class="user-info" v-if="isLogin">
            <span class="user-name">{{ userName }}</span>
            <router-link :to="{name: 'user.projects'}">在线报名</router-link>
            <span class="sep">|</span>
            <router-link :to="{name: 'user.profile'}">修改个人信息</router-link>
            <span class="sep">|</span>
            <a @click="logout" class="btn-login">退出</a>
        </span>
        <router-link v-if="!isLogin && role == 'user'" :to="{name: 'user.login'}">登录</router-link>
    </div>
</template>

<style>
.login-info {
    float: right;
    color: #fff;
    .user-name {
        margin: 0 40px;
    }
    .sep {
        margin: 0 16px;
        color: #999;
    }
    a {
        color: #fff;
    }
}
</style>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            role: this.$root.role
        };
    },

    computed: {
        userName: function() {
            return this.$store.state.user.name;
        },
        isLogin: function() {
            return this.$store.state.user.isLogin
        }
    },
    methods: Object.assign({},mapActions({ 'logout': 'user/logout' }))
};
</script>
