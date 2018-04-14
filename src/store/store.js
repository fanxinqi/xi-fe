import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import config from '../config';
import passport from 'yanxiu-passport';

Vue.use(Vuex);
const state = {
    location: null,
    isPageLoading: false,
    message: '',// 结果信息,
    token:localStorage.getItem('token')
};

const getters = {};

passport.init({
    passportHost: config.MODE_TESTING ? config.passport_testing_host : undefined,
});

export default function(data) {
    Object.assign(state, data);
    return new Vuex.Store({
        state,
        getters,
        actions,
        mutations
    });
};
