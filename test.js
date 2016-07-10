/*
* script to book car sharing
* set environmental variables
* TP_CARD_NO1
* TP_CARD_NO2
* TP_PASSWORD
* TP_STATION_CODE
* TP_PRIMARY_CAR
* TP_SECONDARY_CAR
*/

var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

var client = webdriverio.remote(options);

client
.init()
.url('https://plus.timescar.jp/')
    .getTitle().then(function(title) {
    console.log('Title was: ' + title);
})
.setValue('#cardNo1', process.env.TP_CARD_NO1)
.setValue('#cardNo2', process.env.TP_CARD_NO2)
.setValue('#tpPassword', process.env.TP_PASSWORD)
.click('#tpLogin')
.waitForExist('#yakkan_box', 5000)
.getUrl().then(function(url){
    console.log(url);
})
.click('#yakkan_box .s_agree')
.url('https://plus.timescar.jp/view/reserve/input.jsp?scd='+process.env.TP_STATION_CODE)
.selectByAttribute('#carId', 'value', process.env.TP_PRIMARY_CAR)
.selectByIndex('#dateStart', 22)
.selectByAttribute('#hourStart', 'value', '8')
.selectByIndex('#dateEnd', 22)
.selectByAttribute('#hourEnd', 'value', '20')
.click('#doCheck')
.getUrl().then(function(url) {
    console.log(url);
    if(url.indexOf('confirm')>-1){
        console.log('confirm');
        client.click('#doOnceRegist')
        .getUrl().then(function(cUrl){
            console.log(cUrl);
            if(cUrl.indexOf('complete')>-1){
                console.log('complete');
            }
        });
    }else if(url.indexOf('input')>-1){
        console.log('error');
        console.log(client);
        client
            .selectByAttribute('#carId', 'value', process.env.TP_SECONDARY_CAR)
            .click('#doCheck')
            .click('#doOnceRegist')
            .getUrl().then(function(cUrl){
            console.log(cUrl);
            if(cUrl.indexOf('complete')>-1){
                console.log('complete');
            }
        });
    }
})
//.end();
;
