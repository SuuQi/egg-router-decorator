# egg-router-decorator

[![NPM version][npm-image]][npm-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-router-decorator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-router-decorator
[node-image]: https://img.shields.io/badge/node.js-%3E=_8.9-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/egg-router-decorator.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-router-decorator

> 装饰者模式写egg-router（Routers  for eggjs by decorator pattern）。

# Usage

### For Install
```bash
npm install --save egg-router-decorator
```

### Setup

In `router.ts` or `route.js`

```ts
// router.ts or route.js
import { Application } from 'egg';
import { initRouter } from 'egg-router-decorator';

export default (app: Application) => {
    initRouter(app);
}
```

# Prefix Url Globally

```js
// router.ts or `router.js`
initRouter(app, { prefix: '/api' })

// controller.ts or `controller.js`
export default class index extends Controller {
    @routerDecorator.get('/user') //===>>/api/user
    async get() {
        this.ctx.body = 'hello, egg-router-decorator.'
    }
}

```

# Prefix Url For Controller
```js
// controller.ts or `controller.js`
import routerDecorator from 'egg-router-decorator';

@routerDecorator.prefix('/home')
export default class home extends Controller {
    @routerDecorator.get('/test') //===>>/home/test
    async get() {
        this.ctx.body = 'hello, egg-router-decorator.'
    }
}

```

# Router Middleware

Router middleware will run before the target function.

***Example***

```ts
import { Controller } from 'egg';
import routerDecorator from 'egg-router-decorator';

// @routerDecorator.prefix('/example')
@routerDecorator.prefix('/example', (ctx, next) => {
    console.log(ctx.request.URL);
    console.log('ExampleController的prefix中的中间件1');
    next();
}, async (ctx, next) => {
    await next();
    console.log(ctx.request.URL);
    console.log('ExampleController的prefix中的中间件2');
})
export default class ExampleController extends Controller {

    @routerDecorator.get('/index') // ===>>/example/index get
    @routerDecorator.post('/index2') // ===>>/example/index2 post
    public async test1 () {
        const { ctx } = this;
        ctx.body = 'hello, egg-router-decorator.'
    }

    @routerDecorator.put('/parms/:id') // ===>>/parms/:id put
    public async test2 () {
        const { ctx } = this;
        ctx.body = 'hello, egg-router-decorator.'
    }

    @routerDecorator.del('/parms/:id/:pwd', isLogin, hasDelAuth) // ===>>/parms/:id/:pwd del
    public async test3 () {
        const { ctx } = this;
        ctx.body = 'hello, egg-router-decorator.'
    }
}

// isLogin middleware
const isLogin = async (ctx, next) => {
    if (ctx.params['id']) {
        await next();
    } else {
        ctx.status = 401;
    }
}

// hasDelAuth middleware
const hasDelAuth = async (ctx, next) => {
    if (ctx.params['pwd'] === 'admin') {
        await next();
        // ctx.body = 'xxx'
    } else {
        ctx.status = 403;
    }
}

```

The MIT License (MIT)

Copyright (c) hzsuqin <15957136119@163.com> 
