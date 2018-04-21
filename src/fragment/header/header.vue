<template>
    <header class="hd">
        <section class="personal">
            <Menu mode="horizontal" active-key="2">
                    <Submenu key="3" name="3">
                    <template slot="title">
                    <Icon type="person"></Icon>
                        我
                    </template>
                    <Menu-group title="个人相关">
                        <Menu-item name="3-1" key="3-1">切换账号</Menu-item>
                        <Menu-item name="3-2" key="3-2">退出登录</Menu-item>
                        <Menu-item  name="3-3" key="3-3">个人中心</Menu-item>
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
    methods: {
        back() {
            this.$router.go(-1);
        }
    }
}
</script>
