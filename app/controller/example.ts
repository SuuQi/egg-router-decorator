import { Controller } from 'egg';

import routerDecorator from '../../src';

@routerDecorator.prefix('/example')
export default class ExampleController extends Controller {

    @routerDecorator.get('/index')
    public async index () {
        const { ctx } = this;
        ctx.body = { test: 'example', prefix: routerDecorator.__prefix__ };
    }
}
