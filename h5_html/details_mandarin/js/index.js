var articleId;
var host = 'http://www.jingcaishuo.com/';
var host1 = "http://123.57.59.76:9095/";
var bmst = 'http://bmst.jingcaishuo.net'; //测试
var bms = 'http://bms.jingcaishuo.net'; //正式
var isFollowed;
var articlePraised; //点赞
var purchaseNums; //点赞个数
var articleCollected; //收藏
var authorId;
var authorName;
var digest;
var origin;
var authorPic;
var sign_key;
var matchlist;
var origin; //广告跳转的地址
var vedioshow;//图显示的地址
var j_loading = new Loading();
var param = {
	"SecurityCode": "bf629626ff339c8fbd2c2ae54e78bf5c",
	"UserId": "50464"
};
//获取token
function getUserToken() {
//	return param;
	return $.parseJSON(app.checkTheLoginState());
}

function getUserId() {
	return getUserToken().UserId;
}

function getSecurityCode() {
	return getUserToken().SecurityCode;
}

articleId = getUserToken().ArticleId;
//articleId = 231128;
//articleId = 197355;
//alert(articleId);
getData();

function getData() {
//	layer.open({
//		type: 2
//	});
j_loading.openL();
	$.ajax({
		url: host + "article/detail",
		type: 'GET',
		dataType: "jsonp",
		jsonp: "callback", // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback: "cookieHandler", // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		async: true,
		data: {
			language: 'M',
			userId: getUserId(),
			articleId: articleId
		},
		success: function(e) {
			console.info(JSON.stringify(e));
//			layer.closeAll();
			j_loading.closeL();
			fillData(e.Articles);
			hintposition();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//						alert(errorThrown);
//			layer.closeAll();
j_loading.closeL();
		}
	});

}

