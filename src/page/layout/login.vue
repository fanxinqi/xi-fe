

<template>
    <section class="HolyGrail">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition> 
    </section>
</template>


<script>
import config from '../../config';
import Vue from 'vue';
import headerView from '../../fragment/header/header.vue';
import footerView from '../../fragment/footer.vue';
import menuView from '../../fragment/menu.vue';
import breadcrumbView from '../../fragment/breadcrumb.vue';
export default {
    components: {
        headerView,
        footerView,
        menuView,
        breadcrumbView 
    }
};
</script>


