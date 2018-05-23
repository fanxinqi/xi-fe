
// import Login from './login.vue';

// import Member from './member.vue';
// import Store from './store.vue';
// import Order from './order.vue';
// import Collect from './collect.vue';
// import Category from './category.vue';
// import User from './user.vue'
const User = () => import(/* webpackChunkName: "user" */ './user.vue')
const Category = () => import(/* webpackChunkName: "category" */ './category.vue')
const Collect = () => import(/* webpackChunkName: "collect" */ './collect.vue')
const Order = () => import(/* webpackChunkName: "order" */ './order.vue')
const Store = () => import(/* webpackChunkName: "store" */ './store.vue')
const Member = () => import(/* webpackChunkName: "member" */ './member.vue')
const Login = () => import(/* webpackChunkName: "login" */ './login.vue')
const pages = {
    Login,
    Member,
    Store,
    Order,
    Collect,
    Category,
    User
};
export default pages;