// *=<data=*
const routes = {
    prefix: '/silvermoon/page/',
    rules: [
        {
            name: 'login',
            path: 'login',
            parent: '',
            title: '>=登录<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'member',
            path: 'member',
            parent: '',
            title: '>=会员<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'order',
            path: 'order',
            parent: '',
            title: '>=订单<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'collect',
            path: 'collect',
            parent: '',
            title: '>=收衣<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'store',
            path: 'store',
            parent: '',
            title: '>=店铺<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'category',
            path: 'category',
            parent: '',
            title: '>=分类<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'user',
            path: 'user',
            parent: '',
            title: '>=账号<',
            dataPath: 'data',
            noCache: true
        }
    ]

};
// *=data>=*

/*
    router name
    state name
    page id
*/
export default routes;
