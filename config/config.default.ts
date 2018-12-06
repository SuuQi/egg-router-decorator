import { EggAppConfig, PowerPartial } from 'egg';
import * as path from 'path';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppConfig) => {
    const config: DefaultConfig = {};

    config.keys = appInfo.name + '_1537442153535_79088';

    config.view = {
        root: path.join(appInfo.baseDir, 'app/view'),
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.tpl': 'nunjucks',
        },
    };

    return config;
};
