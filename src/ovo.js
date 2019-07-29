/**
 * OVO Payment ES6 Class
 * @version 1.2     this is refer to tech doc version from OVO
 */
'use strict';
require('total.js');
const unirest = require('unirest');
const uuidv4 = require('uuid/v4');
const _hmac = Symbol('_hmac');
const _isEmptyConfig = Symbol('_isEmptyConfig');
const _autoReferenceNumber = Symbol('_autoReferenceNumber');
const _autoBatchNo = Symbol('_autoBatchNo');

class OVO {

    /**
     * Constructor
     * @param {object} config 
     * 
     * Note:
     * Example required config
     * {
     *      app_id: "",
     *      app_key: "",
     *      merchantId: "",
     *      tid: "",
     *      mid: "",
     *      storeCode: "",
     *      url: "",            >> optional, if empty then will use api stagging url address
     *      random: ""          >> optional, if empty then hmac will use uuidv4()
     * }
     */
    constructor(config) {
        this.body = {};
        for(var key in config) {
            if(config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
        if(!config.url) {
            this.url = "https://api.byte-stack.net/pos";
        }
    }

    /**
     * Determine if config empty or not
     * @param {string} name
     * @return {bool} 
     */
    [_isEmptyConfig](name) {
        if(this[name]===undefined || this[name]===null || this[name]==='') return true;
        return false;
    }

    /**
     * Auto generate referenceNumber
     * @return {string}
     */
    [_autoReferenceNumber]() {
        return (Math.floor(100000 + Math.random() * 900000)).toString();
    }

    /**
     * Auto generate batchNo
     * @return {string}
     */
    [_autoBatchNo]() {
        var date = new Date();
        var dd = date.getDate().toString();
        var ddChars = dd.split('');
        var mm = (date.getMonth()+1).toString();
        var mmChars = mm.split('');
        return date.getFullYear().toString().substr(2,2)+''+(mmChars[1]?mm:"0"+mmChars[0])+''+(ddChars[1]?dd:"0"+ddChars[0]);
    }

    /**
     * OVO HMAC Cryptography
     * @return {string}
     */
    [_hmac]() {
        return (this.app_id+this.random).sha256(this.app_key);
    }

    /**
     * Add new or replace key in body json object
     * @param {string} name 
     * @param {object} data
     * @return {this}
     */
    add(name,data) {
        if(typeof name === 'string' || name instanceof String){
            if(data) {
                this.body[name] = data;
            }
        }
        return this;
    }

    /**
     * Remove key in body json object
     * @param {string} name
     * @return {this}
     */
    remove(name) {
        if(typeof name === 'string' || name instanceof String){
            delete this.body[name];
        }
        return this;
    }

    /**
     * OVO Payment Type
     * @param {string} name     there is 3 type of payment push|reversal|void
     * @return {this}
     */
    type(name) {
        this.add('transactionRequestData',{});
        this.add('appSource','POS');
        this.add('date', (new Date().toISOString().replace("T"," ").replace("Z","")).toString());
        this.add('tid', this.tid.toString());
        this.add('mid', this.mid.toString());
        this.add('merchantId', this.merchantId.toString());
        this.add('storeCode', this.storeCode.toString());

        if(typeof name === 'string' || name instanceof String){
            switch(name) {
                case 'reversal':
                    // Reversal Push to Pay
                    this.remove('referenceNumber');
                    this.add('type','0400');
                    this.add('processingCode','040000');
                    this.body.transactionRequestData.batchNo = this[_autoBatchNo]();
                    break;
                case 'void':
                    // Void Push to Pay
                    this.remove('referenceNumber');
                    this.add('type','0200');
                    this.add('processingCode','020040');
                    break;
                default:
                    // Push to Pay
                    this.add('type','0200');
                    this.add('processingCode','040000');
                    this.add('referenceNumber',this[_autoReferenceNumber]());
                    this.body.transactionRequestData.batchNo = this[_autoBatchNo]();
            }
        }
        return this;
    }

    /**
     * Amount for payment
     * @param {*} number        number of amount to pay 
     * @return {this}
     */
    amount(number) {
        this.add('amount',parseInt(number));
        return this;
    }

    /**
     * Your client phone number
     * @param {*} number        phone number or loyalty id OVO
     * @return {this}
     */
    phone(number) {
        this.body.transactionRequestData.phone = (number).toString();
        return this;
    }

    /**
     * Merchant Invoice from your store
     * @param {*} invoice       Invoice should be unique
     * @return {this}
     */
    merchantInvoice(invoice) {
        this.body.transactionRequestData.merchantInvoice = (invoice).toString();
        return this;
    }

    /**
     * Write BatchNo (Only use this function for void push to pay )
     * @param {*} number        batchNo from previous push to pay
     * @return {this}
     */
    batchNo(number) {
        this.body.transactionRequestData.batchNo = (number).toString();
        return this;
    }

    /**
     * Write referenceNumber (Only use this function for reversal or void push to pay)
     * @param {*} number 
     */
    referenceNumber(number) {
        this.add('referenceNumber',(number).toString());
        return this;
    }
  
    /**
     * Get Body of json object
     * @return {object}
     */
    getBody() {
        return this.body;
    }

    /**
     * Send Body json object to OVO
     * @param {callback} callback
     * @return {callback}
     */
    send(callback){
        if(this[_isEmptyConfig]('random')) this.random = uuidv4();
        unirest.post(this.url)
        .headers({
            'Content-Type': 'application/json',
            'app-id': this.app_id,
            'hmac': this[_hmac](),
            'random': this.random
        })
        .send(this.body)
        .timeout(60000)
        .end(function (response) {
          return callback(response);
        });
    }

    /**
     * Get Description of OVO Response Code 
     * @param {*} code 
     * @return {string}
     */
    descriptionCode(code) {
        code = code.toString();
        var coderes = {
            "00": "Success",
            "8": "Failed to redeem deal, voucher already used",
            "11": "Invalid user level, unable to proceed cash withdrawal",
            "13": "Using amount less than equal zero",
            "14": "Phone number/OVO ID not found in OVO System",
            "16": "Invalid Card Number",
            "17": "OVO User cancel payment using OVO Apps",
            "18": "Failed to redeem deal, invalid voucher code",
            "26": "Failed push payment confirmation to OVO Apps",
            "30": "Invalid ISO Specs",
            "40": "Error in 3rd party, including failed to deduct/topup e-money",
            "44": "Refund code is no longer valid (over the time limit)",
            "51": "Fund in card is not enough to make payment",
            "56": "Card is blocked, unable to process card transaction",
            "57": "Not eligible to do refund, siloam balance = 0",
            "58": "Not valid transaction in merchant/terminal",
            "61": "Amount/count exceed limit, set by user",
            "63": "Authentication failed",
            "64": "Account is blocked, unable to process transaction"
        }
        return coderes[code];
    }

}

module.exports = OVO;