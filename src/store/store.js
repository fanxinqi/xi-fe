import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import config from '../config';

Vue.use(Vuex);
const state = {
    location: null,
    isPageLoading: false,
    message: '',// 结果信息,
    token: localStorage.getItem('token'),
    error: 0,
    user:JSON.parse(localStorage.getItem('user'))
};

const getters = {};

export default function (data) {
    Object.assign(state, data);
    return new Vuex.Store({
        state,
        getters,
        actions,
        mutations
    });
};
