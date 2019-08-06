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

describe("ovo-payment-config-test", function() {

    it("config is not empty", function() {
        assert.notEqual(config, undefined);
        assert.notEqual(config, '');
    });

    it("config is json object", function() {
        assert.equal(isJsonObject(config), true);
    });

    it("config should have required app_id", function() {
        var ovo = new OVO(config);
        assert.notEqual(ovo.app_id, undefined);
        assert.notEqual(ovo.app_id, '');
    });

    it("config should have required app_key", function() {
        var ovo = new OVO(config);
        assert.notEqual(ovo.app_key, undefined);
        assert.notEqual(ovo.app_key, '');
    });

    it("config should have required merchantId", function() {
        var ovo = new OVO(config);
        assert.notEqual(ovo.merchantId, undefined);
        assert.notEqual(ovo.merchantId, '');
    });

    it("config should have required tid", function() {
        var ovo = new OVO(config);
        assert.notEqual(ovo.tid, undefined);
        assert.notEqual(ovo.tid, '');
    });

    it("config should have required mid", function() {
        var ovo = new OVO(config);
        assert.notEqual(ovo.mid, undefined);
        assert.notEqual(ovo.mid, '');
    });

    it("config should have required storeCode", function() {
        var ovo = new OVO(config);
        assert.notEqual(ovo.storeCode, undefined);
        assert.notEqual(ovo.storeCode, '');
    });

    it("config url is optional", function() {
        var ovo = new OVO(config);
        assert.notEqual(ovo.url, undefined);
        assert.notEqual(ovo.url, '');
    });

    it("empty config random is always empty if run with no send method", function() {
        var ovo = new OVO(config);
        ovo.type('push').amount(5000).phone('0856').merchantInvoice('xxx').getBody();
        assert.equal(ovo.random, '');
    });

    it("empty config random will automatically having value if run with send method", function() {
        var ovo = new OVO(config);
        ovo.type('push').amount(5000).phone('0856').merchantInvoice('xxx').send(function(response){

        });
        assert.notEqual(ovo.random, undefined);
        assert.notEqual(ovo.random, '');
    });

    it('empty config.mode should using url staging', function(){
        var ovo = new OVO(config);
        assert.equal(ovo.url,'https://api.byte-stack.net/pos');
    });

    it('config.mode staging should using url staging', function(){
        var ovo = new OVO(config);
        assert.equal(ovo.url,'https://api.byte-stack.net/pos');
    });

    it('config.mode production should using url production', function(){
        config.mode = 'production';
        var ovo = new OVO(config);
        assert.equal(ovo.url,'https://api.ovo.id/pos');
    });

});