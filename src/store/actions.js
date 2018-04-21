/**
 * 根级别的actions
 */
import types from './mutation-types';
import message from './message';
import dao from '../dao/dao';
import router from '../router/router';

import md5 from 'js-md5';
const checkActionInfo = function (info) {
    if (!info.name) {
        throw new Error('proxyAction needs action name!');
    }
};

/*
* 检查是否要要发送请求
*/
const canAsync = function (info, state) {
    let isToken = true;
    typeof info.token === undefined ? isToken = ture : isToken = info.token;

    if (isToken && !state['token']) {
        return false;
    }
    else {
        return true;
    }
};


let initialized = false;

const actions = {
    message: ({ commit }, msg) => {
        commit('message', msg);
    },
    login({ commit, dispatch, state }, account) {
        dispatch('proxyAction', {
            'name': 'action-login',
            'queries': null,
            'data': {
                userName: account.userName,
                password: account.password
            },
            'param': null,
            token: false
        }).then((res) => {
            commit(types.LOGIN);
            commit(types.TOKEN, res.data.data.token);
            window.location.reload();
        }).catch((err) => {
            commit(types.MESSAGE, err.msg || '登录失败');
        })

    },

    logout({ commit, dispatch }) {
        commit(types.LOGOUT);
    },

    /**
     * 获取页面数据
     * @param {string} pageID
     */
    getPageData: ({ dispatch, commit, state }, pageInfo) => {
        if (!canAsync.call(this, pageInfo, state)) {
            return new Promise((resolve, reject) => {
                resolve({
                    code: 300
                });
            })
        }
        else {
            if (pageInfo.token != false && state["token"])
                pageInfo["token"] = state["token"];
        }

        if (!pageInfo.reload && !initialized) {
            commit(types.PAGE_LOADING, false);
            initialized = true;
        } else {
            return dispatch('getAsyncPageData', pageInfo);
        }
    },


    /**
     * 请求路由页面的异步数据
     * @param {Object} pageInfo {name, queries}
     */
    getAsyncPageData: ({ commit, state }, payload) => {
        // payload.picker = payload.picker || router.getCurrPagePicker();
        if (!canAsync.call(this, payload, state)) {
            return new Promise((resolve, reject) => {
                resolve({
                    code: 300
                });
            })
        }
        else {
            if (payload.token != false && state["token"])
                payload["token"] = state["token"];
        }

        dao.getPageData(payload.name, payload).then(res => {
            commit(types.META, res.data);

            setTimeout(() => {
                commit(types.PAGE_LOADING, false);
            }, 200);
        }).catch(res => {
            commit(types.MESSAGE, res.message);
            console.error(res);
        });
    },

    loading: ({ commit }) => {
        commit(types.PAGE_LOADING, true);
    },

    loaded: ({ commit }) => {
        commit(types.PAGE_LOADING, false);
    },

    setToken: ({ dispatch, commit }, token) => {
        localStorage.setItem('token', token);
        if (!token) {
            dao.clearCache();
            dispatch('login')
        }
        else {
            dispatch('logout')
        }
        commit(types.TOKEN, token);
    },

    //对当前页面数据进行请求的操作（url中参数与最近一次请求的页面数据保持一致）
    reload: ({ dispatch, commit, state }, payload) => {
        payload = payload || {};
        if (!canAsync.call(this, payload, state)) {
            return new Promise((resolve, reject) => {
                resolve({
                    code: 300
                });
            })
        }
        else {
            payload["token"] = state["token"].token;
        }

        const portalName = payload.routeName;
        const queries = Object.assign({}, payload.params, payload.query);
        dispatch('loading');
        let token = state["token"],
            formData = {
                portal: true,
                queries
            };
        if (token) {
            formData = Object.assign(formData, { token });
        }
        dao.getPageData(portalName, formData, false).then((res) => {
            dispatch('loaded');
            delete queries["!"];
            const initStateData = dao.init(res.data, { name: md5(portalName + JSON.stringify(queries)) });
            dispatch('refeshData', initStateData);
        })
        // payload.picker = payload.picker || router.getCurrPagePicker();
        // dao.x('reload', payload).then(res => {
        //     commit(types.META, res.data);
        //     commit(types.PAGE_LOADING, false);
        // }).catch(res => {
        //     commit(types.MESSAGE, res.message);
        //     console.error(res);
        // });
    },

    /**
     * 自动化代理action, 可以覆盖大部分操作
     * @param {Object} info => {
     *    name: action name(必须), 即config.js或是portals.js里的配置名称
     *    message: 消息内容，可选（不显示消息请传false）
     *    queries: ？后面的参数
     *    data: form data 数据
     *    param: 替换portals 里的 uri 里的参数的内容
     *    token:Boolean  ture 带token ，false 不带
     * }
     */
    proxyAction: ({ commit, state }, info) => {

        checkActionInfo(info);
        if (!canAsync.call(this, info, state)) {
            return new Promise((resolve, reject) => {
                resolve({
                    code: 300
                });
            })
        }
        else {
            if (info.token != false && state["token"])
                info["token"] = state["token"];
        }

        return new Promise((resolve, reject) => {
            dao.x(info.name, info).then(res => {

                if (res.data.success) {
                    if (info.message !== false) {
                        commit(types.MESSAGE, info.message || res.message || message.success);
                        res.data.message = info.message || res.message || message.success;
                    }
                    resolve(res.data);
                } else {
                    reject({ info, res });
                }
            });
        }).catch(err => {

            return err;
        });
    },

    proxyAction2: ({ commit }, info) => {
        checkActionInfo(info);

        return new Promise((resolve, reject) => {
            dao.x(info.name, info).then(res => {

                if (res.data.success) {
                    if (info.message !== false) {
                        commit(types.MESSAGE, res.message || info.message || message.success);
                    }
                    resolve(res.data);
                } else {
                    reject({ info, res });
                }
            });
        }).catch(err => {

            return err;
        });
    },
    refeshData: ({ commit }, data) => {
        commit(types.META, data);
    }
};


export default actions;
