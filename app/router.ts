import { Application } from 'egg';
import { initRouter } from '../src';

export default (app: Application) => {
    initRouter(app);
}
