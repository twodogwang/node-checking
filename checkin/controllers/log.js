var logger = require("../module/log.js").logger;

exports.log = function (mylog) {
    logger.info(mylog);
}

exports.log1 = function (mylog) {
    logger.error(mylog);
}