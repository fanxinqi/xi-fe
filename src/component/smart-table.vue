<template>
    <div class="smart-table">
        <Row key="title" v-if="filterRows.length" class="filter-row">
            <template v-for="filterRow in filterRows">
                <Col span="3" :style="filterRow.labelStyle" class="filter-row-label">
                    <span ref="elFilterLabels" :title="title">{{filterRow.title}}</span>
                </Col>
                <Col>
                    <Radio-group v-model="fv[filterRow.dataIndex]" type="button" @on-change="onFilter($event, filterRow)">
                        <Radio :label="fvAll">全部</Radio>
                        <Radio v-for="filter in filterRow.filters" :label="filter.label">
                            <Lock-box :contents="filter.label" hint="top" lock="<80" ></Lock-box>
                        </Radio>
                    </Radio-group>
                </Col>
            </template>
        </Row>
        <slot name="top"></slot>
        <Row v-if="searchBox" type="flex" justify="end" class="search-bar">
            <Col span="9">
                <slot name="top-left"></slot>
            </Col>
            <Col span="9">
                <slot name="top-right"></slot>
            </Col>
            <Col span="6">
                <Input icon="search" v-model="kw" type="text" :value="keyword" :placeholder="searchBoxPlaceholder" @on-change="onSearch" ></Input>
            </Col>
        </Row>
        <Table
            ref="itable"
            :show-header="showHeader"
            @on-selection-change="onSelectionChange"
            @on-sort-change="onSortChange"
            @on-select-all="onSelectAll"
            :data="list"
            class="data-table"
            :columns="cols"
            
        ></Table>
        <Row v-if="showPage" type="flex" justify="end" class="pagebar">
            <Col span="24">
                <Page :current="currentPage" @on-change="onPageChange" :total="total || list.length" :page-size="pageSize"></Page>
            </Col>
        </Row>
    </div>
</template>
<style>
.smart-table::after {
    display: block;
    content: '.';
    visibility: hidden;
    clear: both;
    height: 0;
    overflow: hidden;
}
.smart-table .key-word {
    color: red;
}   
.smart-table .search-bar {
    margin: 16px 0;
}
.smart-table .pagebar {
    float: right;
    margin-top: 15px;
    overflow: hidden;
}
.smart-table .filter-row {
    margin-bottom: 16px;
    margin-top: 16px;
}
.smart-table .cont-for-lock-box .ivu-table-cell {
    overflow: visible;
}
.smart-table .filter-row-label {
    color: #aaa;
    max-width: 136px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: content-box;
    line-height: 32px;
    height: 32px;
    text-align: right;
    padding: 0 12px 0 0;
}

</style>

<script>
import Vue from 'vue';
/**
 *
 * table with filters and searchers
 * @author chengxiao
 */

const reEmpty = /^\s*$/;
const filterValueAll = 'all';
/**
 * 去重
 * @param {Array} arr
 * @return {Array} 
 */
const unique = function(arr) {
    let obj = {};
    for(let i = 0, l = arr.length; i < l; i++) {
        obj[arr[i]] = true;
    }

    return Object.keys(obj);
};

const isEmpty = function(value) {
    const type = typeof value;

    if('undefined' === type) {
        return true;
    }
    if('object' === type && !value) {
        return true;
    }
    return false;
};

/**
 * 生成过滤菜单数据对象
 * @param {string} text 当前字段的值
 * @param {Object|function} filter
 * @return {object} {text, value}
 */
const genFilterItem = function(text, filter) {
    const filterType = typeof filter;
    let obj = {label: text, value: text};
    switch(filterType) {
        case 'object': obj.text = filter[text] || text; obj.value = text; break;
        case 'function': {
            const ret = filter(text);
            if('string' === typeof ret) {
                obj.label = obj.value = ret;
            } else {
                return filter(text);
            }
            break;
        }
    }

    return obj;
};

/**
 * 从指定字段中查找所有的值并去重，作为菜单项
 * @param {string} key 字段名
 * @param {object|function} filter
 * @see genFilterItem 
 * @return {Array<{object}>} 
 */
const collectFilterItems = function(key, filter) {
    const filterItems = unique(
            this.data.map(value => {
                return value[key]; //{text: String(v), value: v};
            })
        ).map(text => {
            return genFilterItem(text, filter);//{text: text, value: text};
    });
    const tmp = {};
    return filterItems.filter(obj => {
        if(obj.label in tmp) {
            return false;
        } else {
            tmp[obj.label] = true;
            return true;
        }
    });
};

/**
 * default match function
 * @return {Function} match
 */
