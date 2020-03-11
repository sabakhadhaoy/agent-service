const express = require('express');
const router = express.Router();
const global_conn = require('../../helpers/connection').global;
const logger = require('../../helpers/logger');

router.post('/Global/Payout', (req, res) => {

  const _logger = logger('Global [PAYOUT]')

  try {
    const {
      kptn,
      transdate,
      bcode,
      zcode,
      employee
    } = req.body;

    const query = `CALL kpglobal.GlobalPOAgent(''${kptn}'','${transdate}','${bcode}','${zcode}','${employee}')`;

    if (kptn == '' || transdate == '' || bcode == '' || zcode == '' || employee == '') {
      _logger.warn(`Message: Missing Paramater - Request: ${JSON.stringify(req.body)}`)
      return res.json({
        respcode: 1,
        respmsg: `Missing Paramater`
      });
    }

    global_conn.query(query, (err, result) => {
      if (err) {
        _logger.error(`Database ${err.stack}`)
        return res.json({
          respcode: 1,
          respmsg: err.stack
        });
      }

      if (result[0].length == 0) {
        _logger.warn(`Message: No transaction Found - Request: ${JSON.stringify(req.body)}`)
        return res.json({
          respcode: 1,
          respmsg: `No transaction Found`
        });
      }

      _logger.info(`Message: Success - Request: ${JSON.stringify(req.body)} - Response: ${result[0]}`)
      return res.json({
        respcode: 0,
        respmsg: `Success`,
        respdata: result[0]
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