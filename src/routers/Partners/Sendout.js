const express = require('express');
const router = express.Router();
const apiNew_conn = require('../../helpers/connection').apiNew;
const billspay_conn = require('../../helpers/connection').billspay;
const logger = require('../../helpers/logger');

router.post('/Partners/Sendout', (req, res) => {

  const _logger = logger('PARTNERS [SENDOUT]')

  try {
    const {
      kptn,
      transdate,
      bcode,
      zcode,
      employee
    } = req.body;

    const wuSendout_query = `SELECT kptn FROM kppartnersWU.sendout0801 LIMIT 1`;
    const wuPayment_query = `SELECT KPTN FROM kpWUpayment.TransLogs01 limit 1`;

    if (kptn == '' || transdate == '' || bcode == '' || zcode == '' || employee == '') {
      _logger.warn(`Message: Missing Paramater - Request: ${JSON.stringify(req.body)}`)
      return res.json({
        respcode: 1,
        respmsg: `Missing Paramater`
      });
    }

    apiNew_conn.query(wuSendout_query, (err, wuSendout) => {
      if (err) {
        _logger.error(`Database ${err.stack}`)
        return res.json({
          respcode: 1,
          respmsg: err.stack
        });
      }

      if (wuSendout.length == 0) {
        _logger.warn(`Message: No transaction Found WUSendout - Request: ${JSON.stringify(req.body)}`)
      }

      billspay_conn.query(wuPayment_query, (err, wuPayment) => {
        if (err) {
          _logger.error(`Database ${err.stack}`)
          return res.json({
            respcode: 1,
            respmsg: err.stack
          });
        }

        if (wuPayment.length == 0) {
          _logger.warn(`Message: No transaction Found WUPayment- Request: ${JSON.stringify(req.body)}`)
        }

        const allData = wuSendout.concat(wuPayment);

        if (allData.length == 0) {
          _logger.warn(`Message: No transaction Found - Request: ${JSON.stringify(req.body)}`)
          return res.json({
            respcode: 1,
            respmsg: `No transaction Found`
          });
        }

        _logger.info(`Message: Success - Request: ${JSON.stringify(req.body)} - Response: ${JSON.stringify(allData)}`)
        return res.json({
          respcode: 0,
          respmsg: `Success`,
          respdata: allData
        });

      })
    })
  } catch (err) {
    _logger.fatal(err.stack)
    return res.json({
      respcode: 2,
      respmsg: err.stack
    });
  }

})

module.exports = router;