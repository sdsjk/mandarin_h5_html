// (function($) {
var startTime = "";
var isball = "0";
// 篮球是1足球是0
var cur_year = "";
var shaixuan = [];
var isanalyze = false;
var sxCount = {};
var teamName = [];
var refreshDate = '';

var cacheDate = {};

var fadeData = {};
var object = [];
var shaixuanflag = '';
var shaixuanCount = 0;
var li = $('.label').find('li');
$('.search').on(
		'click',
		function() {
			count = 0;
			shaixuan = [];
			
			if (isball == "1") {
				$('#ballname').text('篮球赛事筛选');
			} else if (isball == "0") {
				$('#ballname').text('足球赛事筛选');
			}
			if (shaixuanflag != null && shaixuanflag != 'undefined'
					&& shaixuanflag != '') {
				$('.label').html(shaixuanflag);
				getNum();
			} else {
				showSXData();
			}
			$('.choose').show(
					function() {
						$('.foot').css({
							'position' : 'fixed',
							'bottom' : '0'
						});
					});
			$('.container').hide();

		});

function getNum() {
	shaixuanCount = 0;
	$('.label').find('li').each(
			function(i, v) {
				if ($(v).hasClass('on')) {
					shaixuanCount += parseInt($(v).text().substring(
							$(v).text().indexOf("(") + 1,
							$(v).text().indexOf(")")));
				}

			});

	$('.num-chos').html(shaixuanCount);
	intger = shaixuanCount;
}
/**
 * 有分析
 */
$("#analyze").click(
		function() {
			shaixuanflag = '';
			shaixuanCount = 0;
			layer.open({
				type : 2
			});
			if (cacheDate.hasOwnProperty(startTime + "-" + isball)) {
				var data = cacheDate[startTime + "-" + isball].data.matchList;
				var html = '';
				$.each(data, function(i, v) {

					if (isanalyze) {
						html += '<div class="list" id=' + v.lotteryMatchId
								+ ' onclick="OpenNative(' + v.lotteryMatchId
								+ ');" style="display: '
								+ isShowHide(v.articleCount) + ';">'
								+ '<div class="left" style="color: '
								+ showLeftClass(v.articleCount) + ';">'
								+ '<p class="top" id="count">' + v.articleCount
								+ '</p>' + '<p class="bottom">精彩说</p></div>'
								+ '<div class="right">' + '<p class="top">'
								+ '<span class="saishi">' + v.cupName
								+ '</span>' + '<span class="week">' + v.matchId
								+ '</span>' + showState(v.isRollball)
								+ '<span class="time">'
								+ formatDate(v.startTime) + '</span>' + '</p>'
								+ '<p class="bottom">'
								+ '<span class="hometeam">' + v.homeTeam
								+ '</span>' + '<i class="vs">vs</i>'
								+ '<span class="v-team">' + v.awayTeam
								+ '</span>' + '</p>' + '</div>'
								+ '<div class="goin">'
								+ '<span class="triangle"></span>' + '</div>'
								+ '</div>';

					} else {
						html += '<div class="list" id=' + v.lotteryMatchId
								+ ' onclick="OpenNative(' + v.lotteryMatchId
								+ ');">' + '<div class="left" style="color: '
								+ showLeftClass(v.articleCount) + ';">'
								+ '<p class="top" id="count">' + v.articleCount
								+ '</p>' + '<p class="bottom">精彩说</p></div>'
								+ '<div class="right">' + '<p class="top">'
								+ '<span class="saishi">' + v.cupName
								+ '</span>' + '<span class="week">' + v.matchId
								+ '</span>' + showState(v.isRollball)
								+ '<span class="time">'
								+ formatDate(v.startTime) + '</span>' + '</p>'
								+ '<p class="bottom">'
								+ '<span class="hometeam">' + v.homeTeam
								+ '</span>' + '<i class="vs">vs</i>'
								+ '<span class="v-team">' + v.awayTeam
								+ '</span>' + '</p>' + '</div>'
								+ '<div class="goin">'
								+ '<span class="triangle"></span>' + '</div>'
								+ '</div>';

					}

				});

				$('.wrapinner').html(html);

			}

			if (isanalyze) {
				$("#analyze").find('.j').addClass('f_on');
				$("#analyze").find('.q').removeClass('f_on');
			} else {
				$("#analyze").find('.q').addClass('f_on');
				$("#analyze").find('.j').removeClass('f_on');
			}
			// console.log(isanalyze)
			set_rw();
			isanalyze = !isanalyze;
			setTimeout(function() {
				layer.closeAll();
			}, 250);
			// layer.closeAll();
		});

