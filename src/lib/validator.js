
const validator = {
	isFn(v) {
		return 'function' === typeof v;
	},

	isArr: Array.isArray,

	isBln(v) {
		return !!v === v;
	},

	isNum(v, includeNumStr) {
		if(false === includeNumStr) {
			return +v === v;
		}
		return !isNaN(+v);
	},

	isStr(v) {
		return String(v) === v;
	},

	isTester(v) {
		return v && validator.isFn(v.test);
	},

	hasPath(path) {

	}
};

function args(args) {
	// TODO 解析字符串到值
	// this._args = args;
	return this;
}

// 替换小写字母
const rePrefix = /^[a-z]+/;

const _ = Object.keys(validator).reduce((res, name) => {
	res[name.replace(rePrefix, '').toLowerCase()] = {
		'test': validator[name],
		args
	}
	return res;
}, {});

function getValidator(type) {
	return function t(...names) {
		return v => {
			return names[type](name => {
				let arr = name.split(':');
				name = arr.shift();
				if(_[name]) {
					return _[name].args(arr).test(v);
				} else {
					return new RegExp(name).test(v);
				}
			});
		};
	};
};


// 验证满足所有条件的时候为true
const every = getValidator('every');
// 或
const some = getValidator('some');

export {
	validator,
	every,
	some
};
