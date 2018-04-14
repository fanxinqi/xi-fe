/**
 * App main
 */
import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';

import AppView from './page/page.vue';
import createStore from './store/store.js';
import router from './router/router.js';

import config from './config.js';
import createContainer from './container/container.js';
import dao from './dao/dao';

import Iview from 'iview';

import 'iview/dist/styles/iview.css';    // 使用 CSS

import './lib/lib.scss'
import './lib/theme.scss'
import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
// import 'videojs-contrib-hls/dist/videojs-contrib-hls'
import './lib/exculde/exculde.scss'

const view = createContainer('app')(AppView);
import md5 from 'js-md5';

import LockBox from './component/lock-box.vue';
import SmartTable from './component/smart-table.vue';

const init = function({mountPointID, routerMode}, data){


    Vue.use(VueRouter);
    Vue.use(Iview);
    
    Vue.use(SmartTable);
    Vue.use(LockBox);
    
    const routerName = router.init(routerMode);
    const pagePicker = router.getPagePicker(routerName);
    const cashData=dao.cache(md5(routerName));
    const initStateData = dao.init(cashData?cashData.value:{},  {picker: pagePicker, name: routerName});
    const store = createStore(initStateData);

    const App = new Vue({
        el: mountPointID,
        router: router.getInstance(),
        store,
        data: {
            
        },
        render: function(h) {
            return h(view);
        }
    });
    
};


export {init};
