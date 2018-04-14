<template>
    <div class="routes-debug-menu">
        <div v-for="item in links" class="router-link-box">
            <router-link :to="item" class="router-link">{{item.title}} {{item.name}}</router-link>
        </div>
    </div>
</template>

<style scoped>
    .routes-debug-menu {
        background-color: #ffc;
        padding-bottom: 8px;
    }
    .router-link-box {
        display: inline-block;
        margin: 8px 3px 0px 0;
        border: 1px solid #ccc;
        padding: 2px 4px;   
        background-color: #fff;
    }
    .router-link-o {
        color: blue;
    }
    .router-link-active {
        color: red;
    }
</style>

<script>
import router from '../router/router';
import config from '../config.js';
const routes = router.getRules();

const genRoutesMenu = function() {

    const params = {
        platformID: 1,
        projectID: 1,
        courseID: 1,
        classID: 1,
        sid: 1
    };
    
    return routes.map((node, index) => {
        return {name: node.name, title: node.title.pick(this.$store.state).get('title'),params: params};
    });

};
export default {
    data: function(){
        return {
        };
    },
    created: function() {
        this.menus = genRoutesMenu.call(this);

    },
    computed: {
        routes: function() {
        },
        links: function() {
            return this.menus;
        }
    }
};

</script>

