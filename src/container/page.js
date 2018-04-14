/**
 * default page container
 * @author chengxiao
 */

import loading from '../fragment/loading.vue';
import error from '../fragment/error.vue';
import {util} from '../lib/tools';
import dao from '../dao/dao';
import config from '../config.js';
import router from '../router/router';
import login from '../page/login.vue';
import md5 from 'js-md5';



const pageContainer = function (view, options) {
    const viewName = options.routerName;
    const action = function (data, isReload, isPage) {
        console.log('page.js container action....');
        this.proxyAction = {};
        if (isPage) {
            this.$store.dispatch('getPageData', Object.assign({
                name: this.$route.name,
            }, data));
        } else {
            this.$store.dispatch('proxyAction', data).then(res => {
                this.$message(res.message);
                if (isReload) {
                    this.$store.dispatch('reload');
                } else {
                    this.proxyAction = {
                        [data.name]: res.data
                    };
                }
            });
        }

    };
    return {
        data() {
            return {
                viewName,
                proxyAction: {}
            }
        },
        render(h) {
            const isPageLoading = this.$store.state.isPageLoading;
            const portalName = this.$route.name;
            const data = this.$store.state['c-page-data'];
            let errorCode = this.$store.state.error;

            const errorCodeType = this.$store.state['error-type'];
            if(errorCode===300||errorCode===200){
                return h(login)
            }

            if (errorCode !== 0 || errorCodeType !== 0) {
                return h(error, {
                    props: {
                        message: this.$store.state['error-message'] || '服务器返回错误：' + errorCode,
                        code: errorCodeType
                    }
                });
            }

            if (isPageLoading) {
                return h(loading);
            }

            return h(view, {
                props: {
                     data:data.data
                }
            });

        },

        methods: {
            action
        },

        getPicker() {
            return options.picker;
        },
        beforeCreate() {
           
            const portalName = this.$route.name;
            const queries=Object.assign({},this.$route.params,this.$route.query);
    
            const cache=dao.cache(md5(portalName+JSON.stringify(queries)));
            const curRoute=this.$router.options.routes.filter(function(route){return route.name===portalName})[0];
            //如果页面距离上次1分钟以内，且有正确数据、路由noCache为fasle或未定义 走缓存数据
            if(cache&&Object.getOwnPropertyNames(cache.value["c-page-data"]).length>1&&(new Date().getTime()-cache.time)<60000&&!curRoute.noCache&&!queries.noCache&&cache.value["error"]===0){
                this.$store.dispatch('loaded');
                this.$store.dispatch('refeshData', cache.value);
            }
            else{
                this.$store.dispatch('loading');
                let token=this.$store.state["token"],
                formData={
                    portal:true,
                    queries
                };
                if(token){
                    formData=Object.assign(formData,{token});
                }
                dao.getPageData(portalName,formData,false).then((res) => {
                    this.$store.dispatch('loaded');
                    delete queries["!"];
                    const initStateData = dao.init(res.data, {name: md5(portalName+JSON.stringify(queries))});
                    this.$store.dispatch('refeshData', initStateData);
                })
            }
           
        },
        created() {
            // console.log('created', this.viewName);
        },
        beforeUpdate() {

            // console.log('beforeUpdate', this.viewName);
        },
        updated() {
            // console.log('updated', this.viewName);

        },
        beforeMount() {
            // console.log('beforeMount', this.viewName);

        },
        mounted() {
            // console.log('mounted', this.viewName);

        },
        beforeDestroy() {
            // console.log('beforeDestroy', this.viewName);

        },
        destroyed() {
            // console.log('destroyed', this.viewName);
        }
    };
};


export default pageContainer;
