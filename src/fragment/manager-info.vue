<template>
    <div class="login-info">
        <span class="user-info" v-if="isLogin">
            <span class="user-name">{{ userName }}</span>
            <span class="sep">|</span>
            <a @click="logout" class="btn-login">退出</a>
        </span>
        <span class="login-info" v-else>
            <router-link :to="{name: 'login'}">登录</router-link>
        </span>
    </div>
</template>

<style scoped>
.login-info {
    float: right;
    color: #fff;
    font-size: 14px;
    .user-name {
        margin: 0;
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
            return this.$store.state['user-name'];
        },
        isLogin: function() {
            return this.$store.state['user-id'] > 0;
        }
    },
    methods: {
        ...mapActions({ 'logout': 'logout' })
    }
};
</script>
