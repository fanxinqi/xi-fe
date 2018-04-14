##shadowmoon v1.1

#### 在v1.0的基础上，添加 Greeter 检测浏览是否支持项目运行

### 一、安装

yanxiu-yarn

### 二、启动本地测试
```
npm start & npm run mock

```
### 三、路由前缀 prefix
<font color="red">路由前缀必须以 ／ 为结尾，否则会抛出异常</font>

### 四、路由与组件
<font color="blue">使用 路由名 做为 组件名来用，所以路由名同组件名相同</font><br/>

+ 路由命名规则：驼峰形式，首字母小写。如 `projectSummary`
+ 组件命名规则：驼峰形式，首字母大写。 如 `ProjectSummary`
+ 组件文件名命名规则：小写字母加中划线，如 `project.vue` 或 `project-summary.vue`


### 五、dao下内容解析
#### 1. dao/config.js
```
'@': {
        dataPath: '(code)data|data.tplData|',
        defaultValue: {}
 },
'success': {
    group: 'status',
    dataPath: 'code',
    defaultValue: true,
    modifier: '!'
 }
 'c-page-data': {
    cavity: '@'
 },
```
`@`: 表示没有被截取的数据

属性 group 表示自定义分组

 * group = status：异步请求状态  成功  失败
 * group = session：页面同步和异步数据返回的值（会话）
 * group = common：每个异步请求都带的公共参数
 * group 未定义的话就是默认分组

属性 cavity<br/>
 
### 六、DataPicker (app/dao/data-picker.js)

字符串表达式, 根据以下字符串的组合开式，生成对应的 datapicker,
顺序固定、不允许加空格，不允 > <, 空格;

#### >a.b.c;validator,validator;defaultValue;modifier,modifier;inherits<
+ 第一位 `a.b.c`：表示 dataPath<br/>
+ 第二位 `validator,validator`：表示 validator，多个用逗号”|“分隔
+ 第三位 `defaultValue`：表示 defaultValue 默认值，可以是任何值，如：对象
+ 第四位 `modifier,modifier`：表示 modifier，多个用逗号”|“分隔
+ 第五位 `inherits` ：表示 inherits 继承
+ 如果某一位不传的话需要空出来，如：a.b.c<font color="red">;;</font>validator,validator<font color="red">;;</font>inherits<

#### `>@cavitiy<`
简写只有cavitiy(值为 dataPath)的时候，一般情况不会配置
#### `>a.b.c<`
表示只有dataPath， path中可以配置或 如：data|data.tplData|
#### `>=defaultValue<`
#### `>a.b.c=defaultValue<`
表示 dataPath 跟 默认值，并且只有 dataPath 和 defaultValue时，可以简写为以上形式
#### `>!validator<`
表示 validator，只有validator 时，可以简写为以上形式，多个|分隔，如：`k1:v1:v2:v3|k2:v1|k3:v1:v2`
#### `>~modifier<`
表示 modifier，只有modifier 时，可以简写为以上形式，多个|分隔，如：`k1:v1:v2:v3|k2:v1|k3:v1:v2`
#### `>>inherits<`
表示继承，并且只有inerits(值为 dataPath)时，可以简写为以上形式


语义解释：

+ `><` 为开始结束符
+ `;`（分号）为分隔符
+ `@` 为 cavitiy
+ `>` 为 inherits
+ `!` 开始为 validator
+ `~` 开始为 modifier
+ `=` 开始为 defaultValue, 只有defaultValue可以加引号，其属性禁止加引号
+ 没有前缀的时候表示 dataPath


charles 在线破解
https://www.zzzmode.com/mytools/charles/
替换charles.java文件即可

changlog

1,

