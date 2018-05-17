<template>
    <div class="error-box">
        <div class="msg">
            {{message}}
        </div>
    </div>
</template>

<style scoped lang="scss">
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
        font-size: x-large;
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
