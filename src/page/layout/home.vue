<template>
  <section class="HolyGrail">
    <section  class="HolyGrail-body"> 
        <main class="HolyGrail-content">
            <section class="header">
                 <header-view></header-view>  
            </section>
            <section class="crumbs">
                 <breadcrumb-view></breadcrumb-view>  
            </section>
            <section class="content">
                <transition name="fade" mode="out-in">
                    <!-- <Card :bordered="false"> -->
                        <router-view></router-view>
                    <!-- </Card> -->
                </transition> 
            </section>
        </main>
        <nav class="HolyGrail-nav">
            <menu-view></menu-view>
        </nav>
    </section>
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


