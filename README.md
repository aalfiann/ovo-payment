# ovo-payment
OVO payment wrapper class for Total.js

## Usage
This library is refer to OVO documentation version 1.2

### Install
```bash
$ npm install -g ovo-payment
```

### Basic Example for Push to Pay
```javascript
var OVO = require('ovo-payment');

var config = {
    app_id: "xxx",
    app_key: "xxx",
    merchantId: "xxx",
    tid: "xxx",
    mid: "xxx",
    storeCode: "1234",
    url: "",            // optional, if empty then will use api stagging url address
    random: ""          // optional, if empty then hmac will use uuidv4()
}

var ovo = new OVO(config);
ovo.type('push')
    .amount(5000)
    .phone('0856')
    .merchantInvoice('xxx')
    .send(function(response){
        console.log(response);
    });
```

### Unit Test
Unit test is using **mocha**
```
npm test
```