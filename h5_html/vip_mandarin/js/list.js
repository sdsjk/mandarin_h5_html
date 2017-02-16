


var j_loading = new Loading();
function action() {
    this.uid = 0;
    this.type = 0;  //0下拉刷新   1上拉分页
    this.domin = 'http://www.jingcaishuo.com/';
    this.articleid;
    this.index = 0;
    this.start_articleid = 0;  //开始文章id
    
    //下拉刷新
    this.down = function(){
    		this.start_articleid = 0;
	    	this.type = 0;
	    	this.init();
    }
    
    //上拉分页
    this.up = function(){
	    	this.type = 1;
	    	this.init();
    }



    this.clickCheck = function(articleid) {
            this.go_article();
    }

    //跳转详情页方法
    this.go_article = function() {
        jump(1, this.articleid);
    }

	//获取token
	this.getUserToken = function() {
	//		return param;
		return $.parseJSON(app.checkTheLoginState());
	}
	
	this.getUserId = function () {
		return this.getUserToken().UserId;
	}
	
	this.getSecurityCode = function () {
		return this.getUserToken().SecurityCode;
	}
	this.isLogin = function () {
		if(this.getUserId() != '' && this.getSecurityCode() != '') {
			return true;
		} else {
			return false;
		}
	}

    this.alertmsg = function(msg) {
        layer.open({
            content: msg,
            time: 2,
            skin: 'msg',
            anim: 'scale'
        });
        return false;
    }
    this.loading = function() {
//      layer.open({
//          type: 2
////          content: '加载中'
//      });
j_loading.openL();
    }

    //取url参数
    this.GetQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    this.List = function(data) {

        var s = this;
        var list_html = '';
        if(data.length == 0){
        	 s.alertmsg('没有更多数据');
        	 return false;
        }
        for (var i = 0; i < data.length; i++) {
            list_html += '<div class="listcon">';
            if(data[i].matches.length == 0){
                list_html += '<div class="txtbox" style="padding: 8px 3% 10px 3%;">';
            }else{
                list_html += '<div class="txtbox">';
            } 
            list_html += '<dl>';
            list_html += '<dt><img onclick="goauthor(' + data[i].author_id + ')" author_id="' + data[i].author_id + '" src="' + data[i].authorPic + '"></dt>';
			list_html += '<dd class="h38" onclick="goarticle(' + data[i].id + ')">';
			list_html += '<span class="name">' + data[i].authorName + '</span><span class="tm">' + fmtMydate(data[i].last_modified) + '</span>';
			list_html += '</dd>';
			list_html += '</dl>';
			
			list_html += '<span class="txt" onclick="goarticle(' + data[i].id + ')">';
			    if(data[i].chargeable == true){
	                list_html += '<i class="vip">VIP</i>';
	            }
	        
	            if(data[i].portal_list != undefined){
			      if (data[i].portal_list.length > 0) {
	                    list_html += '<i>' + data[i].portal_list[0].name + '</i>';
			       }
				}
			    list_html += data[i].digest;
			list_html += '</span>';
			
			
			list_html += '</div>';
			
			if(data[i].matches != undefined){
						if(data[i].matches.length > 0){
							list_html += '<div class="titbox" onclick="gomatch('+data[i].matches[0].entry_id+')">';
							list_html += '<span>'+data[i].matches[0].cup_name+'</span><span>'+data[i].matches[0].home_team+' vs '+data[i].matches[0].away_team+'</span><span>' + fmtMydate(data[i].matches[0].start_time) + '</span>';
							list_html += '</div>';
						}
			}
	        list_html += '</div>';
	    
            if(i == data.length - 1){
            	  s.start_articleid = data[i].id;
//          	  alert(s.start_articleid);
            }
        }
        if(s.type == 0){
        	$("#div_article").html(list_html);
        } else {
        	$("#div_article").append(list_html);
        }
        

        if (list_html.length == 0) {
            s.alertmsg('暂无数据');
        }

//      $(".goarticle").click(function() {
//          var articleid = $(this).attr("id");
//          app.openArticle(articleid);
//          return false;
//      })
//      $(".goauthor").click(function(){
//      	var author_id = $(this).attr("author_id");
//          app.openAuthor(author_id); 
//          return false;
//      })
//      $(".gomatch").click(function(){
//      	var m_id = $(this).attr("m_id");
//      	var m_url = 'http://www.jingcaishuo.com/h5_html/matchs_detail_cantonese/?EntryId='+m_id;
//          app.pushToWebView(m_url, 0) ;
////      	alert(m_id);
//      })
    }

    //页面初始化
    this.init = function() {
    	
        var uid = this.GetQueryString('userid');
        var t = this;
        t.uid = uid;
        
//      alert(t.start_articleid);
        var url = t.domin + '/article/list/vip?time=' + Math.random();
//      t.loading();
        $.ajax({
            url: url,
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: "cookieHandler",
            //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            async: true,
            data: {
            	language: 'M',
                userId: t.getUserId(),
//              token: this.getSecurityCode(),
				articleId: t.start_articleid
		    },
            success: function(data) {
//              layer.closeAll();
j_loading.closeL();
                if (data.Code == 0000) {
                	if(t.type == 0){
	                	var c = '{"code":0,"msg":"刷新完成"}';
				        app.BTNVPullRefresh2DownCallBack(c);
	                } else {
	                	var c = '{"code":0,"msg":"刷新完成"}';
				        app.BTNVPullRefresh2UPCallBack(c);
	                }
                    t.List(data.Articles);
                } else {
                    t.alertmsg(data.msg);
                }

            },
            error: function() {
                alert("网络或系统异常，请稍后重试")
            }
        });

        //        this.List();
    }

}

