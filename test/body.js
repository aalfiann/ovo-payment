var assert = require('assert');
var OVO = require('../src/ovo.js');

var config = {
    app_id: "xxx",
    app_key: "xxx",
    merchantId: "xxx",
    tid: "xxx",
    mid: "xxx",
    storeCode: "1234",
    mode: "",           // [optional] staging|production, if empty then will use api staging url address
    random: ""          // [optional] if empty then hmac will use _randomizer()
}

function isJsonObject(json) {
    if(typeof json === 'object') {
        return true;
    } 
    return false;
}

function hasKey(data,name){
    name = name instanceof Array ? name : [name];
	return name.every(key => Object.keys(data).includes(key));
}

describe("ovo-payment-body-test", function() {
    it('body should be json object', function(){
        var ovo = new OVO(config);
        var body = ovo.type('push').amount(5000).phone('0856').merchantInvoice('xxx').getBody();
        assert.equal(isJsonObject(body), true);
    });

    it('body should have required keys', function(){
        var ovo = new OVO(config);
        var body = ovo.type('push').amount(5000).phone('0856').merchantInvoice('xxx').getBody();
        assert.equal(hasKey(body,[
            'appSource','date','tid','mid','merchantId','storeCode','referenceNumber','type','processingCode'
        ]), true);
        assert.equal(hasKey(body.transactionRequestData,[
            'batchNo','phone','merchantInvoice'
        ]), true);
    });

    it('body push should have correct type and processingCode', function(){
        var ovo = new OVO(config);
        var body = ovo.type('push').amount(5000).phone('0856').merchantInvoice('xxx').getBody();
        assert.equal(body.type, '0200');
        assert.equal(body.processingCode, '040000');
    });

    it('body reversal should have correct type and processingCode', function(){
        var ovo = new OVO(config);
        var body = ovo.type('reversal').amount(5000).phone('0856').merchantInvoice('xxx').referenceNumber('xxx').getBody();
        assert.equal(body.type, '0400');
        assert.equal(body.processingCode, '040000');
    });

    it('body void should have correct type and processingCode', function(){
        var ovo = new OVO(config);
        var body = ovo.type('void').amount(5000).phone('0856').merchantInvoice('xxx').referenceNumber('xxx').batchNo('xxx').getBody();
        assert.equal(body.type, '0200');
        assert.equal(body.processingCode, '020040');
    });

    it('body support add custom key', function(){
        var ovo = new OVO(config);
        var body = ovo.type('void').add('custom','12345').amount(5000).phone('0856').merchantInvoice('xxx').getBody();
        assert.equal(body.custom, '12345');
    });

    it('body support remove custom key', function(){
        var ovo = new OVO(config);
        var body = ovo.type('void').add('custom','12345').remove('custom').amount(5000).phone('0856').merchantInvoice('xxx').getBody();
        assert.equal(body.custom, undefined);
    });
});