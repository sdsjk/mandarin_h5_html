
var j_loading = new Loading();
function action() {
    this.uid = 0;
    this.type = 0;  //0下拉刷新   1上拉分页
    this.domin = 'http://www.jingcaishuo.com/';
    this.articleid;
    this.index = 0;
    this.start_articleid = 0;  //开始文章id
    this.isFollowed = false;
    this.authorId = 0;
    //下拉刷新
    this.down = function(){
    		this.start_articleid = 0;
	    	this.type = 0;
	    	this.init();
    	
    }
    
    //上拉分页
    this.up = function(){
//  	    alert('up');
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
	
	this.getAuthorId = function(){
		return this.getUserToken().AuthorId;
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
//      });
j_loading.openL();
    }

    //取url参数
    this.GetQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return 37291;
    }

    this.Author = function(Authors){
    	
    	$(document).attr("title",Authors.nickname);//修改title值  
    	
    	 var a_html = '';
    	 a_html += '<div class="hd">';
				a_html += '<img src="img/bc.png" class="goback" alt="">';
				a_html += '<p>'+Authors.nickname+'</p>';
			a_html += '</div>';			
			a_html += '<span class="tou_pic"><img src="'+Authors.picurl+'" alt="" class="img"></span>';
			a_html += '<p class="t_num"><span class="fan">'+Authors.follownum+'</span>|<span class="art_num">'+Authors.allaticlenum+'</span></p>';
			a_html += '<p class="t_intro">'+Authors.brief+'</p>';

		$("#Authors_content").html(a_html);
		
		$('.goback').click(function(){
			
			 app.clickWebViewGoBack();
		})
		
        var ua = navigator.userAgent.toLowerCase();	
		if(/iphone|ipad|ipod/.test(ua)) {
			$('.hd').css({'height':'0.65rem'})
			$('.hd').find('p').css({'padding-top':'0.15rem'})
			$('.goback').css('top','0.32rem');
			$('.tou_pic').css('top','0.65rem');
			$('.t_intro').css({'margin-top':'0.15rem'});
		}
    }

    this.List = function(data) {
        var s = this;
        var list_html = '';
        if (data.length == 0) {
            s.alertmsg('暂无数据');
            return false
        }
        for (var i = 0; i < data.length; i++) {
	    
	    
	        list_html += '<div class="listcon" id="' + data[i].id + '">';
				list_html += '<div class="l_tim">';
				
                list_html += '<span class="hour">' + fmtMydate_l(data[i].last_modified).h.toString() + '</span><br/>';
				list_html += '<span class="date">' + fmtMydate_l(data[i].last_modified).d.toString() + '</span>';
					
				list_html += '</div>';
				list_html += '<div class="r_txt">'; 
					list_html += '<div class="txtbox">';
					
					
					list_html += '<span class="txt" onclick="goarticle(' + data[i].id + ')" id="' + data[i].id + '">';
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
							var match = data[i].matches[0].home_team+' vs '+data[i].matches[0].away_team;
							var m_str = '';
							if(match.length > 14){
								m_str = match.substr(0,14)+'..';
							} else {
								m_str = match;
							}
							list_html += '<span>'+data[i].matches[0].cup_name+'</span><span>'+m_str+'</span><span>' + fmtMydate_l(data[i].matches[0].start_time).a + '</span>';
							list_html += '</div>';
						}
					}
				list_html += '</div>';				
			list_html += '</div>';
	    
	    
	    
	    
            if(i == data.length - 1){
            	  s.start_articleid = data[i].id;
            }
        }
        if(s.type == 0){
        	$(".div_article").html(list_html);
        } else {
        	$(".div_article").append(list_html);
        }
        

        