var demo = new action();
demo.loading();
//demo.down();


function readplay(){
	demo.down();
}
readplay();

var index = 0;
function BTJSPullRefresh2UP(){
//	alert(index);
	if(getDeviceinfo().type == "android"){
		if(index > 0){
			demo.up();
			
		}
	} else {
		demo.up();
	}
}
function BTJSPullRefresh2Down(){
//	alert(index);
	if(getDeviceinfo().type == "android"){
		if(index > 0){
			demo.down();
		}
	} else {
		demo.down();
	}
	
	index ++;
}




function goarticle(articleid){
    app.openArticle(articleid);
}
function goauthor(id){
	app.openAuthor(id); 
}
function gomatch(id){
//	alert(212);
	var m_url = 'http://www.jingcaishuo.com/mandarin_h5_html/matchs_detail_mandarin/?EntryId='+id;
    app.pushToWebView(m_url, 0) ;
}

//function GetDate(date, AddDayCount) {
//  var dd = date;
//  dd.setDate(dd.getDate() + AddDayCount);
//  return dd;
//}
//function strToTimestamp(stringTime) {
//  stringTime = stringTime.replace(/-/g, "/");
//  return Date.parse(new Date(stringTime));
//}
//function fmtMydate(datestr) {
//	var datestr = datestr.split('.')[0];
//  var dd = new Date();
//  var todaystr = dateFormat(GetDate(new Date(), 0), "yyyy-MM-dd");
//  var yesterdaystr = dateFormat(GetDate(new Date(), -1), "yyyy-MM-dd");
//  var beforeyesterdaystr = dateFormat(GetDate(new Date(), -2), "yyyy-MM-dd");
//  var ts = strToTimestamp(datestr);
//  var ts_date = new Date(ts);
//  var targetdate = dateFormat(ts_date, "yyyy-MM-dd");
//
//  if (todaystr == targetdate) {
//      return '今天 ' + dateFormat(ts_date, "hh:mm");
//  } else if (yesterdaystr == targetdate) {
//      return '昨天 ' + dateFormat(ts_date, "hh:mm");
//      //      }else if( beforeyesterdaystr == targetdate){
//      //          return '前天 '+dateFormat(ts_date,"hh:mm");
//  } else {
//      return dateFormat(ts_date, "MM-dd hh:mm");
//  };
//
//}
//
//function dateFormat(date, pattern) {
//  var o = {
//      "M+": date.getMonth() + 1,
//      "d+": date.getDate(),
//      "h+": date.getHours(),
//      "m+": date.getMinutes(),
//      "s+": date.getSeconds(),
//      "q+": Math.floor((date.getMonth() + 3) / 3),
//      "S": date.getMilliseconds()
//  }
//  if (/(y+)/.test(pattern)) {
//      pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
//  }
//  for (var k in o) {
//      if (new RegExp("(" + k + ")").test(pattern)) {
//          pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
//      }
//  }
//  return pattern;
//}

function getDeviceinfo() {
	var device_type = 'other';
	var system_version = null;
	var app = null;
	var ua= navigator.userAgent.toLowerCase();
	if(ua.match(/iphone/i)=="iphone" || ua.match(/ipad/i)=="ipad"){
		device_type = 'ios';

		system_version = 10;
		
		if(ua.match(/iPhone OS 4/i)=="iPhone OS 4"){
			system_version = 4;
		}else if(ua.match(/iPhone OS 5/i)=="iPhone OS 5" || ua.match(/ipad; cpu os 5/i)=="ipad; cpu os 5"){
			system_version = 5;
		}else if(ua.match(/iPhone OS 6/i)=="iPhone OS 6" || ua.match(/ipad; cpu os 6/i)=="ipad; cpu os 6"){
			system_version = 6;
		}else if(ua.match(/iPhone OS 7/i)=="iPhone OS 7" || ua.match(/ipad; cpu os 7/i)=="ipad; cpu os 7"){
			system_version = 7;
		}else if(ua.match(/iPhone OS 8/i)=="iPhone OS 8" || ua.match(/ipad; cpu os 8/i)=="ipad; cpu os 8"){
			system_version = 8;
		}else if(ua.match(/iPhone OS 9/i)=="iPhone OS 9" || ua.match(/ipad; cpu os 9/i)=="ipad; cpu os 9"){
			system_version = 9;
		}else{
			
		}
		
	}else if( ua.match(/android/i)=="android"){
		device_type = 'android';
	}else{
		device_type = 'pc';
	}
	
    if(ua.match(/MicroMessenger/i) == "micromessenger") {
	  	app = "weixin";
	} else if(ua.match(/Weibo/i) == "weibo") {
		app = "weibo";
    } else if(ua.match(/\sQQ/i) == " qq") {
    	app = "qq";
    }
	   
	return {'type':device_type,'ver':system_version,'app':app}
}