const match = function(key) {
    return (text, record, index) => {
        return text == record[key];
    };
};
const doFilter = function(filter, key) {
    if(filter.match) {
        return filter.match(key);
    }
    return match(key);
};


const addFilter = function(name, match) {
    let f = this.filterConfs;
    if(!f[name]) {
        f[name] = { match };
    }
};

const getDefaultValue = function(item, me) {
    return item.defaultValue || me.defaultValue || '';
};

const iterGenCol = function(item) {
    if(item.filter) {
        const filter = item.filter.genItem || item.filter;
        let filters = null;

        item.filterMultiple = false;

        // 自定义筛选项
        if(Array.isArray(filter)) {
            filters = filter;
        } else {
            filters = collectFilterItems.call(this, item.key, filter);
        }

        if(filters.length > 1) {

            // 外部按钮的筛选器
            if(item.buttonFilters) {
                genExtFilters.call(this, filters, item);
                addFilter.call(this, item.key, doFilter(item.filter, item.key));
            } else {
                // 表头筛选器
                item.filters = filters;
                item.filterMethod = doFilter(item.filter, item.key);
            }
        }
    }
    if(item.lock) {
        item.className = 'cont-for-lock-box';
    }
    return {...item,
        render: (h, params) => {
            
            let value = (params.row[params.column.key]);// 'sss<span class="key-word">key</span>';
            if(isEmpty(value)) {
                value = getDefaultValue(item, this);
            }

            value = String(value);

            if(item.pattern) {
                if('function' === typeof item.pattern) {
                    value = item.pattern(value)? value: getDefaultValue(item, this);
                } else if(item.pattern.test) {
                    value = item.pattern.test(value)? value: getDefaultValue(item, this);
                }
            }
            // 默认使用高亮关键字功能
            if(this.hlKeyword !== false) {
                if(this.searchFields && this.searchFields.some(field => item.key === field)) {
                    value = highlight.call(this, h, value);
                }
            }

            if(item.lock) {
                value = h('Lock-box', {
                    props: {
                        contents: value,
                        lock: item.lock
                    }
                });
            }

            if(item.modifier) {
                let modifierDef = item.modifier;
                let modifierType = typeof modifierDef;
                if('string' === modifierType)  {
                    // TODO parse args
                    modifierDef = {
                        name: modifierDef
                    };
                }
                if(!modifierDef.name) {
                    // no modifier found.
                    throw new Error('modifier name not specified.');
                } else {
                    let modifier = Vue.filter(modifierDef.name);
                    if(modifier) {
                        value = modifier(value, {
                            ...modifierDef.args
                        });
                    } else {
                        console.log('%c modifier < ' + modifierDef.name + ' > not found.', 'color: #000; background-color: yellow;');
                    }
                }
            }

            if(item.render) {

                // 为map对象时，进行数据映射
                if(typeof item.render === 'object') {
                    value = item.render[value] || value;
                } else {
                    value = item.render(h, params, value);
                }
            }


            return  h('div', {}, [value]);
        }
    };
};
const getDataList = function(data) {
    if(data) {
        return data.slice(0);
    }
    return [];
}

/**
 * 按照order插入排序
 * @param {Row} row
 * @param {int} order
 */
const insertFilterRow = function(row, order = 0) {
    const rows = this.filterRows;
    let l = rows.length;
    let pos = l;
    for(let i = 0; i < l; i++)  {
        let curr = rows[i];
        let next = row[i+1];
        if(next) {
            if(order > curr.order && order < next.order) {
                pos = i;
                break;
            }
        } else {
            if(order > curr.order) {
                pos = i;
                break;
            }
        }
    }
    rows.splice(pos, 0, row);

};

//////////////////////////////////////////////////////////////////////////////////
//
const iterColumnFilter = function(item, index) {
    const fv = this.fv;
    const fvc = this.filterConfs;
    for(let f in fvc) {
        let cf = fvc[f];
        let value = fv[f];

        // 全部
        if(value === filterValueAll) {
            return true;
        }
        if(value && !cf.match(value, item, index)) {
            return false;
        }
    }
    return true;
};


const iterSearchFilter = function(item) {
    const keyword = this.kw;
    if(!keyword || keyword === this.fvAll) {
        return true;
    }
    return this.searchFields.some(f => {
        return String(item[f]).indexOf(keyword) >= 0;
    });
};

/**
 * 高亮关键字
 * @param {Object} item 当前数据对象
 */
