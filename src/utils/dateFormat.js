const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/locale/zh-cn');
dayjs.locale('zh-cn');
dayjs.extend(utc);
dayjs.extend(relativeTime);

/**
 * 格式化时间
 * @param {array} time 时间
 * @param {formatType} type 格式化类型
 * @returns 格式化后的时间
 */
function timeFormat(time) {
  return dayjs(time).fromNow();
}

module.exports = {
  timeFormat
};