function fillData(e) {
	//	alert(e.articlePraised);
	origin=e.origin;
	vedioshow=e.vedioshow;
	articlePraised = e.articlePraised;
	purchaseNums = e.praiseNums;
	articleCollected = e.articleCollected;
	authorId = e.author_id;
	authorName = e.authorName;
	digest = e.digest;
	origin = e.origin;
	sign_key = e.sign_key;
	authorPic = e.authorPic;
	$('#cheerup_num').text(purchaseNums);
	//	alert(articlePraised);
	if(articlePraised) {
		$('#cheerupnum').removeClass('span');
		$('#cheerup_num').addClass('gray');
	} else {
		if(!$('#cheerupnum').hasClass('span')) {
			$('#cheerupnum').addClass('span');
		}
	}
	if(articleCollected) {
		$('#collection').find('span').removeClass('span');
	} else {
		if(!$('#collection').find('span').hasClass('sapn')) {
			$('#collection').find('span').addClass('span');
		}
	}
	$('#authod_pic').attr('src', e.authorPic);
	$('#authod_name').text(e.authorName);
	$('#atticle_num').text(e.allaticlenum);
	$('#flllow_num').text(e.follownum);
	if(undefined != e.last_modified && 'undefined' != e.last_modified && '' != e.last_modified) {
		var time = e.last_modified;
//		console.info(e.last_modified);
		var day = fmtMydate(time);
		var hour = time.split(" ")[1];
		$('#publish_day').show();
		$('#publish_day').text(day);
	} else {
		$('#publish_day').hide();
	}
	//	$('#publish_hours').text(hour);
	//添加标签
	//	alert(e.portal_list);
	if(undefined != e.portal_list && 'undefined' != e.portal_list && '' != e.portal_list) {
		var labels = e.portal_list;

		if(labels.length > 0) {
			$('#balls').show();
		} else {

			$('#balls').hide();
		}
		var html = '';
		for(var i = 0; i < labels.length; i++) {
			html += "  " + labels[i].name + "    ";
		}
		$('#checkball').html(html);
	} else {
		$('#balls').hide();
	}

	//判断是不关注
	isFollowed = e.authorFollowed;
	matchlist = e.matches;
	showFollow(1);
	$('#zhaiyao').text(e.digest);
	if(!e.chargeable){
		$('#zhaiyao').hide();
	}
	//判断是不是收费文章   和有没有解锁
//	alert(e.chargeable);
//	alert(e.articlePurchased);
	if(e.chargeable && !e.articlePurchased) {
		$('#zhaiyao').show();
		$('.vip').show();
		$('#atticlelist').show();
		$('#atticlecount').hide();

		var matchlisthtml = '';

		if(matchlist.length == 0 || undefined == matchlist.length || '' == matchlist.length) {
			matchlisthtml += '<div class="teams last"><p>购买后可查看全文</p ><div class="lock" onclick="OpenNativeBuy(' + e.id + ');"><span class="price">' +
				e.price +
				'精彩币</span></div></div><p class="world_num">VIP内容共' +
				e.textLength +
				'字</p >';
		}
		//else {
		//			matchlisthtml += '<div class="teams"><p>购买后可查看全文</p ></div>';
		//		}
		//alert(matchlist[0].home_team);
//		if(undefined != matchlist && '' != matchlist) {
			for(var j = 0; j < matchlist.length; j++) {
				if(j == (matchlist.length - 1)) {
					matchlisthtml += '<div class="teams last"><p><span class="home_team">' +
						matchlist[j].home_team +
						'</span> VS <span class="vis_team">' +
						matchlist[j].away_team +
						'</span></p><p class="tim"><span class="ball"></span><span class="week"></span><span class="com">' +
						matchlist[j].cup_name +
						'</span><span class="day">' +
						matchlist[j].start_time +
						'</span></p><div class="lock" onclick="OpenNativeBuy(' + e.id + ');"><span class="price">' +
						e.price +
						'精彩币</span></div></div><p class="world_num">VIP内容共' +
						e.textLength +
						'字</p>	';
				} else {
					matchlisthtml += '<div class="teams"><p><span class="home_team">' +
						matchlist[j].home_team +
						'</span> VS <span class="vis_team">' +
						matchlist[j].away_team +
						'</span></p><p class="tim"><span class="ball"></span><span class="week"></span><span class="com">' +
						matchlist[j].cup_name +
						'</span><span class="day">' +
						matchlist[j].start_time +
						'</span></p><span class="line"></span></div>';
				}
			}
//		}
		$('#atticlelist').html(matchlisthtml);

	} else {

		$('#atticlelist').hide();
		$('#atticlecount').show();
		$('.vip').hide();
//		if(e.chargeable) {
//			$('#zhaiyao').hide();
//		} else {
//			
//			$('#zhaiyao').show();
//		}

		if(undefined != matchlist && '' != matchlist && matchlist.length != 0) {

			$('.saishi').show();
			var mathlistcontent = '';
			for(var i = 0; i < matchlist.length; i++) {
				//			mathlistcontent += '<div class="teams"><p><span class="home_team">' +
				//					matchlist[i].home_team +
				//					'</span> VS <span class="vis_team">' +
				//					matchlist[i].away_team +
				//					'</span></p><p class="tim"><span class="ball"></span><span class="week"></span><span class="com">' +
				//					matchlist[i].cup_name +
				//					'</span><span class="day">' +
				//					matchlist[i].start_time +
				//					'</span></p><span class="line"></span></div>';
				mathlistcontent += matchlist[i].cup_name.trim() + "   " + matchlist[i].home_team + " VS " + matchlist[i].away_team + "    " + fmtMydate(matchlist[i].start_time) + "<br/>";
			}
			$('#saishiname').html(mathlistcontent);
		}
		$('#atticlecount').html(e.text);

		if(undefined != $('#atticlecount').find('img') || '' != $('#atticlecount').find('img') || 'undefined' != $('#atticlecount').find('img')) {

			var len = $('#atticlecount').find('img').length;
			//		alert(len);
			for(var k = 0; k < len; k++) {
				if($($('#atticlecount').find('img')[k]).attr('src').indexOf(bms) < 0) {
					//       		alert(1111);
					var path = $($('#atticlecount').find('img')[k]).attr('src');
					$($('#atticlecount').find('img')[k]).css('max-width', '101%');
					$($('#atticlecount').find('img')[k]).css('margin-right', '5px');

					$($('#atticlecount').find('img')[k]).attr('src', bms + path);
					path = $($('#atticlecount').find('img')[k]).attr('src');
//					$($('#atticlecount').find('img')[k]).bind('click', function() {
//						openImage(path);
//					});
				}

			}
			
			$.each($('#atticlecount').find('img'), function(i, v) {
				$(v).bind('click', function() {
					openImage($(v).attr('src'));
				});
			});
		}

	}
	var total=$('.all p').eq(0).text();
	$('.all p').eq(0).text("综述："+total);
	$('.vip').hide();
//	$('#adver').attr('src',vedioshow);
//	$('#adver').bind('click',function(){
//		app.pushToWebView(origin, 1);
//	});
	
	
	if("" == vedioshow || undefined == vedioshow || 'undefined' == vedioshow || "" == origin || undefined == origin || 'undefined' == origin) {
		$('#adver').hide();
	} else {
		$('#adver').show();
		$('#adver').attr('src', vedioshow);
		$('#adver').bind('click', function() {
			//		alert(origin);
			app.pushToWebView(origin, 1);
		});
	}

	var aarray = $('#atticlecount p').find('a');
	for(var l = 0; l < aarray.length; l++) {
		var avalues = $($('#atticlecount p').find('a')[l]).attr('id');
		console.info(avalues);

		if('' != avalues || undefined != avalues || 'undefined' != avalues) {

			var avaluesnum = avalues.split("//");
			if('teacher' == avaluesnum[0]) {
				var teacherId = avaluesnum[1];
				$($('#atticlecount p').find('a')[l]).attr('href', '#');
				$($('#atticlecount p').find('a')[l]).bind('click', function() {

					teacherCenter(teacherId);
				});
			} else if('article' == avaluesnum[0]) {
				var articleId = avaluesnum[1];
				$($('#atticlecount p').find('a')[l]).attr('href', '#');
				$($('#atticlecount p').find('a')[l]).bind('click', function() {
					//					alert(avaluesnum[1]);
					articleDetail(articleId);
				});
			} else if('matchList' == avaluesnum[0]) {
				var matchs = avaluesnum[1];
				$($('#atticlecount p').find('a')[l]).attr('href', '#');
				$($('#atticlecount p').find('a')[l]).bind('click', function() {
					matchLists(matchs);
				});
			} else if('articleList' == avaluesnum[0]) {
				var articleListurl = $($('#atticlecount p').find('a')[l]).attr('href');
				$($('#atticlecount p').find('a')[l]).attr('href', '#');
				$($('#atticlecount p').find('a')[l]).bind('click', function() {

					articleList(articleListurl);
				});

			}
		}
	}
	
}