/**
 * 点击确定筛选
 */
$('#sure')
		.click(
				function() {

					layer.open({
						type : 2
					});
					shaixuanCount += intger;
					intger = 0;
					teamName = [];

					$('.num-chos').html("0");
					if ($('.label').find('li').length == $('.label')
							.find('.on').length) {
						// $('.wrap').html(str);
						var count1 = 0;
						$('.label').find('li').each(
								function(i, v) {
									if ($(v).hasClass('on')) {
										teamName[count1] = $(v).text()
												.substr(
														0,
														$(v).text()
																.lastIndexOf(
																		"("));
										count1++;
									}
								});

						// set_rw();
					} else {
						var count1 = 0;
						$('.label').find('li').each(
								function(i, v) {
									if ($(v).hasClass('on')) {
										teamName[count1] = $(v).text()
												.substr(
														0,
														$(v).text()
																.lastIndexOf(
																		"("));
										count1++;
									}
								});

						// set_rw();

					}
					setTimeout(function() {
						showTeam();
						layer.closeAll();
					}, 250);
					$('.choose').hide();
					$('.container').show();
					shaixuanflag = $('.label').html();
				});

/**
 * 显示筛选后的数据
 */
var afterData = [];
function showTeam() {
	afterData = [];
	// $('.wrap').html(str);
	// alert(teamName);
	for ( var j = 0; j < teamName.length; j++) {
		// alert(fadeData[teamName[j]]);
		var len = fadeData[teamName[j]].length;
		// alert(len);
		for ( var k = 0; k < len; k++) {

			if (!isanalyze) {
				if (fadeData[teamName[j]][k]['articleCount'] > 0) {
					afterData[afterData.length] = fadeData[teamName[j]][k];
				}
			} else {
				// 全部
				afterData[afterData.length] = fadeData[teamName[j]][k];
			}
		}
	}
	var html = '';
	for ( var l = 0; l < afterData.length; l++) {
		var v = afterData[l];
		html += '<div class="list" id=' + v.lotteryMatchId
				+ ' onclick="OpenNative(' + v.lotteryMatchId + ');" >'
				+ '<div class="left"  style="color: '
				+ showLeftClass(v.articleCount) + ';">'
				+ '<p class="top" id="count">' + v.articleCount + '</p>'
				+ '<p class="bottom">精彩说</p></div>' + '<div class="right">'
				+ '<p class="top">' + '<span class="saishi">' + v.cupName
				+ '</span>' + '<span class="week">' + v.matchId + '</span>'
				+ showState(v.isRollball) + '<span class="time">'
				+ formatDate(v.startTime) + '</span>' + '</p>'
				+ '<p class="bottom">' + '<span class="hometeam">' + v.homeTeam
				+ '</span>' + '<i class="vs">vs</i>' + '<span class="v-team">'
				+ v.awayTeam + '</span>' + '</p>' + '</div>'
				+ '<div class="goin">' + '<span class="triangle"></span>'
				+ '</div>' + '</div>';

	}

	$('.wrapinner').html(html);
	set_rw();
}

/**
 * 显示筛选条件
 */
var intger = 0;
var toal = 1;
function showSXData() {
	var str1 = '';
	for ( var key in fadeData) {
		if (!isanalyze) {
			itemCount = 0;
			for ( var i = 0; i < fadeData[key].length; i++) {

				if (fadeData[key][i].articleCount > 0) {
					itemCount++;
				}

				if (i == (fadeData[key].length - 1)) {

					if (itemCount != 0) {
						str1 += '<li class="on">' + key + '(' + itemCount + ')'
								+ '</li>';
						intger += parseInt(itemCount);
						itemCount = 0;
					}
				}

			}
		}

		if (isanalyze) {

			str1 += '<li class="on">' + key + '(' + fadeData[key].length + ')'
					+ '</li>';
			intger += parseInt(fadeData[key].length);
		}

	}
	$('.label').html(str1);

	setNum();
	$('.all-chos').addClass('chos-on');
	toal = intger;
}

