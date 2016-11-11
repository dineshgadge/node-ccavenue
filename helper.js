var crypto = require('crypto'), algorithm = 'aes-128-cbc';
var qs = require('querystring')

function decrypt(encText, workingKey){
  var m = crypto.createHash('md5');
  m.update(workingKey)
  var key = Buffer.from(m.digest("binary").substring(0, 16), "binary");
  var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';  
  var decipher = crypto.createDecipheriv(algorithm, key, iv);
  var decoded = decipher.update(encText,'hex','utf8');
  decoded += decipher.final('utf8');
  return decoded;
}

function encrypt(merchantId, billingEmail, amount, orderId, redirectUrl, workingKey)
{
  var qsObject = {
    merchant_id: merchantId,
    billing_email: billingEmail,
    order_id: orderId,
    billing_tel: null,
    currency: 'INR',
    amount: amount,
    redirect_url: redirectUrl,
    cancel_url: redirectUrl,
    language: "EN"
  };
  var plainText = qs.stringify(qsObject);

  var m = crypto.createHash('md5');
  m.update(workingKey);
  var key = Buffer.from(m.digest("binary").substring(0, 16), "binary");
  var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';  
  var cipher = crypto.createCipheriv(algorithm, key, iv);
  var encoded = cipher.update(plainText,'utf8','hex');
  encoded += cipher.final('hex');
  return encoded;
}

function checkRequiredFields(config) {
  var errors = [];

  if(! config.merchantId) {
    errors.push("Merchant Id is required");
    console.log("Merchant Id is required");
  }

  if(! config.workingKey) {
    errors.push("Working Key is required");
    console.log("Working Key is required");
  }

  if(! config.orderId) {
    errors.push("Order Id is required");
    console.log("Order Id is required");
  }

  if(! config.redirectUrl) {
    errors.push("Redirect Url is required");
    console.log("Redirect Url is required");
  }

  if(! config.orderAmount) {
    errors.push("Order Amount is required");
    console.log("Order Amount is required");
  }

  if(! config.accessCode) {
    errors.push("Access Code is required");
    console.log("Access Code is required");
  }

  if(! config.billingEmail) {
    errors.push("Billing Email is required");
    console.log("Billing Email is required");
  }

  return errors;
}


module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
  checkRequiredFields: checkRequiredFields
};
