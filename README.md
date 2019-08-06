# ovo-payment
[![NPM](https://nodei.co/npm/ovo-payment.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovo-payment/)  
  
[![npm version](https://img.shields.io/npm/v/ovo-payment.svg?style=flat-square)](https://www.npmjs.org/package/ovo-payment)
[![Build Status](https://travis-ci.org/aalfiann/midtrans-payment.svg?branch=master)](https://travis-ci.org/aalfiann/ovo-payment)
![NPM download/month](https://img.shields.io/npm/dm/ovo-payment.svg)
![NPM download total](https://img.shields.io/npm/dt/ovo-payment.svg)  
OVO payment wrapper class for NodeJS

## Usage
This library is refer to OVO documentation version 1.2

### Install
```bash
$ npm install ovo-payment
```

### Set Config
Note: config has been changed since 1.1.0 version.
```javascript
var OVO = require('ovo-payment');

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
```

### Example for Push to Pay
```javascript
var ovo = new OVO(config);
ovo.type('push')
    .amount(5000)
    .phone('0856')          // your phone must be registered in OVO
    .merchantInvoice('xxx') // you can not use same invoice number if the previous request was failed or canceled
    .send(function(response){
        console.log(response.body);
    });
```

### Example for Reversal Push to Pay
Note: Reversal is used only for timeout or no any response from OVO
```javascript
var ovo = new OVO(config);
ovo.type('reversal')
    .amount(5000)
    .phone('0856')          // your phone must be registered in OVO
    .merchantInvoice('xxx') // your previous invoice number
    .referenceNumber('xxx') // your previous referenceNumber
    .send(function(response){
        console.log(response.body);
    });
```

### Example for Void Push to Pay
```javascript
var ovo = new OVO(config);
ovo.type('void')
    .amount(5000)
    .phone('0856')          // your phone must be registered in OVO
    .merchantInvoice('xxx') // your previous invoice number
    .referenceNumber('xxx') // your previous referenceNumber
    .batchNo('xxx')         // your previous batchNo
    .send(function(response){
        console.log(response.body);
    });
```

### Response
We use [unirest](https://unirest.io) for request call to endpoint OVO

### Unit Test
Unit test is using **mocha**
```
npm test
```