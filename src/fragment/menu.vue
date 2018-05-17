<template>
    <div class="menu">
        <div class="icon">
            <img src="http://v1.iviewui.com/dist/fe8d29da1225d943e30f9ee1bddce78f.png">
        </div>
        <div class="menus">
            <Menu :theme="theme3" @on-select="select"  active-key="1" v-for="(group,gidx) in menuGroups" :key="gidx">
                <!-- <Menu-group v-for="(group,gidx) in menuGroups" :key="gidx" :title="group.groupName" > -->
                    <Menu-item v-for="(menu,idx) in group.menus" :name="menu.name"  :key="menu.name"  v-if="menu.isShow" >
                        <Icon :type="menu.icon"></Icon><span class="title">{{menu.title}}</span>
                    </Menu-item>
                <!-- </Menu-group> -->
            </Menu>
        </div>
    </div>
</template>
<style scoped lang="scss">
    .icon{
        padding-left: 10px;
        img{
            height: 50px;
        }
    }
    .group{
        background: #f3f3f3;
        font-size: 16px;
        line-height: 50px;
        text-indent: 10px;
    }
    .menu {
        .router-link {
            display: inline-block;
            width: 100%;
            padding: 14px 24px;
            color: #495060;
            .title{
                padding: 0px 5px;
            }
        }

        ul {
            position: relative;
            width: 140px !important;
        }

        .router-link-active {
            color: #2d8cf0;
            border-right: 2px solid #2d8cf0;
            /*animation: menu-transform 0.5s;*/
            /*-moz-animation: menu-transform 0.5s;	!* Firefox *!*/
            /*-webkit-animation: menu-transform 0.5s;	!* Safari 和 Chrome *!*/
            /*-o-animation: menu-transform 0.5s;	!* Opera *!*/
        }

    }
    
    @keyframes menu-transform {
        from {
            transform: rotate(-90deg);
            -ms-transform: rotate(-90deg); /* IE 9 */
            -moz-transform: rotate(-90deg); /* Firefox */
            -webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
            -o-transform: rotate(-90deg); /* Opera */
        }
        to {
            transform: rotate(0deg);
            -ms-transform: rotate(0deg); /* IE 9 */
            -moz-transform: rotate(0deg); /* Firefox */
            -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
            -o-transform: rotate(0deg); /* Opera */
        }
    }

</style>

<script>
    import router from '../router/router';
    import config from '../config';
    import dao from '../dao/dao';
    console.log(config)
    const routes = router.getRules();
    const cache = [];
    //获取所有原始所有路由
    const genRoutesMenu = function () {
        return routes.map((node) => {
            return {name: node.name, title: node.title.pick(this.$store.state).get('title'), path:node.path};
        });
    };
    //获取菜单
    const getMenus=function(){
        if(cache.length>0) return cache;
        let me=this;
        let routers=genRoutesMenu.call(this);
        let hideNum=0
        let isHide=false;
        config.MENU_GROUP.forEach(function(item){
                let menus=[];
                for(let i in item.menus){
                    const routeName= item.menus[i].name
                    const roleIds=item.menus[i].roleIds;
                    let router= routers.find(function(value, index, arr) {
                        return value.name ===routeName;
                    })||{}
                    if(router.name===me.$route.name){
                        router["isCurrent"]=true;
                    }
                    else{
                        router["isCurrent"]=false;
                    }
                    router["isShow"]=false;
                    if(me.$store.state.user&&roleIds.some((roleId)=>{
                        return me.$store.state.user.roleId==roleId;
                    })){
                        router["isShow"]=true;     
                    }
              
                    router["icon"]=item.menus[i].icon || ""
                    hideNum++
                    menus.push(router);
                }
                if(hideNum===menus.length){
                    isHide=true;
                }
                else{
                    isHide=false;
                }
                cache.push({
                    groupName:item.name,
                    isHide,
                    menus
                })
        })
        return cache;
    }
    const Menu = {
        data() {
            return {
                menuGroups:getMenus.call(this),
                currentRouterName: this.$route.name,
                activeName: "",
                theme3:"dark"
            };
        },

        created() {
//            this.menu-groups=;
//            console.log(this.menu-groups)
          //  this.menus = genRoutesMenu(this.$store.state, this.$route.params);
//            this.
        },
        watch:{
           $route(){
               let me=this;
               console.log("router change")
               this.menuGroups.forEach(function(group){
                   group.menus.forEach(function(menu){
                      if(menu.name===me.$route.name){
                          menu["isCurrent"]=true;
                      }
                      else{
                          menu["isCurrent"]=false;
                      }

                   })
               });
           }
        },
        computed: {
            roleIds:function(){
                return this.$store.state["current-user"]["roleIds"]
            }
        },
        methods:{
            select(key){
                console.log(key)
                this.$router.push(key);
            }
        }
    };
    export default Menu

</script>