/**
 * 退出筛选
 */
$('.back').on('click', function() {
	intger = 0;
	$('.choose').hide();
	$('.container').show();
	set_rw();
});

/**
 * 全选按钮操作
 */
$('.all-chos').on('click', function() {
	$(this).toggleClass('chos-on');
	if ($('.all-chos').hasClass('chos-on')) {
		$('.label').find('li').each(function(i, v) {
			$(v).addClass('on');
			$('.num-chos').html(toal);
			intger = toal;
		});
	} else {
		$('.label').find('li').each(function(i, v) {
			$(v).removeClass('on');
			$('.num-chos').html("0");
			intger = 0;
		});
	}

});

/**
 * 点击每条筛选条件
 */
$('.label')
		.on(
				'click',
				'li',
				function() {
					$(this).toggleClass('on');
					if ($('.label').find('li').length > $('.label').find('.on').length) {
						$('.all-chos').removeClass('chos-on');
					} else if ($('.label').find('li').length == $('.label')
							.find('.on').length) {
						$('.all-chos').addClass('chos-on');
					}
					if ($(this).hasClass('on')) {
						intger += parseInt($(this).text().substring(
								$(this).text().indexOf("(") + 1,
								$(this).text().indexOf(")")));
					} else {
						intger -= parseInt($(this).text().substring(
								$(this).text().indexOf("(") + 1,
								$(this).text().indexOf(")")));
					}

					setNum();
				});
// 设置标签帅选条数
setNum();
function setNum() {

	$('.num-chos').html(intger);
}

/**
 * 初始话进度条
 */
function initNative() {

	var tab_li = $('.tab').find("ul>li"), r_w = tab_li.width(), r_h = tab_li
			.outerHeight();
	$('.remo').width(r_w).height(r_h).css({
		'width' : r_w,
		'height' : r_h,
		'left' : $('.on').offset().left
	});
}

function init() {
	initNative();
	setTime();
	// 边框动画
	$('.wrap').slideMove({
		moveBox : $('.remo')
	});

	$('.tab').on("click", "li", function() {

		$(this).addClass('on').siblings('li').removeClass('on');
		$('.remo').css({
			'left' : $(this).offset().left
		});
		set_remo();
		set_rw();
	});

}
function getLocalTime(nS) {
	console.log(new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' '))
	return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
function getDayMethod(){
	var hours=new Date().getHours();
	var min=new Date().getMinutes();
	if(hours>=0&&hours<11){
		return new Date().getDate()-1;
	}else if(hours==11){
		if(min>=30){
			return new Date().getDate();
		}else  {
			return new Date().getDate()-1;
		}
	}else{
		return new Date().getDate();
	}
}
/*function getTimeHours(time) {
	var apm = time.substring(time.lastIndexOf('午') - 1,
			time.lastIndexOf('午') + 1);
		time = time.substring(time.lastIndexOf('午') + 1);
		time = time.split(":");
	var hours = parseInt(time[0]);
	var min = parseInt(time[1]);
	if(apm=='上午'){
		if (hours == 11 ) {
			if (min >= 30) {
				return new Date().getDate();
			}else{
				return new Date().getDate() - 1;
			}
		}else if(hours<11){
			return new Date().getDate() - 1;
		}else if(hours>11 && hours<12){
			return new Date().getDate();
		}else if(hours == 12){
			return new Date().getDate()-1;
		}
	}else{
		return new Date().getDate();
	}
	
}*/
// 设置li日期
function setTime() {
	var TimeLong = getLocalTime(new Date().getTime());
	var li = $('.tab').find('li'), cur_year = new Date().getFullYear();
	cur_mon = new Date().getMonth() + 1;
	cur_day = getDayMethod()

	yesterday = cur_day - 1;
	tomorrow = cur_day + 1;
	/*if (cur_day <= 9) {
		cur_day = '0' + cur_day;
	}
	if (cur_day <= 9) {
		yesterday = '0' + yesterday;
	}
	if (tomorrow <= 9) {
		tomorrow = '0' + tomorrow;
	}*/
	function GetDateStr(AddDayCount) { 
		var dd = new Date(); 
		dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
		var y = dd.getFullYear(); 
		var m = dd.getMonth()+1;//获取当前月份的日期 
		var d = dd.getDate();
			if(m<=9){
				m= '0'+m;
			} 
			if(d<=9){
				d = '0'+d;
			}
		return m+'月'+d+'日'; 
	} 
	if(cur_mon==1 && cur_day==1){
		alert(999)
		getData(2016 + '-' + cur_mon + '-' + cur_day);
	}else{
		getData(cur_year + '-' + cur_mon + '-' + cur_day);
	}
	//getData(cur_year + '-' + cur_mon + '-' + cur_day);
	startTime = cur_year + '-' + cur_mon + '-' + cur_day;

	$(li[0]).text(GetDateStr(-1));
	$(li[1]).text(GetDateStr(0));

	/*if(cur_day == 31 && cur_mon == 1 || cur_mon == 3 || cur_mon == 5 || cur_mon == 7 || cur_mon == 8 || cur_mon == 10 || cur_mon == 12){
		cur_mon='0' + 1;
		tomorrow=1;
		if (tomorrow <= 9) {
			tomorrow = '0' + tomorrow;
		}
	}*/

	$(li[2]).text(GetDateStr(+1));
}

