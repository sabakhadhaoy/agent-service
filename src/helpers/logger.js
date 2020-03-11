const log4js = require('log4js');
const moment = require('moment')
const logdate = moment().format('YYYY-MM-DD')

log4js.configure({
  appenders: {
    logs: {
      type: 'file',
      filename: `./LOGS/${logdate}.log`
    }
  },
  categories: {
    default: {
      appenders: ['logs'],
      level: 'info'
    },
    error: {
      appenders: ['logs'],
      level: 'error'
    },
    fatal: {
      appenders: ['logs'],
      level: 'fatal'
    }
  }
});

const logger = (filename) => log4js.getLogger(`${filename}`);

module.exports = logger;