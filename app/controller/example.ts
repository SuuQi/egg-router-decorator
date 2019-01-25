import { Controller } from 'egg';

import routerDecorator from '../../src';

const isLogin = async (ctx, next) => {
    if (ctx.params['id']) {
        await next();
    } else {
        ctx.status = 401;
    }
}
const hasDelAuth = async (ctx, next) => {
    if (ctx.params['pwd'] === 'admin') {
        await next();
        // ctx.body = 'xxx'
    } else {
        ctx.status = 403;
    }
}

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
