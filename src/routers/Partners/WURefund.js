const express = require('express');
const router = express.Router();
const billspay_conn = require('../../helpers/connection').billspay;
const logger = require('../../helpers/logger');

router.post('/Partners/WURefund', (req, res) => {

  const _logger = logger('PARTNERS [WU REFUND]')

  try {
    const {
      kptn,
      transdate,
      bcode,
      zcode,
      employee
    } = req.body;

    const wuRefund_query = `CALL kpbillspayment.BillspaymentWURefundAgent(''${kptn}'','${transdate}','${bcode}','${zcode}','${employee}')`;

    if (kptn == '' || transdate == '' || bcode == '' || zcode == '' || employee == '') {
      _logger.warn(`Message: Missing Paramater - Request: ${JSON.stringify(req.body)}`)
      return res.json({
        respcode: 1,
        respmsg: `Missing Paramater`
      });
    }

    billspay_conn.query(wuRefund_query, (err, wuRefund) => {
      if (err) {
        _logger.error(`Database ${err.stack}`)
        return res.json({
          respcode: 1,
          respmsg: err.stack
        });
      }

      if (wuRefund.length == 0) {
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
        respdata: wuRefund
      });

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