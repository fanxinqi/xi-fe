/**
 * App config
 */
const ENV = {
    MODE: '___RUNNING___MODE___PLACEHOLDER___',
    DEBUG: 'DEBUG',
    TESTING: 'TESTING',
    PRODUCTION: 'PRODUCTION'
};
//根据路由名字，菜单分组
//10001100 manage_accounting 管理会计
//10001200 budget_acounting 预算会计
//10002100 check_accounting 稽核会计
//10002200 cashier 出纳
const  MENU_GROUP=[
    {
        name:"",
        menus:[
            {
                roleIds:[2],
                name:"collect",
                icon:"tshirt"
            },
            {
                roleIds:[1,2],
                name:"order",
                icon:"android-list"
            },
            {
                roleIds:[1,2],
                name:"member",
                icon:"person-stalker"
            },
            {
                roleIds:[1],
                name:"store",
                icon:"ios-home-outline"
            },
            {
                roleIds:[1],
                name:"category",
                icon:"images"
            },
            {
                roleIds:[1],
                name:"user",
                icon:"person"
            }
        ]
    }
];
const config = {
    siteName: '财务管理平台',
    isDev: ENV.MODE === ENV.DEBUG,

    // 登录后进入的页面
    defaultPage: 'projects',
    loginPage: 'login',

    upLoaderHost: '', // ENV.MODE === ENV.PRODUCTION ? '//b.yanxiu.com': '',
    ENV,
    MENU_GROUP,
    passport_testing_host: 'orz.yanxiu.com'
};


export const TO_ROOT = {
    root: true
};

export default config;