function openImage(param) {
	//	alert(param);
	app.openImage(param);
}
//刷新方法
function refreshData() {
	getData();
}

function isLogin() {
	if('' == getUserId() || '' == getSecurityCode() || undefined == getUserId() || undefined == getSecurityCode() || 'undefined' == getUserId() || 'undefined' == getSecurityCode()) {
		return false;
	} else {
		return true;
	}
}

function showFollow(type) {
	if(isFollowed) {
		$('#is_follow').removeClass('follow_on');
		$('#is_follow').text('已关注');
		if(2 == type) {
			showMeaage('关注成功');

		}

	} else {
		if(!$('#is_follow').hasClass('follow_on')) {
			$('#is_follow').addClass('follow_on');
			$('#is_follow').text('加关注');
			if(2 == type) {
				showMeaage('取消成功');

			}

		}
	}
}

function showMeaage(msg) {
	layer.open({
		content: msg,
		time: 2,
		skin: 'msg',
		anim: 'scale'
	});

}
//点赞成功回掉
function addGreat() {
	//	alert(munpeople);
	if($('#cheerupnum').hasClass('span')) {
		var munpeople = parseInt($('#cheerup_num').text()) + 1;
		$('#cheerup_num').text(munpeople);
		$('#cheerup_num').addClass('gray');
		$('#cheerupnum').removeClass('span');
	} else {
		showMeaage('已点赞');
	}
}

function addCollectionFinsh() {
	if($('#collection').find('span').hasClass('span')) {
		articleCollected = !articleCollected;
		$('#collection').find('span').removeClass('span');
	}
}

function cancelCollectionFinsh() {
	if(!$('#collection').find('span').hasClass('span')) {
		articleCollected = !articleCollected;
		$('#collection').find('span').addClass('span');
	}
}

$('#authod_pic').click(function() {
	app.openAuthor(authorId);
	return false;
});
//跳转到老师个人中心页面
function teacherCenter(authorId) {
	//	alert(authorId);
	app.openAuthor(authorId);
}
//跳转到赛事详情
function matchLists(matchId) {
	var po_url = 'http://www.jingcaishuo.com/mandarin_h5_html/matchs_detail_mandarin/?EntryId=' + matchId;
	//	console.info(po_url);
	app.pushToWebView(po_url, 0);
}

//跳转到文章详情

function articleDetail(articleId) {
	//	alert(articleId);
	app.openArticle(articleId);
}

//跳转文章列表

function articleList(po_url) {
	app.pushToWebView(po_url, 1);
}


//跳转
function OpenNativeBuy(id) {
	if(!isLogin()) {
		app.toastLogIn();
	} else {
		app.pushToPayment(id, authorId);
	}

}
//免责声明和风险提示
$('#wanring').click(function() {
	app.pushToResponsibility();
	return false;
});
//关注
$('#is_follow').click(function() {
	if(!isLogin()) {
		app.toastLogIn();
	} else {
		if(!isFollowed) { //关注
			follow('add');
		} else { //未关注
			follow('cancel');
		}
	}
	return false;
});