function formatDate(str) {
	str = str.replace(/[\u4E00-\u9FFF]/, "-");
	return str.replace(/[\u4E00-\u9FFF]/, "");
}

function getCachedOrNet(time) {

	refreshDate = time;
	if (cacheDate.hasOwnProperty(time + "-" + isball)) {
		// alert(time+"-"+isball);
		var data3 = new Date().getTime() - cacheDate[time + "-" + isball].time;
		if ((data3 / 1000) < 40) {
			render(cacheDate[time + "-" + isball].data, time);

		} else {
			getData(time);
		}
	} else {
		getData(time);
	}
	setTimeout(function() {
		layer.closeAll();
	}, 250);

}

/**
 * 请求数据
 */
var callbackdata = {};
function getData(date) {
	layer.open({
		type : 2
	});
	$("#analyze").find('.j').addClass('f_on');
	$("#analyze").find('.q').removeClass('f_on');
	isanalyze = false;
	refreshDate = date;
	$.ajax({
		url : "http://www.jingcaishuo.com/match/list",
		type : 'GET',
		data : {
			language : "m",
			sportType : isball,
			startTime : date
		},
		dataType : "jsonp",
		jsonp : "callback", // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		jsonpCallback : "cookieHandler", // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
		async : true,
		success : function(e) {
			console.log(e)
			layer.closeAll();
			if (e.code == "0000") {

				render(e, date);
				cacheDataMethod(e, date);
			}

		},
		error : function(jqXHR, textStatus, errorThrown) {
			layer.closeAll();
		}
	});
}

/**
 * 缓存数据
 */
function cacheDataMethod(e, time) {
	cacheDate[time + '-' + isball] = {
		time : new Date().getTime(),
		data : e
	};

}

var str = '';

/**
 * 画列表
 */

