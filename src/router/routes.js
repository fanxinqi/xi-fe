// *=<data=*
const routes = {
    prefix: '/silvermoon/page/',
    rules: [
        {
            name: 'login',
            path: 'login',
            parent: '',
            title: '>data.data.projectInfo.projectName=登录<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'member',
            path: 'member',
            parent: '',
            title: '>data.data.projectInfo.projectName=会员<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'order',
            path: 'order',
            parent: '',
            title: '>data.data.projectInfo.projectName=订单<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'collect',
            path: 'collect',
            parent: '',
            title: '>data.data.projectInfo.projectName=收衣<',
            dataPath: 'data',
            noCache: true
        },
        {
            name: 'store',
            path: 'store',
            parent: '',
            title: '>data.data.projectInfo.projectName=店铺<',
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
