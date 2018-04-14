/**
 * Modifiers for filter data.
 * @author chengxiao
 */
const defaultSepDate = '-';
const defaultSepTime = ':';
const reTimestamp = /^\d{13,}$/;
const reSingleNum = /^(\d)$/;

const REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
const REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;
const REGX_TRIM = /(^\s*)|(\s*$)/g;
const HTML_DECODE = {
    "&quot;": '"',
    "&lt;": "<",
    "&gt;": ">",
    "&copy;": "©",
    "&amp;": "&",
    "&nbsp;": " ",
    "&rdquo;": "”",
    "&bdquo;": "„",
    "&hellip;": "…",
    "&middot;": "·",
    "&rsaquo;": "›",
    "&ordf;": "ª",
    "&circ;": "ˆ",
    "&ldquo;": "“",
    "&mdash;": "—",
    "&rsquo;": "’",
    "&ordm;": "º",
    "&lsaquo;": "‹",
    "&ndash;": "–",
    "&sbquo;": "‚",
    "&rdquo;": "”",
    "&lsquo;": "‘",
    "&permil;": "‰",
    "&tilde;": "˜"
};

const toString = Object.prototype.toString;
const slice = Array.prototype.slice;
function noop(){};

function isSameType(v1, v2) {
    return toString.call(v1) === toString.call(v2);
};

function genDefault(data, keys, defaultValue) {
    keys.forEach(key => {
        if(!isSameType(data[key], defaultValue)) {
            // TODO 不能引用同一个对象
            data[key] = defaultValue;
        }
    });
};

// 继承路径？
function inheritByPath(node, nodes, key) {
    key = key || 'inherits';
    const ringMap = {};
    const chain = [node];
    let path;

    while(path = node[key]) {
        if(ringMap[path]) {
            throw new Error('Circular inherits: ' + chain.map(node => node[key]).unshift(path).join(' < '));
        }
        node = getDataByPath(nodes, path);
        if(!node) {
            console.warn('Super node`' + path + '` not defined', chain);
            node = {};
        }
        chain.unshift(node);
        ringMap[path] = 1;
    }
    chain.unshift({});
    return Object.assign.apply(null, chain);
};

function each(fn, res) {
    const obj = this;
    return Object.keys(obj).reduce((res, key) => {
        const value = obj[key];
        const nv = fn(key, value, res, obj) || {key, vlaue};

        if(Array.isArray(res)) {
            res.push(nv.value);
        } else if(isRealValue(nv.value)) {
            // 如果用户不返回value则不做任何事（通常是用户自己处理）
            res[nv.key || key] = nv.value;
        }
        return res;
    }, res || {});
}


function createDateObj(value) {
    if(!value) {
        return null;
    }

        if(reTimestamp.test(value)) {
            value = +value;
        } else {
            let v;
            do {
                v = value;
                value = value.replace(defaultSepDate, '/');
            } while( v !== value );
        }


        let d = new Date(value);

        if(!(+d)) {
            return null;
        }

        return d;

}
function date(value, args) {
    args = args || {};
    const sepDate = args.sep || defaultSepDate;

    const d = createDateObj(value);


    if(!d) {
        return value;
    }

    const ret = [d.getFullYear(), 
        String(d.getMonth() + 1).padLeft(2, '0'),
        String(d.getDate()).padLeft(2, '0')
    ].join(sepDate);

    return ret;
}

function dateTime(value, args) {
    args = args || {};
    const sepDate = args.sepDate || defaultSepDate;
    const sepTime = args.sepTime || defaultSepTime;
    const hasSecond = args.onlySecond == true ? false : true; // 时间只显示到分钟

    const d = createDateObj(value);

    if(!d) {
        return value;
    }

    const dateArr = [
        d.getFullYear(),
        String(d.getMonth() + 1).padLeft(2, '0'),
        String(d.getDate()).padLeft(2, '0')
    ];
    const timeArr = [
        String(d.getHours()).padLeft(2, '0'),
        String(d.getMinutes()).padLeft(2, '0')
    ];

    if(hasSecond) {
        timeArr.push(String(d.getSeconds()).padLeft(2, '0'));
    }
    return dateArr.join(sepDate) + ' ' + timeArr.join(sepTime);
}

//==========================================

const reOptional = /^\[([^\[\]]+)\]$/;
function getNodeInfo(key) {
    let name = key;
    let isOptional = false;
    if(reOptional.test(key)) {
        name = RegExp.$1;
        isOptional = true;
    }
    return {
        name,
        isOptional
    };
}

function typeTester(value, type) {
    if(!type) {
        return isRealValue(value);
    }

    return Object.prototype.toString.call(value).indexOf(type) > -1;
}

const reCheckerConf = /^\(([^\)]+)\)/;
function parsePath(path) {
    let checkerStr = '';
    let checkers = [];
    path = path.replace(reCheckerConf, ($$, $checker) => {
        if($checker) {
            checkerStr = $checker;
        }
        return '';
    });
    if(checkerStr) {
        checkers = checkerStr.split('&');
    }

    const checker = value => {
        if(checkers.every(ck => {
            const a = ck.split(':');
            const testValue = getDataByPath(value, a[0]);
            return typeTester(testValue, a[1]);
        })) {
            return value;
        }
        return null;
    };

    return {
        path,
        checker

    };

}

