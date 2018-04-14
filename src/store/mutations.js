/**
 * 根级别的mutations
 *
 *
 */
import types from './mutation-types';


const mutations = {
    [types.JUMP]: (state, payload) => {
        state.location = payload;
    },

    [types.LOGIN](state) {
        state.isLogin = true;
    },

    [types.LOGOUT](state) {
        state.isLogin = false;
    },
    
    [types.LOADING_USER_INFO]: (state, loading) => {
        state.isUserInfoLoading = loading;
    },

    [types.PAGE_LOADING](state, flag) {
        //console.log('loading', flag);
        state.isPageLoading = flag;
    },

    [types.META]: (state, data) => {
         Object.assign(state, data);
    },

    [types.MESSAGE]: (state, msg) => {
        // 包装对象，以使其可以显示重复的msg
        state.message = {msg};
    },
    [types.TOKEN]: (state, token) => {
        // 包装对象，以使其可以显示重复的msg
        localStorage.setItem('token',token);
        state.token = token;
    }

};

export default mutations;
