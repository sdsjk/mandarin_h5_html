var param = {
	"SecurityCode": "bf629626ff339c8fbd2c2ae54e78bf5c",
	"UserId": "52454"
};
var host = "http://www.jingcaishuo.com/";
//var host="http://123.57.59.76:9095/";
var UserId = '';
var SecurityCode = '';
var monery;
var name = '';
//获取token
function getUserToken() {
	//		return param;
	return $.parseJSON(app.checkTheLoginState());

}

function getUserId() {
	return getUserToken().UserId;
}

function getSecurityCode() {
	return getUserToken().SecurityCode;
}
var letter = "";

function showRedDot() {
	letter = app.checkNewLetter();
	if(letter == "," || letter == undefined || letter == "") {
		$("#mymessagedot").hide();
		$("#onlinedot").hide();
		return;
	} else {
		var arr_let = letter.split(",");
		$("#mymessagedot").show();
		if($.inArray('234', arr_let) == 1) {
			$("#onlinedot").show();
		} else {
			$("#onlinedot").hide();
		}
	}

}

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

function setUserInfo() {
	//	layer.open({
	//		type: 2
	//	});
	//alert(getUserId());
	//alert(getSecurityCode());
	$.ajax({
		url: host + "User/GetUserInfo",
		type: 'GET',
//		dataType: "jsonp",
//		jsonp: "callback", // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
//		jsonpCallback: "cookieHandler", // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
//		async: true,
		data: {
			userId: getUserId(),
			token: getSecurityCode(),
			language: 'M'

		},
		success: function(e) {
			//			alert(JSON.stringify(e));
			fillData(e);
			//			layer.closeAll();

		},
		error: function(jqXHR, textStatus, errorThrown) {
			//			layer.closeAll();
		}
	});
}

function fillData(e) {

	if(e.code != '0') {

		app.reloginAction();
	}

	monery = e.Money;
	$('#monney').text(monery);
	$('#logintel').text(e.PhoneNumber);
//	alert(e.PicPath);
	if('' == e.PicPath || undefined == e.PicPath || 'undefined' == e.PicPath) {
		$('#usericon').attr('src', './img/unent.png');
	} else {
		$('#usericon').attr('src', e.PicPath + "?temp=" + Math.random());
	}

}

function isLogin() {
	if('' == getUserId() || '' == getSecurityCode() || undefined == getUserId() || undefined == getSecurityCode() || 'undefined' == getUserId() || 'undefined' == getSecurityCode()) {
		return false;
	} else {
		return true;
	}
}
window.onload = function() {

	readplay();
}

function readplay() {
	UserId = getUserId();
	SecurityCode = getSecurityCode();

	if(isLogin()) {
		$('#recharge').show();
		if(UserId == '25' && getDeviceinfo().type == 'ios') {
			$('#recharge').text('赚精彩币');
		} else {
			$('#recharge').text('充值');
		}
		setUserInfo();
	} else {
		if(getDeviceinfo().type == 'ios') {
			$('#recharge').hide();
		} else {
			$('#recharge').show();
		}

		$('#usericon').attr('src', './img/unent.png');
		$('#monney').text('');
		$('#logintel').text('请登录');
		//		$('.recharge').hide();
	}
	showRedDot();
}

function refresh() {

	readplay();
}

//修改用户图像
$('#usericon').click(function() {
	if(isLogin()) {
		app.callThePhotoChangeView();
	} else {
		app.pushLoginView();
	}

});

// 充值
$('#recharge').click(function() {
	if(!isLogin()) {
		app.pushLoginView();
	} else {
		if(UserId == '25' && getDeviceinfo().type == 'ios') {
			app.pushToTaskView();
		} else {
			app.pushToPayMoneyView(monery);
		}
	}
});

$('#logintel').click(function() {
	if(!isLogin()) {
		app.pushLoginView();
	}
});
//登陆
$('#login').click(function() {
	app.pushLoginView();

});

//我的购买
$('#buy').click(function() {
	if(isLogin()) {
		//		app.pushToMyPurchaseView();
		app.pushToWebView("http://www.jingcaishuo.com/mandarin_h5_html/mybuy_mandarin/", 1);
	} else {
		app.pushLoginView();
	}

});

//我的私信
$('#mesasge').click(function() {
	if(isLogin()) {
		app.pushToMyLettersView(letter);
	} else {
		app.pushLoginView();
	}

});

//我的收藏
$('#collection').click(function() {
	if(isLogin()) {
		//		app.pushToMyCollectView();
		app.pushToWebView("http://www.jingcaishuo.com/mandarin_h5_html/keep_mandarin/", 1);
	} else {
		app.pushLoginView();
	}

});
//在线客服
var teachName = "在线小秘书";
var author_id = "234";
$('#onlineservice').click(function() {
	if(isLogin()) {
		app.pushToOnlineServiceView(author_id);
	} else {
		app.pushLoginView();
	}

});

//客服与帮助
$('#help').click(function() {

	app.pushToHelpView();
});
//设置
$('#setting').click(function() {

	app.pushToSettingView();
});