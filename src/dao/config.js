/**
 * 通用数据配置，所有的key都将放入state初始化
 * 只有带dataPath的会作为commonKeys更新（自动更新）
 * @author chengxiao
 */

/**
 * 属性 group: 自定义分组
 * group = status：异步请求状态  成功  失败
 * group = session：页面同步和异步数据返回的值（会话）
 * group = common：每个异步请求都带的公共参数
 * group 未定义的话就是默认分组
 */
const picker = {
    '@': {
        dataPath: '(code)data|data.tplData|',
        defaultValue: {}
    },
    'success': {
        group: 'status',
        dataPath: 'code',
        defaultValue: true,
        modifier: '!'
    },
    'error': {
        group: 'status',
        dataPath: 'code',
        defaultValue: 0
    },
    'error-type': {
        group: 'status',
        dataPath: 'error.code',
        defaultValue: 0
    },
    'message': {
        group: 'status',
        dataPath: 'message|error.message|error.title',
        defaultValue: ''
    },
    'data': {
        group: 'status',
        dataPath: '(code)data|data.tplData|'
    },

    // 登录需要的 appKey
    'app-key': {
        group: 'session',
        dataPath: 'currentUser.userInfo.scene.appKey',
        defaultValue: ''
    },

    'user-name': {
        group: 'session',
        dataPath: 'currentUser.userInfo.showName',
        defaultValue: ''
    },
    'user-id': {
        group: 'session',
        dataPath: 'currentUser.userInfo.userId',
        defaultValue: ''
    },
    // 当前用户登录信息
    'current-user': {
        group: 'session',
        dataPath: 'currentUser.userInfo',
        defaultValue: null
    },

    // 当前页面数据
    'c-page-data': {
        cavity: '@'
    }
};

const config = {
    picker,
    pageDataKey: 'page-data',

    pickerConfig: {
        'page-data': 0,
        'reload': 0,
        '*': ['status'] 
    },

    // 在每个请求中都带上的参数（除了noCommonQueryKeys）
    commonQueries: {
        //每个异步请求需要带的参数（xxx?projectId=1&calzsId=123）
        projectId: 'project-id'
    },
    commonQueriesLocalStorageKey:"token",
    // 不发通用query的接口
    noCommonQueryKeys: {
        'page-data': 1,
        'reload': 1
    }


};

export default config;
