import { EggAppConfig, PowerPartial } from 'egg';
import * as fs from 'fs';
import * as path from 'path';

export type DefaultConfig = PowerPartial<EggAppConfig>;


export default (appInfo: EggAppConfig) => {
    const config = {} as PowerPartial<EggAppConfig>;

    config.keys = appInfo.name + '123456';

    config.view = {
        root: path.join(appInfo.baseDir, 'app/view'),
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.tpl': 'nunjucks',
        },
    };

    config.siteFile = {
        '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/public/favicon.png')),
    };

    return config;
};
