const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const Operator = require('./src/routers/Operator');
const VersionRouter = require('./src/routers/Version');

const BillspaySendout = require('./src/routers/Billspay/Sendout');
const BillspaySendoutCancel = require('./src/routers/Billspay/SendoutCancel');

const DomesticSendout = require('./src/routers/Domestic/Sendout');
const DomesticSendoutCancel = require('./src/routers/Domestic/SendoutCancel');
const DomesticPayout = require('./src/routers/Domestic/Payout');
const DomesticPayoutCancel = require('./src/routers/Domestic/PayoutCancel');

const GlobalSendout = require('./src/routers/Global/Sendout');
const GlobalSendoutCancel = require('./src/routers/Global/SendoutCancel');
const GlobalPayout = require('./src/routers/Global/Payout');
const GlobalPayoutCancel = require('./src/routers/Global/PayoutCancel');

const KP8Sendout = require('./src/routers/KP8/Sendout');
const KP8SendoutCancel = require('./src/routers/KP8/SendoutCancel');
const KP8Payout = require('./src/routers/KP8/Payout');
const KP8PayoutCancel = require('./src/routers/KP8/PayoutCancel');

const PartnersPayout = require('./src/routers/Partners/Payout');
const PartnersSendout = require('./src/routers/Partners/Sendout');
const PartnersWUPayment = require('./src/routers/Partners/WUPayment');
const PartnersWURefund = require('./src/routers/Partners/WURefund');

const version = '/KPIntegrationv1.0';

app.use(version, Operator);
app.use(version, VersionRouter);

app.use(version, BillspaySendout);
app.use(version, BillspaySendoutCancel);

app.use(version, DomesticSendout);
app.use(version, DomesticSendoutCancel);
app.use(version, DomesticPayout);
app.use(version, DomesticPayoutCancel);

app.use(version, GlobalSendout);
app.use(version, GlobalSendoutCancel);
app.use(version, GlobalPayout);
app.use(version, GlobalPayoutCancel);

app.use(version, KP8Sendout);
app.use(version, KP8SendoutCancel);
app.use(version, KP8Payout);
app.use(version, KP8PayoutCancel);

app.use(version, PartnersPayout);
app.use(version, PartnersSendout);
app.use(version, PartnersWUPayment);
app.use(version, PartnersWURefund);

const port = process.env.PORT || 2208;

app.listen(port, (err) => {
  if (err) {
    console.log(`Application ${err.stack}`)
  } else {
    console.log(`Listening to port: ${port}`)
  }
})