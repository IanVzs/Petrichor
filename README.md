# Petrichor

English | [简体中文](./README-zh.md)

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint
> & websocket & chat

**Live demo:** 
yet...

**The current version is `v4.0+` build on `vue-cli`.**

## Plan
[Plan](./plan.md)
## Build Setup

```bash
# clone the project
git clone https://github.com/IanVzs/Petrichor.git

# enter the project directory
cd Petrichor

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Issue with nodejs version >= 17.0.0

Starting from nodejs v17, OpenSSL has been upgraded to version 3.0. However, many existing components are still based on version 1.0, so you have to either upgrade the components (which I don't know how to do yet) or force the use of version 1.0.

You can set the environment variable `export NODE_OPTIONS=--openssl-legacy-provider` to use version 1.0. We can look into upgrading the components in the future.

## About Mock
Please click [this](https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/mock-api.html), this is `vue-element-admin`'s doc。

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) for more information

## Demo

![demo](https://github.com/IanVzs/Petrichor/blob/master/version_shows/now_version.jpg "now version")

## License

[MIT](https://github.com/IanVzs/Petrichor/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen

## Thanks
generated from [PanJiaChen/vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)