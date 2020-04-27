

var CronJob = require('cron').CronJob;
var Ip =require('./ip.js');

Ip.check();
var job = new CronJob('*/60 * * * * *', function() {
  //console.log('You will see this message every 60 second');
  Ip.check();
}, null, true, 'Europe/Paris');
job.start();
