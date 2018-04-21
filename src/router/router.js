/**
 *
 */

import routes from './routes';
import createContainer from '../container/container';
import pages from '../page/page';
import VueRouter from 'vue-router';
import DataPicker from '../dao/data-picker';
import { inheritByPath } from '../lib/tools';

const prefix = routes.prefix;

// 拼接前缀
const routeMap = routes.rules.reduce((map, rule) => {
    // 是相对路径的时候拼接path
    if (rule.path.indexOf('/') !== 0) {
        // 前缀结尾必须以 "/"结束，否则会抛出异常
        if (!/.\/$/.test(prefix)) {
            throw new Error('Bad prefix end: "' + prefix + '" the end must has: /');
        }
        rule.path = prefix + rule.path;
        rule.title = new DataPicker({ 'title': DataPicker.parse(rule.title) });
    }
    map[rule.name] = rule;
    return map;
}, {});

// 根据路由名称(驼峰形式)，获取组对应的组件名(驼峰形式), 与page里的对应
function getComponentName(name) {
    if (name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
}

function getComponent(route) {
    const name = getComponentName(route.name);
    return createContainer({
        'name': route.name, pickerSpy(picker) {
            picker = picker || {};
            if (route.dataPath) {
                let dataPath = route.dataPath;
                const prePicker = picker['@'];
                if (prePicker) {
                    if (prePicker.dataPath) {
                        prePicker.dataPath = dataPath + '|' + prePicker.dataPath;
                    } else {
                        prePicker.dataPath = dataPath;
                    }
                } else {
                    picker['@'] = { dataPath };
                }
            }
            // route.picker = picker;
            return picker;
        }
    })(pages[name]);
}

function bindPage(rule, index) {
    // if()
    return Object.assign(inheritByPath(rule, routeMap), {
        'component': getComponent(rule)
    });
}

function logHistory(to, from, next) {
    console.log('------------ history ------------');
    console.log(to, from);
    next();
}

const bindedRoutes = routes.rules.map(bindPage);

let mode = "hash";
const router = {

    // 返回单个配置（bindedComponent）
    getRouteByName: function (name) {
        return routeMap[name] || null;
    },

    // 返回原始配置数组
    getRules: function () {
        return routes.rules;
    },

    // 返回绑定了组件的数组，为store提供
    getBindedRoutes: function () {
        return bindedRoutes;
    },

    getParamsMap: function () {
        return routes.paramsMap;
    },
    getPagePicker(name) {
        if (mode === "hash") {
            const bindRoutes = router.getBindedRoutes();
            for (let i = 0; i < bindRoutes.length; i++) {
                if (bindRoutes[i].name === name) {
                    return bindRoutes[i].component ? bindRoutes[i].component : null;
                }
            }
        }
        else {
            const route = router.getRouteByName(name);
            return route.component ? route.component.getPicker() : null;
        }
    },

    getInstance() {
        return this.$router;
    },

    init(routerMode) {
        console.log("****");
        console.log(router.getBindedRoutes());
        mode = routerMode;
        const $router = new VueRouter({
            'mode': routerMode,
            'routes': router.getBindedRoutes()
        });

        $router.beforeEach(logHistory);
        let path = routerMode === "hash" ? location.hash.split("#")[1] : (location.pathname + location.search + location.hash)
        const matchedRoute = $router.match(path);
        this.$router = $router;
        window.router = this.$router;
        return matchedRoute.name;
    }
};


export default router;
