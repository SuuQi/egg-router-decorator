import { Application } from 'egg';
import { Middleware } from 'koa';

export interface RouterOption {
    httpMethod: string;
    beforeMiddlewares: Middleware[];
    handlerName: string;
    constructorFn: any;
    className: string;
}

export interface Router {
    [key: string]: RouterOption[]
}

export interface Options {
    prefix?: string
}

const HTTP_METHODS = ['get', 'post', 'patch', 'del', 'options', 'put'];

class RouterDecorator {

    public __classPrefix__ = {}
    public router: Router = {}

    constructor () {
        HTTP_METHODS.forEach(httpMethod => {
            Object.defineProperty(this, httpMethod, {
                get: () => (url: string, ...beforeMiddlewares: Middleware[]) => (target: any, name: string) => {
                    this.setRouter(url, {
                        httpMethod,
                        beforeMiddlewares,
                        handlerName: name,
                        constructorFn: target.constructor,
                        className: target.constructor.name
                    });
                }
            })
        })
    }

    public setRouter (url: string, routerOption: RouterOption) {
        this.router[url] = this.router[url] || [];

        // 安全检测，同路径和方法名直接抛错
        // const equalRouters = this.router[url].filter(o => o.httpMethod === routerOption.httpMethod);
        // if (equalRouters.length > 0) {
        //     throw new Error( `URL * ${routerOption.httpMethod.toUpperCase()} ${url} * existed` );
        // }

        this.router[url].push(routerOption);
    }

    public prefix (prefixUrl: string) {
        return function (targetControllerClass) {
            instance.__classPrefix__[targetControllerClass.name] = prefixUrl;
            return targetControllerClass;
        }
    }
}

// 全局唯一实例
const instance: any = new RouterDecorator();

export const initRouter = (app: Application, options: Options = { prefix: '' }) => {
    Object.keys(instance.router).forEach(url => {
        instance.router[url].forEach((opt: RouterOption) => {
            const controllerPrefix = instance.__classPrefix__[opt.className] || '';
            const fullUrl = `${options.prefix}${controllerPrefix}${url}`;
            console.log(`egg-router-decorator setRouter URL * ${opt.httpMethod.toUpperCase()} ${fullUrl} * ${opt.className}.${opt.handlerName}`);
            app.router[opt.httpMethod](fullUrl, ...opt.beforeMiddlewares, async (ctx) => {
                const ist = new opt.constructorFn(ctx);
                await ist[opt.handlerName](ctx);
            });
        })
    });
};

export default instance;