/**
 * 根据dataPath取到指定的数据分支
 * @param {Object} data
 * @param {string} path data path: 形如:a.b.c
 * @param {any} defaultValue 缺省值
 */
function getDataByPath(data, path, defaultValue, checker, excludes) {
    if(!isRealValue(path)) {
        return defaultValue;
    } else if(path === '') {
        return data;
    }

    const pathConf = parsePath(path);
    checker = checker || pathConf.checker;
    path = pathConf.path;

    const paths = pathConf.path.split('|');
    if(paths.length > 1) {
        let aa =  defaults.apply(null, paths.map(p => getDataByPath(data, p, null, checker, excludes)));
        return aa;
    }
    let currNode = data;
    let prevNode = currNode;
    const pathArr = path.split('.');

    while(isRealValue(currNode, excludes) && pathArr.length) {
        const key = pathArr.shift();

        const nodeInfo = getNodeInfo(key);
        prevNode = currNode;
        currNode = currNode[nodeInfo.name];
        if(undefined === currNode) {

            // if node name is optional
            if(nodeInfo.isOptional) {
                currNode = prevNode;
            } else {
              //  console.log.apply(console, console.color('Data branch not exists: [ .' + nodeInfo.name + '.' + pathArr.join('.') + ' ] ', 'black', 'yellow', data));
            }
        }
    }

    return defaults(checker(currNode), defaultValue);
}

function getDataByMap(srcData, map, defaultData) {
    const data = srcData || {};
    defaultData = defaultData || {};
    const res = {};
    for(let key in map) {
        let dataPath = map[key];
        let defaultValue = defaultData[key];
        if('string' !== typeof dataPath && dataPath) {
            dataPath = dataPath.dataPath;
            defaultValue = defaults(dataPath.defaultValue, defaultValue);
        }
        let value = getDataByPath(data, dataPath, defaultValue);
        if(isRealValue(value)) {
            res[key] = value;
        }
    }

    return res;
    
}

// 检测值是否存在
function isRealValue(value, excludes) {
    if(!Array.isArray(excludes)) {
        excludes = [];
    }
    return defaults(value) !== null && excludes.every(ex => ex !== value);
}

function defaults() {
    let args = [].slice.call(arguments, 0);
    for(let i = 0, l = args.length; i < l; i++) {
        let v = args[i];
        if('undefined' !== typeof v && null !== v && v === v) {
            return v;
        }
    }
    return null;
}

function excludes() {
    
}
/**
 * value | map({'a': 'b'}, 'b')
 */
function map(value, map, defaultValue) {
    map = map || {};
    return defaults(map[value], defaultValue, value, '');
}
function encodeHtml(s) {
    s = String(s);
    return s.replace(REGX_HTML_ENCODE, ($0) => {
        let c = $0.charCodeAt(0);
        c = (c === 0x20) ? 0xA0 : c;

        return '&#' + c + ';';
    });
}
function decodeHtml(s, transfer) {
    s = String(s);
    return s.replace(REGX_HTML_DECODE, ($0, $1) => {
        let c = HTML_DECODE[$0];
        if(c === undefined) {
            if(!isNaN($1)) {
                // Maybe is Entity Number
                c = String.fromCharCode(($1 == 160) ? 32 : $1); 
            } else {
                c = $0;
            }
        } 
        if(transfer && c === '"') {
            c = '\\\"';
        }
        return c;
    });
}

function clone(data) {
    return data === undefined ? data : JSON.parse(JSON.stringify(data));
}


function defineGetter(prop, data) {
    return Object.defineProperty(this, prop, {
        get: new Function(`return ${JSON.stringify(data)};`)
    });
}

function doFilter(data, filterExpression) {
    if('function' === typeof filterExpression) {
        return filterExpression(data);
    }
    if('string' === typeof filterExpression) {
        return filterExpression.split('|').reduce((res, filterExp) => {
            let filterDef = filterExp.split(':');
            let filterName = filterDef.shift();
            if(filter[filterName]) {
                filterDef.unshift(res);
                return filter[filterName].apply(null, filterDef);
            }
            return res;
        }, data);
    }
    return data;
}

function not(value) {
    return !value;
}

function _replacerCamel($m) {
    return $m.slice(1).toUpperCase();
}

// 带中划线的字符串，转换为驼峰命名（camelCase）
function kebabToCamel(value) {
    return value.replace(/\-[a-z]/gi, _replacerCamel);
}

const oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

const filter = {
    '!': not,
    '!!': value => !not(value),
    not,
    map,
    exec: doFilter,
    date,
    encodeHtml,
    decodeHtml,
    dateTime
};

const util = {
    clone,
    defineGetter,
    oneOf,
    map,
    encodeHtml,
    decodeHtml,
    defaults,
    isRealValue,
    getDataByPath,
    getDataByMap,
    kebabToCamel
};

export  {
    filter,
    doFilter,
    util,
    inheritByPath
};