const highlight = function(h, str) {
    const key = this.kw;
    if(!key) {
        return str;
    }
    str = String(str);
    let arr = str.split(key);
    let r = [];

    for(let i = 0, l = arr.length; i < l; i++) {
        let curr = arr[i];
        r.push(curr);
        if(!(l === 1 || l - 1 === i)) {
            r.push('<b key={i} class="key-word">{key}</b>');
        }
    }

    return r;
}

const onFilter = function(e, row) {
    this.$emit('on-filter', {...this.fv});
    doRender.call(this);
};
const onSearch = function(e) {
    this.$emit('on-search', this.kw);
    doRender.call(this);
};

const search = function(keyword = '') {
    if(this.kw === keyword) {
        return null;
    }
    
    if(!this.searchFields || !this.searchFields.length) {
        return null;
    }

    doRender.call(this);
};

const genColumns = function() {
    if(!this.columns) {
        return [];
    }

    // 先处理hidden
    return this.columns.filter(col => {
            return !col.hidden;
        }).map(iterGenCol, this);


};

const genExtFilters = function(filters, col) {
    const buttonFilterConfig = col.buttonFilters;

    const title = buttonFilterConfig.label || col.title;
    let labelStyle = buttonFilterConfig.labelStyle || {};

    const filterRow = {
        filters,
        dataIndex: col.key,
        title,
        labelStyle
    };
    this.$set(this.fv, col.key, col.filterValue || filterValueAll);
    insertFilterRow.call(this, filterRow, buttonFilterConfig.order);
};
/**
 * 根据当前筛选值和搜索关键字，过滤数据
 */
const doRender = function() {
    let list = this.origData;
    list = list.filter(iterSearchFilter, this)
               .filter(iterColumnFilter, this);

    this.list = list;
};

/**
 * reset filter lable width
 * 重新计算button filter的标题宽度
 */
const resetFLW = function($els) {
    if(!$els) {
        return ;
    }

    let width = $els.reduce((prev, el) => {
        const width = el.getBoundingClientRect().width;
        return Math.max(width, prev);
    }, 0);
    width = Math.ceil(width);
    $els.forEach(el => {
        el.parentNode.style.width = width + 'px';
    });
}

const updateFilters = function() {
    const fv = this.filterValues;
    for(let key in fv) {
        this.fv[key] = fv[key];
    }
};

const mode = {
    'local': '本地模式, 不与服务器交互',
    'remote': '远程模式'
};


//////////////////////////////////////////////////////////////////////////////

const SmartTable = {
    data: function() {
        return {
            list: [],
            cols: [],
            fv: {},
            kw: '',
            fvAll: filterValueAll
        };
    },

    methods: {
        'onSearch': onSearch,
        'onPageChange': function(...args) {
            this.$emit('on-page-change', ...args);
        },
        'onSelectionChange': function(...args) {
            this.$emit('on-selection-change', ...args);
        },
        'onSortChange': function(...args) {
            this.$emit('on-sort-change', ...args);
        },
        'onSelectAll': function(...args) {
           this.$emit('on-select-all', ...args); 
        },
        'onFilter': onFilter
    },
    created() {
        this.origData = getDataList.call(this, this.data);
        
        this.filterRows = [];
        this.filterConfs = {};
        this.cols = genColumns.call(this);
    },

    props: {

        // 见mode定义
        mode: {
            type: String,
            validator: function(value) {
                return value in mode;
            },
            default: 'remote'
        },

        // 在哪些列上进行搜索(当mode为local时有效)
        searchFields: {
            type: Array
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            require: true
        },
        columns: {
            type: Array,
            require: true
        },
        keyword: {
            type: String,
        },
        currentPage: {
            type: Number,
            default: 1
        },

        defaultValue: {
            type: String,
            default: ''
        },

        filterValues: {
            type: Object
        },
        total: {
            type: Number,
            default: 0
        },
        showPage: {
            type: Boolean,
            default: true
        },
        pageSize: {
            type: Number,
            default: 10
        }
    },

    watch: {
        keyword: {
            handler: function() {
                this.kw = this.keyword;
                doRender.call(this);
            }
        },
        filterValues: {
            handler: function() {
                updateFilters.call(this);
                doRender.call(this);
            },
            deep: true
        },
        data: {
            handler: function(data) {
                this.origData = getDataList.call(this, data);
                doRender.call(this);
            },
            deep: true
        }
    },


    mounted() {
        const keyword = this.$props.keyword;
        if(keyword) {
            this.kw = keyword;
        }
        doRender.call(this);
        resetFLW(this.$refs.elFilterLabels);
    },

    install(Vue) {
        Vue.component('Smart-table', SmartTable);
    }


}



export default SmartTable;
</script>
