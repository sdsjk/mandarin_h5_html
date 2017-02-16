var host = 'http://www.jingcaishuo.com/';
var host1 = "http://123.57.59.76:9095/";
var price;
var Money;
var cardId = '';
var backprice;

var PAY_TYPE_WX = 1;
var PAY_TYPE_ALIPAY = 2;
var PAY_TYPE_GOLD = 3;
var PAY_TYPE_CARD = 6;

var PAY_TYPE = PAY_TYPE_WX;
var NickName;
var AuthorId;
var j_loading = new Loading();

//获取token
function getUserToken() {
	return $.parseJSON(app.getArticleInformation());

}

function getUserId() {
	//	return '50564';
	return getUserToken().UserId;
}

function getArticleId() {
	//	return '195113';
	return getUserToken().ArticleId;
}

function getSecurityCode() {
	//	return 'df02f24c1245249f39b005a172344056';
	return getUserToken().SecurityCode;
}

function Init() {

//	layer.open({
//		type: 2
//	});
j_loading.openL();
	//alert(getUserId());
	//alert(getSecurityCode());
	//alert(getArticleId());
	$.ajax({
		url: host + "User/GetUserFortuneAndArticlePrice",
		type: 'GET',
		dataType: "jsonp",
		jsonp: "callback", // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback: "cookieHandler", // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		async: true,
		data: {
			userId: getUserId(),
			token: getSecurityCode(),
			articleId: getArticleId(),
			language: 'M'
		},
		success: function(e) {
			//			alert(JSON.stringify(e));
//			layer.closeAll();
			j_loading.closeL();
			fillData(e);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
//			layer.closeAll();
j_loading.closeL();
		}
	});
	if(getUserId() == '25' && getDeviceinfo().type == 'ios') {
		$('#czth').hide();
		$('.sm').hide();
		$('#weixinpay').hide();
		$('#aliplay').hide();
	} else {
		$('#czth').show();
		$('.sm').show();
		$('#weixinpay').show();
		$('#aliplay').show();
	}

}

//填充支付信息
function fillData(e) {

	AuthorId = e.AuthorId;
	backprice = e.Price;
	price = e.Price;
	Money = e.Money;
	NickName = e.NickName;
	$('#lectrue_name').text(NickName);
	$("#price").text(price);
	if(Money < price) {
		$('.balance').text('(余额不足)');
		$('#countmoney').css('color', '#888');
	} else {
		$('.balance').text("(余额:   " + Money + "精彩币)");
		$('#countmoney').css('color', '#FFFFF');
	}
}

//初始化页面信息
Init();
var weixinflag = true;
//微信支付
$('#weixinpay').unbind('click').bind('click', function() {
	if(weixinflag) {
		weixinflag = false;
		app.clickPay(PAY_TYPE_WX, getArticleId(), AuthorId, cardId);

	}
	setTimeout(function() {
		weixinflag = true
	}, 3000);

});
//支付宝支付
$('#aliplay').unbind('click').bind('click', function() {
	if(weixinflag) {
		weixinflag = false;
		app.clickPay(PAY_TYPE_ALIPAY, getArticleId(), AuthorId, cardId);
	}
	setTimeout(function() {
		weixinflag = true
	}, 3000);
});
//精彩币支付
$('#jcbplay').unbind('click').bind('click', function() {
	if(weixinflag) {

		weixinflag = false;
		if(Money < price) {
			//		alert("余额不足");
		} else {
			app.clickGoldPay(PAY_TYPE_GOLD, getArticleId(), AuthorId, cardId, price);
		}
	}
	setTimeout(function() {
		weixinflag = true
	}, 3000);
});

//在线客服
var author_id = "234";
$('#onlineservice').click(function() {
	app.pushToOnlineServiceView(author_id);
});
$('#onlineservice1').click(function() {
	app.pushToOnlineServiceView(author_id);
});
var phonenumber = '15010777055';
//客服电话
$('#telphone').click(function() {
	app.CallPhone(phonenumber);
});


function refresh(){
	Init();
}

//获取设备信息
function getDeviceinfo() {
	var device_type = 'other';
	var system_version = null;
	var app = null;
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/iphone/i) == "iphone" || ua.match(/ipad/i) == "ipad") {
		device_type = 'ios';
		system_version = 10;
		if(ua.match(/iPhone OS 4/i) == "iPhone OS 4") {
			system_version = 4;
		} else if(ua.match(/iPhone OS 5/i) == "iPhone OS 5" || ua.match(/ipad; cpu os 5/i) == "ipad; cpu os 5") {
			system_version = 5;
		} else if(ua.match(/iPhone OS 6/i) == "iPhone OS 6" || ua.match(/ipad; cpu os 6/i) == "ipad; cpu os 6") {
			system_version = 6;
		} else if(ua.match(/iPhone OS 7/i) == "iPhone OS 7" || ua.match(/ipad; cpu os 7/i) == "ipad; cpu os 7") {
			system_version = 7;
		} else if(ua.match(/iPhone OS 8/i) == "iPhone OS 8" || ua.match(/ipad; cpu os 8/i) == "ipad; cpu os 8") {
			system_version = 8;
		} else if(ua.match(/iPhone OS 9/i) == "iPhone OS 9" || ua.match(/ipad; cpu os 9/i) == "ipad; cpu os 9") {
			system_version = 9;
		} else {

		}

	} else if(ua.match(/android/i) == "android") {
		device_type = 'android';
	} else {
		device_type = 'pc';
	}

	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		app = "weixin";
	} else if(ua.match(/Weibo/i) == "weibo") {
		app = "weibo";
	} else if(ua.match(/\sQQ/i) == " qq") {
		app = "qq";
	}

	return {
		'type': device_type,
		'ver': system_version,
		'app': app
	}
}