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
        uri: "/api/collectClothes/init",
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
            idNum: false,
            birthday: false,
            gender: false,
            address: false,
            memberCategoryId: true
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
            idNum: false,
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
            "imageEntity": true,
            "memberCategoryId":true
        },
        headers: {
            "Content-Type": "application/json"
        }
    },
    updateCategory: {
        uri: "/api/clothesCategory/update",
        queries: null,
        method: 'post',
        data: {
            "id": true,
            "parent_id": true,
            "name": true,
            "price": true,
            "des": false,
            "imageEntity": false,
            "memberCategoryId":true
        },
        headers: {
            "Content-Type": "application/json"
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
            "name":false,
            "phone": true,
            "goodsEntitySet": true,
            "paymentEntity": true,
            "imageSet": true,
            "goodList":true,
            "storeId":false,
            "headUrl":false
        },
        headers: {
            "Content-Type": "application/json"
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
        allowExtraQueries: true,
        data: null
    },
    updateClothesOrder: {
        uri: "/api/clothesOrder/update",
        queries: null,
        method: 'post',
        data: {
            "id":true,
            "phone": true,
            "goodEnities": true,
            "paymentEntity": true,
            "stateEntity": true,
            "imageSet": true,
            "storeId":false,
        }
    },
    "user": {
        uri: "/api/accountInfo/list",
        queries: null,
        method: 'get',
        data: null,
        allowExtraQueries: true
    },
    "user-save":{
        uri: "/api/accountInfo/save",
        queries: null,
        method: 'post',
        data: {
            id:false,
            name:true,
            passWord:true,
            storeId:false,
            roleId:false
        }
    },
    "upload-camera":{
        uri: "/api/attachment/uploadBase64",
        queries: null,
        method: 'post',
        data: {
            base64Data:true
        }
        // ,
        // headers: {
        //     "Content-Type": ""
        // }
    }
};

// ==================== 通用数据接口end   =====================

export default portals;