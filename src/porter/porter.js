/**
 * 守门人
 * @author chengxiao
 */
import {validator, every} from '../lib/validator';
import portals from './portals';
import axios from 'axios';
import qs from 'qs';
import config from '../config.js';
import {util} from '../lib/tools';
const {isRealValue} = util;
const pathSep = '/';
const vipKey = '!';
const { ENV } = config;

const isMultipart=function(headers){
   return headers && headers["Content-Type"] === 'multipart/form-data';
};

// 根据规则抽取需要的对象
function genPackage(raw, rules, allowExtraKeys) {
    raw = raw || {};
    rules = rules || {};

    return Object.keys(raw).reduce((pack, key) => {
        let value = raw[key];
        let rule = rules && rules[key];
        let hasRule = isRealValue(rule); // 是否有校验规则

        if(vipKey === key) {
            Object.assign(pack, value);
            return pack;
        }

        if(hasRule) {
            if(!validate(value, rule)) {
                // string 类型的规则值,被当作默认值
                if('string' === typeof rule) {
                    pack[key] = rule;
                } else {
                    throw new TypeError('Bad data value: "' + value + '" of key: "' + key + '"');
                }
            } else {
                pack[key] = value;
            }
        } else {
            if(allowExtraKeys) {
                if(isRealValue(value)) {
                    pack[key] = value;
                }
            }
        }
        return pack;
    }, {});
}

function genQueryStr(qobj) {
    const arr = [];
    for(let key in qobj) {
        arr.push(key + '=' + encodeURIComponent(qobj[key]));
    }
    return arr.join('&');
}

function validate(value, pattern) {
    if(pattern === false) {
        return true;
    }
    if(!isRealValue(value)) {
        return false;
    } else {
        if(validator.isFn(pattern.test)) {
            return pattern.test(value);
        }
        return true;

    }
}

function genUri() {
    let uri = 'error',
        key,
        params;
    if(arguments.length > 1) {
        uri = arguments[0];
        params = arguments[1];
        for(key in params) {
            uri = uri.replace(`:${key}`, encodeURIComponent(params[key]));
        }
    }
    return uri;
}

/**
 * 序列化http的参数等信息
 * @param {string} portalName 接口名，见portals配置
 * @param {Object} queries 请求参数（url上的）
 * @param {Object} data 请求数据
 * @param {Object} params path中的参数/class/:id 同send
 */
class Prepares{
    constructor(portalName, queries, data, params) {
        const portal = portals[portalName];
        if(!portal) {
            throw('Portal "' + portalName + '" not found.');
        }

        const headers = { };

        const qobj = genPackage(queries, portal.queries, portal.allowExtraQueries);
        let queryStr = genQueryStr(qobj);

        let currURI = location.pathname;
        let pathArr = currURI.split(pathSep);
        let fileName = pathArr.pop();
        let currPath = pathArr.join(pathSep);
        let uri = portal.uri;

        // format 和 ActionType是互斥的，后者优先级高
        if(!('format' in qobj)) {
            headers['Action-Type'] = 'json';
        }

        if(uri === '&' || uri === "@") {
            uri = currURI + '?';
        } else {
            if((/^http:\/\/|^https:\/\//).test(uri)&&uri.indexOf(pathSep) !== 0) {
                uri = currPath + pathSep + uri;
            }
            if(params) {
                uri = genUri(uri, params);
            }
        }

        if(config.MODE_DEBUG) {
            uri = '/async' + uri;
        }

        if('post' === portal.method) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        Object.assign(headers, portal.headers);

        if(queryStr && uri.indexOf('?') !== -1) {
            queryStr = '&' + queryStr;
        }
        // 如果在portals中配置了 noHttpCache: true 则拼装随机值，防止缓存和阻塞
        if(portal.noHttpCache) {
            queryStr = queryStr + "&" + Math.random()
        }

        if(!isMultipart(headers)){
            data = genPackage(data, portal.data, portal.allowExtraData);
        }

        this.content = {
            uri,
            queryStr,
            headers,
            url: uri + "?"+queryStr,
            data: data,
            method: portal.method
        };

    }
    toString() {
        return JSON.stringify(this.content);
    }
    isEqual(prepares) {
        if(! (prepares instanceof Prepares) ) {
            return false;
        }
        return this.toString() === prepares.toString();
    }


}

function send(prepares){
    const {content} = prepares;
    return axios(content.url, {
        method: content.method,
        data: content.data,
        transformRequest: [data => {
            return isMultipart(content.headers) ? '' : qs.stringify(data);
        }],
        headers: content.headers

    }).then(res => {
        return res;
    });
}

// 保存最近一次请求的http参数序列化对象，每次发出请求覆盖，当某一请求返回时，如果该值没有被覆盖，则被置空
var requestingPrepares = null;
var cache = {};

const porter = {
    vipKey,
    reload(portalName) {
        return send(cache[portalName] || new Prepares(portalName));
    },

    /**
     * 发送请求
     * @param {string} portalName 接口名，见portals配置
     * @param {Object} queries 请求参数（url上的）
     * @param {Object} data 请求数据
     * @return {Promise} promise
     */
    send(portalName, queries, data, params) {
        const portal = portals[portalName];
        if(portal===null){
            return new Promise(function(resolve, reject){
                resolve({
                    data: {}
                });

            });
        }
        const prepares = new Prepares(portalName, queries, data, params);
        // 这货如果跟最后一个正在请求中的参数完全一致，认为重复发送
        if(prepares.isEqual(requestingPrepares)) {
            return new Promise(function(resolve, reject){
            

                let res = {
                        code: 1,
                        error: {
                            message: "请不要重复提交"
                        }
                    };
                resolve({
                    data: { tplData: res}
                });
     
            });
        }

        requestingPrepares = prepares;

        return send(prepares).finally(res => {
            if(requestingPrepares === prepares) {
                requestingPrepares = null;
            }

            cache[portalName] = prepares;

            return res;
        });
    }

};


export default porter;

