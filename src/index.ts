// import { readdirSync } from 'fs';
// import * as path from 'path';
import { Application } from 'egg';
import { Middleware } from 'koa';

export interface Options {
    prefix?: string
}

const HTTP_METHODS = ['get', 'post', 'patch', 'del', 'options', 'put']

class RouterDecorator {

    constructor () {
        HTTP_METHODS.forEach(httpMethod => {
            Object.defineProperty(this, httpMethod, {
                get: () => (url: string, ...middlewares: Middleware[]) => (target: any, name: string) => {
                    this.setRouter(url, {
                        httpMethod,
                        middlewares,
                        handler: name,
                        constructor: target.constructor,
                        className: target.constructor.name
                    });
                }
            })
        })
    }

    public __prefix__ = {}
    public router = {}

    // scanController () {
    //     const dir = path.resolve();
    //     readdirSync(dir + '/app/controller').forEach(file => {
    //         require(dir + '/app/controller/' + file)
    //     })
    // }

    public setRouter (url: string, routerOption) {
        const controllerPrefixUrl = this.__prefix__[routerOption.className] || '';
        const fullUrl = controllerPrefixUrl + url;
        this.router[fullUrl] = this.router[fullUrl] || [];

        // 安全检测，同路径和方法名直接抛错
        const equalRouters = this.router[fullUrl].filter(o => o.httpMethod === routerOption.httpMethod);
        if (equalRouters.length > 0) {
            throw new Error( `URL * ${routerOption.httpMethod.toUpperCase()} ${fullUrl} * existed` );
        }

        this.router[fullUrl].push(routerOption);
    }

    prefix (prefixUrl: string) {
        return function (targetControllerClass) {
            instance.__prefix__[prefixUrl] = targetControllerClass.name;
            return targetControllerClass;
        }
    }
}

// 全局唯一实例
const instance = new RouterDecorator();

export const initRouter = (app: Application, options?: Options) => {
    const { router, controller } = app;
    console.log(router, controller);
};

export default {
}
