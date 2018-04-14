<template>
    <div class="error-box">
        <div class="msg">
            您页面去旅行了
        </div>
       <mt-button type="default">刷新一下</mt-button>
    </div>
</template>

<style scoped>
.sep {
    color: #999;
    margin: 0 12px;
}

.error-box {
    padding: 100px 0;
    .err-icon {
        margin-right: 16px;
    }
    .msg {
        font-size: 16px;
        color: #999;
        text-align: center;
        .logout {
            margin-top: 20px;
            font-size: 14px;
        }
    }
    .nav {
        margin: 16px 0;
        .link {
            margin: 0 12px;
        }
    }
}
</style>

<script>
export default {
    props: ['message', 'code'],
    data() {
        return {
        };
    },

    methods: {
        logout() {
            this.$store.dispatch('logout');
        }
    }
};
</script>
