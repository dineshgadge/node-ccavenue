var helper = require('./helper');
var qs = require('querystring')

var otherParams = {};

var config = {
	merchantId: '',
	workingKey: '',
	orderId: '',
	redirectUrl: '',
	orderAmount: ''
};

function setMerchant(mid) {
	config.merchantId = mid;
}
function setWorkingKey(wk) {
	config.workingKey = wk;
}
function setAccessCode(ac) {
  config.accessCode = ac;
}
function setOrderId(oi) {
	config.orderId = oi;
}
function setRedirectUrl(ru) {
	config.redirectUrl = ru;
}
function setOrderAmount(oa) {
	config.orderAmount = oa;
}
function setBillingEmail(be) {
  config.billingEmail = be;
}

// function setOtherParams(obj) {
// 	otherParams = obj;
// }

function makePayment(res) {
	var errors = helper.checkRequiredFields(config);
	if(errors.length > 0) {
		throw new Error(errors);	
	}

	var encRequest = helper.encrypt(config.merchantId, config.billingEmail, config.orderAmount, config.orderId, config.redirectUrl, config.workingKey);
      
  var body =  "<form id='nonseamless' method='post' name='redirect' action='https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction'>" +
              "<input type='hidden' id='encRequest' name='encRequest' value='" + encRequest + "'>" + 
              "<input type='hidden' name='access_code' id='access_code' value='" + config.accessCode + "' >" + 

  // for(var key in otherParams) {
  // 		body += "<input type=hidden name='"+ key +"' value='" + otherParams[key] + "'>";
  // }

  body += "</form>" + 
          "<script type='text/javascript'>" +
	          "document.getElementById('redirect').submit();" +
	        "</script>";

	res.writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/html'
  });

	res.write(body);
	res.end();
}

function paymentRedirect(req) {
	var body = qs.parse(req.body);
    
  var ccString = helper.decrypt(body.encResponse, config.workingKey);
  var ccJson = qs.parse(ccString);
  
  // ccString = config.merchantId + '|' + ccJson.Order_Id + '|' +
  //              ccJson.Amount + '|' + ccJson.AuthDesc + '|' + config.workingKey;
  
  // var Checksum = helper.genChecksum(ccString);
  // ccJson.isCheckSumValid = helper.verifyChecksum(Checksum, ccJson.Checksum);
  
  return ccJson;
}


module.exports = {
  setMerchant: setMerchant,
  setWorkingKey: setWorkingKey,
  setAccessCode: setAccessCode,
  setOrderId: setOrderId,
  setRedirectUrl: setRedirectUrl,
  setOrderAmount: setOrderAmount,
  // setOtherParams: setOtherParams,
  setBillingEmail: setBillingEmail,
  makePayment: makePayment,
  paymentRedirect: paymentRedirect
};
