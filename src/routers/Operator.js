const express = require('express');
const router = express.Router();
const kpusers_conn = require('../helpers/connection').kpusers;
const logger = require('../helpers/logger')

router.get('/Operator', (req, res) => {

  const {
    bcode,
    zcode
  } = req.query;

  const _logger = logger('OPERATOR')

  const query = `SELECT DISTINCT a.fullname,b.userlogin FROM kpusers.branchusers a 
  INNER JOIN kpusers.sysuseraccounts b ON a.resourceid = b.resourceid 
  WHERE b.branchcode='${bcode}' AND b.zonecode='${zcode}' AND b.isactive=1`;

  if (bcode == '' || zcode == '') {
    _logger.warn(`Message: Missing Paramater - Request: ${JSON.stringify(req.query)}`)
    return res.json({
      respcode: 1,
      respmsg: `Missing Paramater`
    });
  }

  try {
    kpusers_conn.query(query, (err, result) => {
      if (err) {
        _logger.error(`Database ${err.stack}`)
        return res.json({
          respcode: 1,
          respmsg: err.stack
        });
      }

      if (result.length == 0) {
        _logger.warn(`Message: No user Found - Request: ${JSON.stringify(req.query)}`)
        return res.json({
          respcode: 1,
          respmsg: `No user Found`
        });
      }

      _logger.info(`Message: Success - Request: ${JSON.stringify(req.query)} - Response: ${JSON.stringify(result)}`)
      return res.json({
        respcode: 0,
        respmsg: `Success`,
        respdata: result
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