function render(data, date) {
	object = [];
	fadeData = {};
	shaixuan = [];
	str = "";
	var saishi = "";
	$.each(data.matchList, function(i, v) {
		startDate = v.startTime.split(" ")[0];
		// console.info(startDate + "----" + date);
		if (startDate != date) {
			str += '<div class="list" id=' + v.lotteryMatchId
					+ ' onclick="OpenNative(' + v.lotteryMatchId
					+ ');" style="display: ' + isShowHide(v.articleCount)
					+ ';">' + '<div class="left" style="color: '
					+ showLeftClass(v.articleCount) + ';">'
					+ '<p class="top" id="count">' + v.articleCount + '</p>'
					+ '<p class="bottom">精彩说</p></div>' + '<div class="right">'
					+ '<p class="top">' + '<span class="saishi">' + v.cupName
					+ '</span>' + '<span class="week">' + v.matchId + '</span>'
					+ '<span class="time">'
					+ formatDate(v.startTime) + '</span>'+ showState(v.isRollball) + '</p>'
					+ '<p class="bottom">' + '<span class="hometeam">'
					+ v.homeTeam + '</span>' + '<i class="vs">vs</i>'
					+ '<span class="v-team">' + v.awayTeam + '</span>' + '</p>'
					+ '</div>' + '<div class="goin">'
					+ '<span class="triangle"></span>' + '</div>' + '</div>';

			saishi = v.cupName;
			// shaixuan[i] = saishi;
			object = [ v ];
			if (fadeData.hasOwnProperty(saishi)) {
				object = fadeData[saishi];
				fadeData[saishi] = object.concat(v);
				// console.info("==========="+JSON.stringify(object.concat(v)));
			} else {
				fadeData[saishi] = object;
			}

		}

	});
	// alert(JSON.stringify(fadeData));
	$('.wrapinner').html(str);

	set_rw();
	// getCountNum();
}

function getCountNum() {
	sxCount = {};

	for ( var i = 0; i < shaixuan.length; i++) {
		var count = 1;
		if (sxCount.hasOwnProperty(shaixuan[i])) {
			count = sxCount[shaixuan[i]];
			count++;
		}
		sxCount[shaixuan[i]] = count;
	}
}

function isShowHide(count) {
	if (count == "0") {
		return 'none';
	} else {
		return 'block';
	}
}

function showLeftClass(count) {
	if (count == "0") {
		return '#999999';
	} else {
		return '#ffdf1b';
	}
}
function set_remo() {
	layer.open({
		type : 2
	});
	var tab_li = $('.tab').find("ul>li"), r_w = tab_li.width(), r_h = tab_li
			.outerHeight();
	$('.remo').width(r_w).height(r_h).css({
		'width' : r_w,
		'height' : r_h,
		'left' : $('.on').offset().left
	});
	cur_year = new Date().getFullYear();
	var dat = cur_year + '-'
			+ $('.tab').find('.on').text().replace("月", "-").replace("日", "");
	startTime = dat;
	$("#analyze").find('.j').addClass('f_on');
	$("#analyze").find('.q').removeClass('f_on');
	isanalyze = false;
	shaixuanflag = '';
	shaixuanCount = 0;
	// getData(dat);
	getCachedOrNet(startTime);
	set_rw();
};

init();

/**
 * 显示是否滚球
 */
function showState(bolean) {
	if (bolean > 0) {
		return '<i class="state">滚球中</i>';
	} else {
		return '';
	}

};

/**
 * 显示具体的星期
 */
function getWeek(week) {
	if (week == "1") {
		return "周一";
	} else if (week == "2") {
		return "周二";
	} else if (week = "3") {
		return "周三";
	} else if (week = "4") {
		return "周四";
	} else if (week = "5") {
		return "周五";
	} else if (week = "6") {
		return "周六";
	} else if (week = "7") {
		return "周日";
	}

}

/**
 * 选择篮球
 */
$('#basketball').click(function() {
	layer.open({
		type : 2
	});
	$("#analyze").find('.j').addClass('f_on');
	$("#analyze").find('.q').removeClass('f_on');
	isanalyze = false;
	shaixuanflag = '';
	shaixuanCount = 0;
	$(this).addClass('h-on');
	$('#football').removeClass('h-on');
	isball = "1";
	getCachedOrNet(startTime);
	set_rw();

});

/**
 * 选择足球
 */
$('#football').click(function() {
	layer.open({
		type : 2
	});
	$("#analyze").find('.j').addClass('f_on');
	$("#analyze").find('.q').removeClass('f_on');
	isanalyze = false;
	shaixuanflag = '';
	shaixuanCount = 0;
	$(this).addClass('h-on');
	$('#basketball').removeClass('h-on');
	isball = "0";
	getCachedOrNet(startTime);
	set_rw();
});


/**
 * 调用原生app方法
 * 
 */

function OpenNative(name) {
	window.app.openMatch(name, startTime);
}

function set_rw() {
	$('.right').width(
			$('.wrap').width() - $('.left').width() - $('.goin').width() - 30);
}