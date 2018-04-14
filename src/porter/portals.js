/**
 * 数据传送门配置
 * @author chengxiao
 */

const reNumber = /^\d+$/;

// ==================== 通用数据接口start =====================

const portals = {
    'reload': {
        uri: '@',
        allowExtraQueries: true,
        queries: null,
        method: 'get',
        data: null
    },

    'page-data': {
        uri: '&',
        allowExtraQueries: true,
        queries: {
            'offset': reNumber,
            'pageSize': reNumber
        },
        method: 'get',
       
    },
    "login":null,
    "action-login":{
        uri:"/api/account_info/login/",
        queries:null,
        method: 'post',
        data: {
            user_name:true,
            password:true
        }
    },
    "member":{
        uri:"/api/Member/list",
        queries:null,
        method: 'get',
        data: null
    }
};

// ==================== 通用数据接口end   =====================

export default portals;
