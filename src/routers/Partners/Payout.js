const express = require('express');
const router = express.Router();
const apiOld_conn = require('../../helpers/connection').apiOld;
const apiNew_conn = require('../../helpers/connection').apiNew;
const fileUpload_conn = require('../../helpers/connection').fileUpload;
const webService_conn = require('../../helpers/connection').webService;
const billspay_conn = require('../../helpers/connection').billspay;
const logger = require('../../helpers/logger');

router.post('/Partners/Payout', (req, res) => {

  const _logger = logger('PARTNERS [PAYOUT]')

  try {
    const {
      kptn,
      transdate,
      bcode,
      zcode,
      employee
    } = req.body;

    // const apiOld_query = `CALL kptransactions.KP8POAgent(''${kptn}'','${transdate}','${bcode}','${zcode}','${employee}')`;
    // const apiNew_query = `CALL kptransactions.KP8POAgent(''${kptn}'','${transdate}','${bcode}','${zcode}','${employee}')`;
    // const fileUpload_query = `CALL kptransactions.KP8POAgent(''${kptn}'','${transdate}','${bcode}','${zcode}','${employee}')`;
    // const webService_query = `CALL kptransactions.KP8POAgent(''${kptn}'','${transdate}','${bcode}','${zcode}','${employee}')`;

    const apiOldAUB_query = `SELECT kptn FROM kppartnersAUB.payout0101`;
    const apiOld_query = `SELECT kptn FROM kppartners.payout0509;`;
    const apiNewWU_query = `SELECT kptn FROM kppartnersWU.payout0321 LIMIT 1`;
    const apiNew_query = `SELECT kptn FROM kppartners.payout0710 LIMIT 1`;
    const webService_query = `SELECT kptn from kppartners.payout0726`;
    const fileUpload_query = `SELECT kptn from kppartners.payout0726`;
    const wuRefund_query = `SELECT * FROM kpWUrefund.TransLogs01 limit 1`;

    if (kptn == '' || transdate == '' || bcode == '' || zcode == '' || employee == '') {
      _logger.warn(`Message: Missing Paramater - Request: ${JSON.stringify(req.body)}`)
      return res.json({
        respcode: 1,
        respmsg: `Missing Paramater`
      });
    }

    apiOld_conn.query(apiOld_query, (err, oldPartners) => {
      if (err) {
        _logger.error(`API OLD Database ${err.stack}`)
        return res.json({
          respcode: 1,
          respmsg: err.stack
        });
      }

      if (oldPartners.length == 0) {
        _logger.warn(`Message: No transaction Found API Old - Request: ${JSON.stringify(req.body)}`)
      }

      apiOld_conn.query(apiOldAUB_query, (err, oldAUB) => {
        if (err) {
          _logger.error(`API OLD Database ${err.stack}`)
          return res.json({
            respcode: 1,
            respmsg: err.stack
          });
        }

        if (oldAUB.length == 0) {
          _logger.warn(`Message: No transaction Found API Old - Request: ${JSON.stringify(req.body)}`)
        }

        apiNew_conn.query(apiNew_query, (err, newPartners) => {
          if (err) {
            _logger.error(`API NEW Database ${err.stack}`)
            return res.json({
              respcode: 1,
              respmsg: err.stack
            });
          }

          if (newPartners.length == 0) {
            _logger.warn(`Message: No transaction Found API New - Request: ${JSON.stringify(req.body)}`)
          }

          apiNew_conn.query(apiNewWU_query, (err, newWU) => {
            if (err) {
              _logger.error(`API NEW Database ${err.stack}`)
              return res.json({
                respcode: 1,
                respmsg: err.stack
              });
            }

            if (newWU.length == 0) {
              _logger.warn(`Message: No transaction Found API New - Request: ${JSON.stringify(req.body)}`)
            }

            webService_conn.query(webService_query, (err, webService) => {
              if (err) {
                _logger.error(`WEBSERVICE Database ${err.stack}`)
                return res.json({
                  respcode: 1,
                  respmsg: err.stack
                });
              }

              if (webService.length == 0) {
                _logger.warn(`Message: No transaction Found WebService - Request: ${JSON.stringify(req.body)}`)
              }

              fileUpload_conn.query(fileUpload_query, (err, fileUpload) => {
                if (err) {
                  _logger.error(`FILEUPLOAD Database ${err.stack}`)
                  return res.json({
                    respcode: 1,
                    respmsg: err.stack
                  });
                }

                if (webService.length == 0) {
                  _logger.warn(`Message: No transaction Found WebService - Request: ${JSON.stringify(req.body)}`)
                }

                billspay_conn.query(wuRefund_query, (err, wuRefund) => {
                  if (err) {
                    _logger.error(`BILLSPAY REFUND Database ${err.stack}`)
                    return res.json({
                      respcode: 1,
                      respmsg: err.stack
                    });
                  }

                  if (wuRefund.length == 0) {
                    _logger.warn(`Message: No transaction Found WU Refund - Request: ${JSON.stringify(req.body)}`)
                  }

                  const allData = oldPartners.concat(oldAUB).concat(newPartners).concat(newWU).concat(webService).concat(fileUpload).concat(wuRefund)

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
            })
          })
        })
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