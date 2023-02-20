# Petrichor

> 这是一个极简的 vue admin 管理后台。它只包含了 Element UI & axios & iconfont & permission control & lint，这些搭建后台必要的东西。
> 以及 websocket & vue-beautiful-chat 在线聊天方案.

[线上地址]()

目前版本为 `v4.0+` 基于 `vue-cli` 进行构建。

## 规划
[规划]]](./plan.md)
## Build Setup

```bash
# 克隆项目
git clone https://github.com/IanVzs/Petrichor.git

# 进入项目目录
cd Petrichor

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## nodejs version >= 17.0.0 版本问题
因为nodejs自17版开始，openssl升级为3.0,但之前的组件都是基于1.0的,所以要么升级组件(我还不会)要么强制使用1.0版本

可以通过`export NODE_OPTIONS=--openssl-legacy-provider`设置环境变量, 等后续再研究升级组件的方法.

## 关于Mock数据
详参[这里](https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/mock-api.html), 这是`vue-element-admin`自己整理的详尽文档。

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
## 预览
![当前版本界面预览](https://github.com/IanVzs/Petrichor/blob/master/version_shows/now_version.jpg "当前版本")
## License

[MIT](https://github.com/IanVzs/Petrichor/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen

## 感谢
generated from [PanJiaChen/vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)