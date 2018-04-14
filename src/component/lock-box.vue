<template>
    <span class="lock-box" @mouseenter="hoverOn" @mouseleave="hoverOff">
        <span :style="{width: width + 'px'}" class="locker">
            <span ref="innerBox" class="inner-box">
                {{ contents }}
            </span>
        </span>
        <span :style="hintStyle" :class="['hint-box', {on: hover}]">
            {{contents}}
        </span>
    </span>
</template>

<style>

.lock-box {
    position: relative;
    overflow: visible;
    white-space: nowrap;
    vertical-align: top;
    display: inline-block;
}
.lock-box .locker {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: inherit;
}
.lock-box .locker .inner-box {
    overflow: visible;
}
.lock-box .hint-box {
        position: absolute;
        overflow: visible;
        top: -1px;
        left: -7px;
        padding: 0px 6px;
        border: 1px solid #ddd;
        border-radius: 2px;
        display: none;
        background: #fff;
        box-shadow: 1px 1px 5px -1px #ccc;
        z-index: 9;
}
.lock-box .hint-box.on {
    display: block;
}
</style>

<script>
const reLock = /^([<>=])?(auto|\d+|\d+\%)$/i;
const getInnerBox = function(box) {
    return this.$refs.innerBox;
};

const getInitState = function() {
    const lock = this.$props.lock;
    const match = reLock.exec(lock);

    const st = match[1] || '=';
    let value = match[2] || 'auto';

    // 处理百分比的情况，转换成0~1之间的小数
    if(value.indexOf('%') > 0) {
        value = Math.max(0, +(value.slice(0, -1)) / 100);
    }

    // 最大最小限制， 由于<=1时用作百分比，所以取最小可设定值为1.1
    if(st === '>' || st === '<') {
        value = Math.max(1.1, +value);
    }

    if(st === '=') {
        if('auto' !== value) {
            value = +value;
        }
    }

    
    this.initValue = value;
    this.condition = st;


    let width = 'auto';


    return {st, width, hover: 'off', contentWidth: 0};

}
const getBoxWidth = function() {
    const $parent = this.$inner.parentNode;
    const scrollWidth = $parent.scrollWidth;
    const offsetWidth = $parent.offsetWidth;
    const bcr = this.$inner.getBoundingClientRect();

    if(scrollWidth > offsetWidth) {
        return Math.max(scrollWidth, Math.ceil(bcr.width));
    }

    return Math.ceil(bcr.width);
};
///////////////////////////////////////////////////////////////////////////////////

const hoverOn = function(e) {
    if(this.contentWidth > this.width) {
        this.hover = true;
    }
};

const hoverOff = function(e) {
    this.hover = false;
};

const lock = function() {
    let width = getBoxWidth.call(this);
    this.contentWidth = width;

    if(this.initValue <= 1) {
        width = width * this.initValue;
        this.width = width;
    } else {
        if(this.condition === '<') {
            if(width < this.initValue) {
                this.width = width;
            } else {
                this.width = this.initValue;
            }
        }
        if(this.condition === '>') {
            if(width > this.initValue) {
                this.width = width;
            } else {
                this.width = this.initValue;
            }

        }
    }

};

const LockBox = {
    methods: {
        hoverOn: hoverOn,
        hoverOff: hoverOff,
    },
    data: function() {
        return {
            top: '-1px',
            width: 'auto',
            hover: false
        };
    },
    props: ['contents', 'lock', 'hint'],
    created() {
        const hint = this.$props.hint;
        this.state = getInitState.call(this);

        const hintStyle = {};
        if(hint === 'top') {
            hintStyle.top = '-100%';
        } else if(hint === 'bottom') {
            hintStyle.top = '100%';
        } else {
            hintStyle.top = '-1px';
        }

        this.hintStyle = hintStyle;

    },

    mounted() {
        this.$inner = getInnerBox.call(this);
        let width = 'auto';

        if(this.initValue === 'auto') {
            width = getBoxWidth.call(this);
        } else {
            width = this.initValue;
        }
        lock.call(this);
    },

    updated() {
        if(this.contentsChanged) {
            lock.call(this);
            this.contentsChanged = false;
        }

    },


    watch: {
        contents: {
            handler() {
                this.contentsChanged = true;
            }
        }
    },

    install(Vue) {
        Vue.component('Lock-box', LockBox);
    }
};
export default LockBox;

</script>
