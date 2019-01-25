import { Application } from 'egg';
import { Middleware } from 'koa';

/**
 * 单个controller的prefix储存的对象类型
 * @interface ClassPrefixData
 */
interface ClassPrefixData {
    prefix: string;
    beforeMiddlewares: Middleware[];
}

interface ClassPrefix {
    [className: string]: ClassPrefixData;
}

/**
 * 类的router属性的类型
 * @interface Router
 */
interface Router {
    [routerUrl: string]: RouterOption[]
}

/**
 * 单个路由储存在router里面的信息
 * @interface RouterOption
 */
interface RouterOption {
    httpMethod: string;
    beforeMiddlewares: Middleware[];
    handlerName: string;
    constructorFn: any;
    className: string;
}

/** http方法名 */
const HTTP_METHODS = ['get', 'post', 'patch', 'del', 'options', 'put'];

/** http装饰器方法类型 */
type HttpFunction = (url: string, ...beforeMiddlewares: Middleware[]) => any;

class RouterDecorator {

    get: HttpFunction;
    post: HttpFunction;
    patch: HttpFunction;
    del: HttpFunction;
    options: HttpFunction;
    put: HttpFunction;

    /**
     * 记录各个class的prefix以及相关中间件
     * 最后统一设置
     * @private
     * @static
     * @type {ClassPrefix}
     * @memberof RouterDecorator
     */
    private static __classPrefix__: ClassPrefix = {}

    /**
     * 记录各个routerUrl的路由配置
     * 最后统一设置
     * @private
     * @static
     * @type {Router}
     * @memberof RouterDecorator
     */
    private static __router__: Router = {}

    constructor () {
        HTTP_METHODS.forEach(httpMethod => {
            this[httpMethod] = (url: string, ...beforeMiddlewares: Middleware[]) => (target: any, name: string) => {
                this.__setRouter__(url, {
                    httpMethod,
                    beforeMiddlewares,
                    handlerName: name,
                    constructorFn: target.constructor,
                    className: target.constructor.name
                });
            }
        })
    }

    /** 推入路由配置 */
    private __setRouter__ (url: string, routerOption: RouterOption) {
        RouterDecorator.__router__[url] = RouterDecorator.__router__[url] || [];
        RouterDecorator.__router__[url].push(routerOption);
    }

    /**
     * 装饰Controller class的工厂函数
     * 为一整个controller添加prefix
     * 可以追加中间件
     * @param {string} prefixUrl
     * @param {...Middleware[]} beforeMiddlewares
     * @returns 装饰器函数
     * @memberof RouterDecorator
     */
    public prefix (prefixUrl: string, ...beforeMiddlewares: Middleware[]) {
        return function (targetControllerClass) {
            RouterDecorator.__classPrefix__[targetControllerClass.name] = {
                prefix: prefixUrl,
                beforeMiddlewares: beforeMiddlewares
            };
            return targetControllerClass;
        }
    }

    /**
     * 注册路由
     * 路由信息是通过装饰器收集的
     * @export
     * @param {Application} app eggApp实例
     * @param {string} [options={ prefix: '' }] 举例： { prefix: '/api' }
     */
    public static initRouter (app: Application, options = { prefix: '' }) {
        Object.keys(RouterDecorator.__router__).forEach(url => {
            RouterDecorator.__router__[url].forEach((opt: RouterOption) => {
                const controllerPrefixData = RouterDecorator.__classPrefix__[opt.className] || { prefix: '', beforeMiddlewares: [] };
                const fullUrl = `${options.prefix}${controllerPrefixData.prefix}${url}`;
                console.log(`egg-router-decorator register URL * ${opt.httpMethod.toUpperCase()} ${fullUrl} * ${opt.className}.${opt.handlerName}`);
                app.router[opt.httpMethod](fullUrl, ...controllerPrefixData.beforeMiddlewares, ...opt.beforeMiddlewares, async (ctx) => {
                    const ist = new opt.constructorFn(ctx);
                    await ist[opt.handlerName](ctx);
                });
            })
        });
    }
}

/** 暴露注册路由方法 */
export const initRouter = RouterDecorator.initRouter;

/** 暴露实例的prefix和http的各个方法 */
export default new RouterDecorator();
