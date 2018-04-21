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
    "login": null,
    "action-login": {
        uri: "/api/accountInfo/login/",
        queries: null,
        method: 'post',
        data: {
            userName: true,
            password: true
        }
    },
    "collect": {
        uri: "/api/clothesCategory/list",
        queries: null,
        method: 'get',
        data: null

    },
    "collect-search-member": {
        uri: "/api/member/searchMemberByPhone",
        queries: {
            phone: true
        },
        method: 'get',
        data: null
    },
    "member": {
        uri: "/api/member/listCategory",
        queries: null,
        method: 'get',
        data: null
    },
    "updateMember": {
        uri: "/api/member/update",
        queries: null,
        method: 'post',
        data: {
            id: true,
            name: true,
            headUrl: false,
            phone: true,
            des: false,
            id_num: false,
            birthday: false,
            gender: false,
            address: false,
            member_category_id: true
        },
        headers: {
            "Content-Type": "application/json"
        }
    },
    "saveMember": {
        uri: "/api/member/save",
        queries: null,
        method: 'post',
        data: {
            name: true,
            headUrl: false,
            phone: true,
            des: false,
            id_num: false,
            birthday: false,
            gender: false,
            address: false,
            member_category_id: true
        },
        headers: {
            "Content-Type": "application/json"
        }
    },
    category:{
        uri:"/api/clothesCategory/list",
        queries: null,
        method: 'get',
        data: null
    }
};

// ==================== 通用数据接口end   =====================

export default portals;
