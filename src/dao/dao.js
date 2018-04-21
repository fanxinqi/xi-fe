import router from '../router/router';
import porter from '../porter/porter';
import {util} from '../lib/tools';
import config from './config';
import DataPicker from './data-picker';
const {getDataByMap, defaults, decodeHtml, isRealValue} = util;

const {pageDataKey, pickerConfig} = config;

const _cache = JSON.parse(localStorage.getItem('_cache'))||{};
const commonDataPicker = new DataPicker(config.picker);
const statusDataPicker = new DataPicker(config.picker);

const getCommonQueryFilter = function(queries, data) {
    return function(key, dataKey, value) {
        // 如果get&post参数里都没有相应的key，则添加common key
        let noConflict = false;
        if(defaults(queries[dataKey], data[dataKey]) === null) {
            noConflict = true;
        }
        const rule = config.picker[dataKey];
        if(noConflict) {
            if(!rule) {
                return true;
            }
            return !(rule.defaultValue === value);
        }
        return false;
    }
};

/**
 * 获取数据,返回promise对象
 * @param {string} name 数据分支的名称
 * @param {Object} queries 请求的get参数对象,可选
 * @param {Object} data 请求的post数据对象,可选
 * @param {Object} params 对应path中的变量,如:":projectID"
 * @return {Promise} promise
 */
const x = function(name, payload, useCache) {
    let {queries, data, params, picker, pageID,token} = payload;

    return new Promise( function(resolve, reject) {
        
        if(useCache) {
            let cacheData = defaults(cache(pageID), cache(name));
            resolve({data: cacheData});
            return ;
        }

        const resultHandler = function(res) {
            const pickerTypes = defaults(pickerConfig[name], pickerConfig['*']);
            let data = parseDataByPicker(res, picker, pickerTypes);

            cache(pageID || name, data);
            resolve({data});

        };
        const errorHandler = function(err) {
            reject({message: 'Oooops~ 网络开小差了~', err});
            console.error(err);

        };


        if('reload' === name) {
            return porter.reload(name)
                .then(resultHandler)
                .catch(errorHandler);
        }

        // common queries
        if(!config.noCommonQueryKeys[name]) {
            queries = queries || {};
            data =  data || {};

            const commonQueries = getDataByMap(commonDataPicker.get(), config.commonQueries, getCommonQueryFilter(queries, data));

            queries[porter.vipKey] =token?Object.assign(commonQueries,{token}):commonQueries;
        }

        return porter.send(name, queries, data, params)
            .then(resultHandler)
            .catch(errorHandler);
    } );
};

const getPageData = function(pageID, payload, useCache) {
    payload.pageID = pageID;
    return x(payload.portal?pageID:pageDataKey, payload, useCache);
};

const decodeXSS = function(data={}) {
    let str = JSON.stringify(data);

    str = decodeHtml(str, true);

    return JSON.parse(str);
};


const parseDataByPicker = function(data, picker, pickerTypes, cavityTypes) {
    data = decodeXSS(data);
    picker = picker || {};

    const pageDataPicker = new DataPicker(picker);

    const dataPicker = pickerTypes ? statusDataPicker : commonDataPicker;

    return dataPicker
        .pick(data, pickerTypes)
        .merge(pageDataPicker, cavityTypes)
        .get();
};


const init = function(data, routeInfo) {
    data = parseDataByPicker(data, routeInfo.picker);
    cache(routeInfo.name, data);
    return data;
};

const cache = function(name, value) {
    let storage=JSON.parse(localStorage.getItem("_cache"))||{};
    if(isRealValue(value)) { 
        storage[name]={
            value,
            time:new Date().getTime()
         };
    }
    syncStorage(storage);
    return storage[name];
};

const clearCache=function(){
    localStorage.removeItem("_cache")
}
const syncStorage = function(data){
    localStorage.setItem("_cache",JSON.stringify(data))
}


export default {
    getPageData,
    config,
    init,
    cache,
    clearCache,
    x
};
