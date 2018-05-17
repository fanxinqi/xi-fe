<template>
    <header class="hd">
        <section class="personal">
            <Menu mode="horizontal" active-key="2" @on-select="logout">
                    <Submenu key="3" name="3">
                    <template slot="title">
                    <Icon type="person"></Icon>
                        {{user?user.name:"访客"}}
                    </template>
                    <Menu-group title="个人相关">
                        <Menu-item name="3-1" key="3-1" @on-select="logout">切换账号</Menu-item>
                        <Menu-item name="3-2" key="3-2" @on-select="logout">退出登录</Menu-item>
                    </Menu-group>
                </Submenu>
            </Menu>
        </section>
        <section class="home">
            <Menu mode="horizontal" active-key="1">
                    <Menu-item key="1" name="1">
                        <Icon type="navicon-round"></Icon>
                    </Menu-item>
            </Menu>
        </section>
        
    
    </header>
</template>
<style scoped lang="scss">
    .hd{
        display: flex;
        flex-direction: row-reverse;
        .home{
            flex:1
        }
        .personal{
         
        }
    }
</style>
<script>
import config from '../../config';

export default {
    components: {
        
    },
    props: ['notShowRight', 'notShowLeft', 'title','showBack'],
    data() {
        return {
            // siteName: config.siteName
        };
    },
    computed:{
        user(){
            return this.$store.state.user;
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        logout(){
            this.$store.dispatch("logout");
            window.location.reload();
        }
    }
}
</script>
