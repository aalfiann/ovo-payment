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

describe("Intentional failure test", function() {

    it("get description code with integer instead string parameter", function() {
        var ovo = new OVO(config);
        assert.equal(ovo.descriptionCode(8),'Failed to redeem deal, voucher already used');
    });

    it('request with empty url will not make http request', function(){
        var ovo = new OVO(config);
        ovo.url = '';
        assert.throws(function(){ovo.send(function(response) {})}, Error, "Error thrown");
    });

    it('method add with wrong parameter will not adding any data', function(){
        var ovo = new OVO(config);
        var body = ovo.type('push')
            .add([],'5000').getBody();
        assert.equal(body.amount,undefined);
        var body = ovo.type('push')
            .add('amount').getBody();
        assert.equal(body.amount,undefined);
    });

    it('method type with wrong parameter will not adding type data', function(){
        var ovo = new OVO(config);
        var body = ovo.type([]).getBody();
        assert.equal(body.type,undefined);
    });

    it('method remove with empty parameter will not removing any data', function(){
        var ovo = new OVO(config);
        var body = ovo.type('push')
            .amount(5000)
            .remove().getBody();
        assert.equal(body.amount,5000);
    });

});