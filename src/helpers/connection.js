const fs = require('fs');
const mysql = require('mysql');
const _logger = require('../helpers/logger')

let config = JSON.parse(fs.readFileSync('./config/config.json'));

let kpusers, domestic, wallet, kp8, billspay, express, global, apiOld, apiNew, fileUpload, webService;

try {

  kpusers = mysql.createPool(config.KPUsers);
  domestic = mysql.createPool(config.Domestic);
  kp8 = mysql.createPool(config.KP8);
  billspay = mysql.createPool(config.Billspay);
  global = mysql.createPool(config.Global);
  wallet = mysql.createPool(config.Wallet);
  express = mysql.createPool(config.Express);
  apiOld = mysql.createPool(config.PartnersAPI_OLD);
  apiNew = mysql.createPool(config.PartnersAPI_NEW);
  fileUpload = mysql.createPool(config.PartnersFileUpload);
  webService = mysql.createPool(config.PartnersWebService);

} catch (err) {
  _logger.fatal(err.stack)
  return res.json({
    respcode: 2,
    respmsg: err.stack
  });
}

module.exports = {
  kpusers,
  domestic,
  kp8,
  billspay,
  global,
  wallet,
  express,
  apiOld,
  apiNew,
  fileUpload,
  webService
}