const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger')

router.get('/Version', (req,res) => {

  const _logger = logger('VERSION')

  const version = '/KPIntegrationv1.0';

  _logger.info(`Version : ${version}`)
  return res.json({
    version: version
  });
})

module.exports = router;