//点赞
$('#cheerup').click(function() {
	//	alert(1111);
	app.pushToCheer(articleId);
	//	if(!isLogin()) {
	//		app.pushLoginView();
	//	} else {
	//
	//		app.pushToCheer(articleId);
	//	}
});

//收藏
$('#collection').click(function() {
	//	alert(articleCollected);
	app.pushToCollection(articleId, articleCollected);
	//	if(!isLogin()) {
	//		app.pushLoginView();
	//	} else {
	//		
	//	}
});

//发私信
$('#message').click(function() {
	if(!isLogin()) {
		app.toastLogIn();
	} else {
		if(isFollowed) {
			app.pushToMessage(authorId);
		} else {
			showMeaage('请关注')
		}

	}

});

//分享
$('#share').click(function() {
	app.pushToShare(authorName, digest, sign_key, authorPic);
});

function follow(flag) {
	//	layer.open({
	//		type: 2
	//	});
	$.ajax({
		url: host + "follow/" + flag,
		type: 'GET',
		dataType: "jsonp",
		jsonp: "callback", // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback: "cookieHandler", // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		async: true,
		data: {
			language: 'M',
			analystId: authorId,
			userId: getUserId(),
			securityCode: getSecurityCode()
		},
		success: function(e) {
			isFollowed = !isFollowed;
			showFollow(2);
			//			console.info(JSON.stringify(e));
			//			layer.closeAll();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//			alert(errorThrown);
			//			layer.closeAll();
		}
	});
}

//获取url参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return 0;
}

//function dateFormat(date, pattern) {
//	var o = {
//		"M+": date.getMonth() + 1,
//		"d+": date.getDate(),
//		"h+": date.getHours(),
//		"m+": date.getMinutes(),
//		"s+": date.getSeconds(),
//		"q+": Math.floor((date.getMonth() + 3) / 3),
//		"S": date.getMilliseconds()
//	}
//	if(/(y+)/.test(pattern)) {
//		pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
//	}
//	for(var k in o) {
//		if(new RegExp("(" + k + ")").test(pattern)) {
//			pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
//		}
//	}
//	return pattern;
//}
//
//function fmtMydate(datestr) {
//	
//	var dd = new Date();
//	var todaystr = dateFormat(GetDate(new Date(), 0), "yyyy-MM-dd");
//	var yesterdaystr = dateFormat(GetDate(new Date(), -1), "yyyy-MM-dd");
//	var beforeyesterdaystr = dateFormat(GetDate(new Date(), -2), "yyyy-MM-dd");
//	var ts = strToTimestamp(datestr);
//	var ts_date = new Date(ts);
//	var targetdate = dateFormat(ts_date, "yyyy-MM-dd");
//
//	if(todaystr == targetdate) {
//		return '今天 ' + dateFormat(ts_date, "hh:mm");
//	} else if(yesterdaystr == targetdate) {
//		return '昨天 ' + dateFormat(ts_date, "hh:mm");
//		//      }else if( beforeyesterdaystr == targetdate){
//		//          return '前天 '+dateFormat(ts_date,"hh:mm");
//	} else {
//		return dateFormat(ts_date, "MM-dd hh:mm");
//	};
//
//}
//
//function GetDate(date, AddDayCount) {
//	var dd = date;
//	dd.setDate(dd.getDate() + AddDayCount);
//	return dd;
//}
//
//function strToTimestamp(stringTime) {
////	stringTime = stringTime.replace(/-/g, "/");
////	return Date.parse(new Date(stringTime));
//  return moment(stringTime);
//}
//function hintposition(){
//	var ph = $(document).height(),
//		hdh = $('.hd').height(),
//		freeh = $('.free_txt').outerHeight(),
//		ch = $('.com_wrap').outerHeight();
//		console.log(ph-hdh-freeh-ch-80);
//		console.log(ph+':'+hdh+':'+freeh+':'+ch)
//		if(ph-hdh-freeh-ch-80<10){
//			$('.hint').css({'position':'inherit','padding-bottom':'0.4rem'})
//		}else{
//			$('.hint').css({'position':'fixed','padding-bottom':'0'})
//		}
//}
function hintposition(){
 var ph = $(window).height(),
  hdh = $('.hd').height(),
  freeh = $('.free_txt').outerHeight(),
  lockh = $('.p_com').outerHeight(),
  ch = $('.com_wrap').outerHeight();
  console.log(ph-hdh-freeh-ch-lockh-120);
  console.log(ph+':'+hdh+':'+freeh+':'+ch+':'+lockh)
  if(ph-hdh-freeh-ch-lockh-120<10){
   $('.hint').css({'position':'inherit','padding-bottom':'0.4rem'})
  }else{
   $('.hint').css({'position':'fixed','padding-bottom':'0'})
  }
}