const log4js = require("log4js");
log4js.configure({
    appenders: {
        cheese: {
            type : 'dateFile',
            filename : 'logs/app',
            pattern : '-yyyy-MM-dd.log',
            alwaysIncludePattern : true,
            category : 'app'
        },
        aaa: { type: "console", category: "console" }
    },
    categories: { default: { appenders: ["aaa", "cheese"], level: "all" } }
});

const logger = log4js.getLogger();
// logger.trace('aaaaa');
// logger.debug('bbbbb');
// logger.info('ccccc');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

exports.logger = log4js.getLogger();
