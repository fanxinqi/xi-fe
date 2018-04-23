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
    category: {
        uri: "/api/clothesCategory/list",
        queries: null,
        method: 'get',
        data: null
    },
    saveCategory: {
        uri: "/api/clothesCategory/save",
        queries: null,
        method: 'post',
        data: {
            "parentId": true,
            "name": true,
            "price": true,
            "des": false,
            "imageEntity": true
        }
    },
    updateCategory: {
        uri: "/api/clothesCategory/update",
        queries: null,
        method: 'post',
        data: {
            "id": true,
            "parentId": true,
            "name": true,
            "price": true,
            "des": false,
            "imageEntity": false
        }
    },
    deleteCategory: {
        uri: "/api/clothesCategory/deleteById",
        queries: null,
        method: 'post',
        data: {
            "id": true
        }
    },
    saveClothesOrder: {
        uri: "/api/clothesOrder/save",
        queries: null,
        method: 'post',
        data: {
            "phone": true,
            "categoryEntitySet": true,
            "paymentEntity": true,
            "stateEntity": true,
            "imageSet": true
        }
    },
    payment: {
        uri: "/api/payment/list",
        queries: null,
        method: 'get',
        data: null
    },
    store: {
        uri: "/api/store/list",
        queries: {
            name: false,
            page: false
        },
        method: 'get',
        data: null
    },
    "saveStore": {
        uri: "/api/store/save",
        queries: null,
        method: 'post',
        data: {
            name: true,
            des: true,
            address: true,
            imageEntity: false,
            storeLaundryExpertSet: false
        },
        headers: {
            "Content-Type": "application/json"
        }
    },
    "updateStore": {
        uri: "/api/store/update",
        queries: null,
        method: 'post',
        data: {
            id: true,
            name: true,
            des: true,
            address: true,
            imageEntity: false,
            storeLaundryExpertSet: false
        },
        headers: {
            "Content-Type": "application/json"
        }
    },
    "searchStore": {
        uri: "/api/store/searchByName",
        queries: {
            name: true
        },
        method: 'get',
        data: null
    },
    "deleteStoreById": {
        uri: "/api/store/deleteById",
        queries: null,
        method: 'post',
        data: {
            id: true,
        },
    },
    order: {
        uri: "/api/clothesOrder/list",
        queries: null,
        method: 'get',
        data: null
    },
};

// ==================== 通用数据接口end   =====================

export default portals;