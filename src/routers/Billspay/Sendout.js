const express = require('express');
const router = express.Router();
const billspay_conn = require('../../helpers/connection').billspay;
const logger = require('../../helpers/logger');

router.post('/Billspay/Sendout', (req, res) => {

  const _logger = logger('Billspay [SENDOUT]');

  let response;

  try {
    const {
      kptn,
      transdate,
      bcode,
      zcode,
      employee
    } = req.body;

    const query = `CALL kpbillspayment.BillspaySOAgent(''${kptn}'','${transdate}','${bcode}','${zcode}','${employee}')`;

    if (kptn == '' || transdate == '' || bcode == '' || zcode == '' || employee == '') {
      response = {
        respcode: 1,
        respmsg: `Missing Paramater`
      }
      _logger.warn(`Request: ${JSON.stringify(req.body)} - Response: ${JSON.stringify(response)}`)
      return res.json(response);
    }

    billspay_conn.query(query, (err, result) => {
      if (err) {
        response = {
          respcode: 1,
          respmsg: `Database ${err.stack}`
        }
        _logger.error(`Request: ${JSON.stringify(req.body)} - Response: ${JSON.stringify(response)}`)
        return res.json(response);
      }

      if (result[0].length == 0) {
        response = {
          respcode: 1,
          respmsg: `No transaction Found`
        }
        _logger.warn(`Request: ${JSON.stringify(req.body)} - Response: ${JSON.stringify(response)}`)
        return res.json(response);
      }

      response = {
        respcode: 0,
        respmsg: `Success`,
        respdata: result[0]
      }
      _logger.info(`Request: ${JSON.stringify(req.body)} - Response: ${JSON.stringify(response)}`)
      return res.json(response);

    })
  } catch (err) {
    response = {
      respcode: 2,
      respmsg: err.stack
    }
    _logger.fatal(`Request: ${JSON.stringify(req.body)} - Response: ${JSON.stringify(response)}`)
    return res.json(response);
  }
})

module.exports = router;