//      var i = true;
//      $(".goarticle").click(function() {
//      	var articleid = $(this).attr("id");
//      	app.openArticle(articleid);
//      	
//      })
//      $(".gomatch").click(function(){
//      	var m_id = $(this).attr("m_id");
//      	var m_url = 'http://www.jingcaishuo.com/h5_html/matchs_detail_cantonese/?EntryId='+m_id;
//          app.pushToWebView(m_url, 0) ;
////      	alert(m_id);
//      })
    }

    this.footer = function(){
    	 var y = this;
    	 
    	 var f_html = '<span class="attention attention_on">关注</span><span>|</span><span class="letter letter_on">发私信</span>';
    	 $('.foot').html(f_html);
    	 
    	 if(y.isFollowed == 'true'){
    	 	$('.attention').removeClass('attention_on');
    	 	$('.attention').html('已关注');
    	 } else {
    	 	$('.attention').addClass("attention_on");
    	 	$('.attention').html('关注');
    	 }
    	 
    	 
    	 $('.attention').click(function(){
    		   if(y.isLogin()){
    		   	    y.Follow();
    		   } else {
//  		   	   alert(12);
    		   	   app.toastLogIn();
    		   }
    	})
    	 
    	 $('.letter').click(function(){
    	 	   if(y.isLogin()){
    	 	   	  if(y.isFollowed == 'true'){
    	 	   	  	 app.pushToMessage(y.getAuthorId());
    	 	   	  } else {
    	 	   	  	 y.alertmsg("关注老师后才能发私信哦");
    	 	   	  }
    		   	   
    		   } else {
    		   	   app.toastLogIn();
    		   }
    	 	 
    	 })
    }
    
    this.Follow = function(){
    	 var l = this;
    	 var path = '';
    	 if(l.isFollowed == 'true'){

    	 	path = 'follow/cancel';
    	 } else {
    	 	path = 'follow/add';
    	 }
    	 
    	l.loading();
        $.ajax({
            url: l.domin + path,
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: "cookieHandler",
            //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            async: true,
            data: {
            	language: 'M',
				userId: l.getUserId(),
				securityCode: l.getSecurityCode(),
				analystId: l.getAuthorId()
//				articleId: t.start_articleid
		    },
            success: function(data) {
//              layer.closeAll();
				j_loading.closeL();
                if (data.code == 0000) {
//              	alert(2);
                	if(l.isFollowed == 'true'){
                		l.isFollowed = 'false';
                		$('.attention').addClass("attention_on");
                		$('.attention').html('关注');
                		l.alertmsg('取消关注');
                	} else {
                		l.isFollowed = 'true';
                		$('.attention').removeClass('attention_on');
                		$('.attention').html('已关注');
                		l.alertmsg('关注成功');
                	}
                } else {
                	
                    l.alertmsg(data.msg);
                }

            },
            error: function() {
                alert("网络或系统异常，请稍后重试")
            }
        });
    }

    //页面初始化
    this.init = function() {
    	
        var authorId = this.GetQueryString('authorId');
        var t = this;
        
        
        var url = t.domin + '/Author/GetAuhorInfo?time=' + Math.random();
//      alert(t.getAuthorId());
//      alert(t.start_articleid);
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
				token: t.getSecurityCode(),
				authorId: t.getAuthorId(),
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
//              	alert(data.Author.authorFollowed);
                	if(t.type == 0){
                		t.Author(data.Author);
                		t.isFollowed = data.Author.authorFollowed;
                		
                		t.footer();
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
demo.down();
//demo.gologin();

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
//	var articleid = $(this).attr("id");
    app.openArticle(articleid);
}
function gomatch(id){
	var m_url = 'http://www.jingcaishuo.com/mandarin_h5_html/matchs_detail_mandarin/?EntryId='+id;
    app.pushToWebView(m_url, 0) ;
}


//function GetDate(date, AddDayCount) {
//  var dd = date;
//  dd.setDate(dd.getDate() + AddDayCount);
//  return dd;
//}
//function strToTimestamp(stringTime) {
////  stringTime = stringTime.replace(/-/g, "/");
////  return Date.parse(new Date(stringTime));
//  return moment(stringTime);
//}
//function fmtMydate(datestr) {
////	var datestr = datestr.split('.')[0];
//  var dd = new Date();
//  var todaystr = dateFormat(GetDate(new Date(), 0), "yyyy-MM-dd");
//  var yesterdaystr = dateFormat(GetDate(new Date(), -1), "yyyy-MM-dd");
//  var beforeyesterdaystr = dateFormat(GetDate(new Date(), -2), "yyyy-MM-dd");
//  var ts = strToTimestamp(datestr);
//  var ts_date = new Date(ts);
//  var targetdate = dateFormat(ts_date, "yyyy-MM-dd");
//
//  if (todaystr == targetdate) {
//  	return {'d':'今天 ','h':dateFormat(ts_date, "hh:mm"),'a':'今天 ' + dateFormat(ts_date, "hh:mm")};
////      return '今天 ' + dateFormat(ts_date, "hh:mm");
//  } else if (yesterdaystr == targetdate) {
//  	return {'d':'昨天 ','h':dateFormat(ts_date, "hh:mm"),'a':'昨天 ' + dateFormat(ts_date, "hh:mm")};
////      return '昨天 ' + dateFormat(ts_date, "hh:mm");
//  } else {
//  	return {'d':dateFormat(ts_date, "MM-dd").toString(),'h':dateFormat(ts_date, "hh:mm").toString(),'a':dateFormat(ts_date, "MM-dd hh:mm").toString()};
////      return dateFormat(ts_date, "MM-dd hh:mm");
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