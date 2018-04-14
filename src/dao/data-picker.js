/**
 * data picker
 * @author chengxiao
 *
 * 字符串表达式
 * >a.b.c;validator,validator;defaultValue;modifier,modifier;inherits<
 * >(cavitiy<
 * >a.b.c=defaultValue<
 * >>inherits<
 * >a.b.c<
 * >!validator<
 * >~modifier<
 * >-defaultValue<
 */

import {util, filter} from '../lib/tools';
const {clone, getDataByPath, defineGetter} = util;
const prePickerName = '@';


function getDataByPicker(srcData, picker) {
    if(!picker) {
        return srcData;
    }
    let res = getDataByPath(srcData, picker.dataPath, picker.defaultValue, null, picker.excludes);
    // filter.exec(res, picker.validator);
    return filter.exec(res, picker.modifier);

}

/*
* 根据type对picker进行分组
*/
function addPickerByType(picker, type) {
    const sp = this.group;

    if(!sp[type]) {
        sp[type] = [];
    }
    sp[type].push(picker);

}

/*
* 把picker放到map中，除了 @
*/
function addPickerByName(picker, name) {
    this.map[name] = picker;
}

class DataPicker {
    constructor(pickers) {
        this.prePicker = pickers[prePickerName] || null;
        this.group = {};
        this.map = {};
        this.res = {data: {}};

        const cavities = [];
        this.pickers = Object.keys(pickers).reduce(( res, key ) => {
            let picker = pickers[key];
            if(prePickerName === key) {
                return res;
            }
            if(picker.cavity) {
                // res.push({ picker });
                cavities.push(Object.assign({name: key},picker));
                return res;
            }
            picker = Object.assign(
                {name: key},
                picker
            );
            defineGetter.call(picker, 'defaultValue', picker.defaultValue);
           
            res.push(picker);
            let pickerType = picker.group || 'default';
            addPickerByType.call(this, picker, pickerType);
            addPickerByName.call(this, picker, key);

            return res;
        }, []);

        this.cavities = cavities;
        
    }

    pick(data, types) {
        data = getDataByPicker(data, this.prePicker);
        let pickers = this.pickers;
        if(types) {
            
            pickers = types.reduce((res, type) => {
                if(this.group[type]) {
                    res.push.apply(res, this.group[type]);
                }
                return res;
            }, []);
        }
        this.res.pre = data;
        this.res.data = pickers.reduce((res, picker) => {
            res[picker.name] = getDataByPicker(data, picker);
            return res;
        }, {});

        return this;

    }

    merge(dataPicker, types) {
        const res = this.res.data;
        dataPicker.pick(this.res.pre);
        this.cavities.forEach(cavity => {
            if(types) {
                if(types.indexOf(cavity.type) === -1) {
                    return ;
                }
            }
            res[cavity.name] = dataPicker.get(cavity.cavity);
        });

        return this;
    }

    get(key) {
        if(prePickerName === key) {
            return this.res.pre;
        }
        if('*' === key) {
            return this.res.data;
        }
        if(key) {
            return this.res.data[key];
        }
        return this.res.data;
    }

    validator() {
    }
 

}


// 字符串 Picker表达式
const stringPicker = /^>([^<]+)<$/i;
const stringSep = ';';
const stringMap = {
    '@': 'cavity',
    '>': 'inherits',
    '!': 'validator',
    '~': 'modifier',
    '=': 'defaultValue'
};

// 字符串表达式写全的情况下，顺序固定, 长度固定
const fullMaps = ['dataPath', 'validator', 'defaultValue', 'modifier', 'inherits'];

// 自动补全 DataPicker 字符串表达式
function autoComplete(str) {
    if(str.indexOf('=') !== 0) {
        str = str.replace(/=/ig, ';;');
    }
    const arr = str.split(stringSep);
    const len = arr.length;
    let expression = '';

    if(len === 1) {
        expression = aliasParse(str);
    } else {
        expression = fullMaps.reduce((res, val, index) => {
            return res += `${arr[index] || ''};`;
        }, '');
    }
    return expression;
}

function aliasParse(str) {
    let charVal = stringMap[str.charAt(0).replace(/\w/ig, '')];
    let expression = '';

    if(!charVal) {
        charVal = 'dataPath';
        // a 无意义只是占位
        str = 'a' + str;
    } 
    str = fullMaps.reduce((res, val, index) => {
        return res += `${charVal === val ? str.slice(1) : ''};`;
    }, '');
    return str;
}

function parseValidator(str) {
}

function parseModifier() {
}

DataPicker.isDataPicker = function(str) {
    return stringPicker.test(str);
};

DataPicker.parse = function(str) {
    const match = stringPicker.exec(str);
    let key;

    if(!match) {
        throw new TypeError('Invalid DataPicker expression.');
    }
    str = autoComplete(match[1]);

    let picker = str.split(stringSep).reduce((pre, val, index) => {
        key = fullMaps[index];
        if(key && val) {
            pre[key] = /^\{.+?\}$/.test(val) || val === '{}' ? JSON.parse(val) : val;
        }
        return pre;
    }, {});
    return picker;
};

DataPicker.stringify = function(picker) {
    if(!(picker instanceof Object)) {
        throw new TypeError('Invalid picker object');
    }
    let str =  fullMaps.reduce((res, key) => {
        return res += `${JSON.stringify(picker[key] || '')};`;
    }, '');

    return `>${str}<`.replace(/;<$/, '<');
};

export default DataPicker;
