const express = require('express');
const router = express.Router();
const domestic_conn = require('../../helpers/connection').domestic;
const logger = require('../../helpers/logger');

router.post('/Domestic/Payout', (req, res) => {

  const _logger = logger('Domestic [PAYOUT]')

  let response;

  try {
    const {
      kptn,
      transdate,
      bcode,
      zcode,
      employee
    } = req.body;

    const query = `CALL kpdomestic.DomesticPOAgent('${kptn}','${transdate}','${bcode}','${zcode}','${employee}')`;

    if (kptn == '' || transdate == '' || bcode == '' || zcode == '' || employee == '') {
      response = {
        respcode: 1,
        respmsg: `Missing Paramater`
      }
      _logger.warn(`Request: ${JSON.stringify(req.body)} - Response: ${JSON.stringify(response)}`)
      return res.json(response);
    }

    domestic_conn.query(query, (err, result) => {
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