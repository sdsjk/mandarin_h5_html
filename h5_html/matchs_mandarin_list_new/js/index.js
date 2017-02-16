var j_loading = new Loading();
function getNum() {
    shaixuanCount = 0,
    $(".label").find("li").each(function(a, t) {
        $(t).hasClass("on") && (shaixuanCount += parseInt($(t).text().substring($(t).text().indexOf("(") + 1, $(t).text().indexOf(")"))))
    }),
    $(".num-chos").html(shaixuanCount),
    intger = shaixuanCount
}
function showTeam() {
    afterData = [];
    for (var a = 0; a < teamName.length; a++) for (var t = fadeData[teamName[a]].length, e = 0; e < t; e++) isanalyze ? afterData[afterData.length] = fadeData[teamName[a]][e] : fadeData[teamName[a]][e].articleCount > 0 && (afterData[afterData.length] = fadeData[teamName[a]][e]);
    for (var s = "",
    n = 0; n < afterData.length; n++) {
        var l = afterData[n];
        s += '<div class="list" id=' + l.lotteryMatchId + ' onclick="OpenNative(' + l.lotteryMatchId + ');" ><div class="left"  style="color: ' + showLeftClass(l.articleCount) + ';"><p class="top" id="count">' + l.articleCount + '</p><p class="bottom">精彩说</p></div><div class="right"><p class="top"><span class="saishi">' + l.cupName + '</span><span class="week">' + l.matchId + "</span>" + showState(l.isRollball) + '<span class="time">' + formatDate(l.startTime) + '</span></p><p class="bottom"><span class="hometeam">' + l.homeTeam + '</span><i class="vs">vs</i><span class="v-team">' + l.awayTeam + '</span></p></div><div class="goin"><span class="triangle"></span></div></div>'
    }
    $(".wrapinner").html(s),
    set_rw()
}
function showSXData() {
    var a = "";
    for (var t in fadeData) {
        if (!isanalyze) {
            itemCount = 0;
            for (var e = 0; e < fadeData[t].length; e++) fadeData[t][e].articleCount > 0 && itemCount++,
            e == fadeData[t].length - 1 && 0 != itemCount && (a += '<li class="on">' + t + "(" + itemCount + ")</li>", intger += parseInt(itemCount), itemCount = 0)
        }
        isanalyze && (a += '<li class="on">' + t + "(" + fadeData[t].length + ")</li>", intger += parseInt(fadeData[t].length))
    }
    $(".label").html(a),
    setNum(),
    $(".all-chos").addClass("chos-on"),
    toal = intger
}
function setNum() {
    $(".num-chos").html(intger)
}
function initNative() {
    var a = $(".tab").find("ul>li"),
    t = a.width(),
    e = a.outerHeight();
    $(".remo").width(t).height(e).css({
        width: t,
        height: e,
        left: $(".on").offset().left
    })
}
function init() {
    initNative(),
    setTime(),
    $(".wrap").slideMove({
        moveBox: $(".remo")
    }),
    $(".tab").on("click", "li",
    function() {
        $(this).addClass("on").siblings("li").removeClass("on"),
        $(".remo").css({
            left: $(this).offset().left
        }),
        set_remo(),
        set_rw()
    })
}
function getLocalTime(a) {
    return console.log(new Date(parseInt(a)).toLocaleString().replace(/:\d{1,2}$/, " ")),
    new Date(parseInt(a)).toLocaleString().replace(/:\d{1,2}$/, " ")
}
function getDayMethod() {
    var a = (new Date).getHours(),
    t = (new Date).getMinutes();
    return a >= 0 && a < 11 ? (new Date).getDate() - 1 : 11 == a ? t >= 30 ? (new Date).getDate() : (new Date).getDate() - 1 : (new Date).getDate()
}
function setTime() {
    var a = (getLocalTime((new Date).getTime()), $(".tab").find("li")); (new Date).getFullYear();
    cur_mon = (new Date).getMonth() + 1,
    cur_day = getDayMethod(),
    yesterday = cur_day - 1,
    tomorrow = cur_day + 1,
    $(a[0]).text(GetDateStr( - 1)),
    $(a[0]).attr("id", GetDateStr1( - 1)),
    $(a[1]).text(GetDateStr(0)),
    $(a[1]).attr("id", GetDateStr1(0)),
    $(a[2]).text(GetDateStr(1)),
    $(a[2]).attr("id", GetDateStr1(1)),
    getData($(a[1]).attr("id")),
    startTime = $(a[1]).attr("id")
}
function GetDateStr(a) {
    var t = new Date;
    t.setDate(getDayMethod() + a);
    var e = (t.getFullYear(), t.getMonth() + 1),
    s = t.getDate();
    return e <= 9 && (e = "0" + e),
    s <= 9 && (s = "0" + s),
    e + "月" + s + "日"
}
function GetDateStr1(a) {
    var t = new Date;
    t.setDate(getDayMethod() + a);
    var e = t.getFullYear(),
    s = t.getMonth() + 1,
    n = t.getDate();
    return s <= 9 && (s = "0" + s),
    n <= 9 && (n = "0" + n),
    e + "-" + s + "-" + n
}
function formatDate(a) {
    return a = a.replace(/[\u4E00-\u9FFF]/, "-"),
    a.replace(/[\u4E00-\u9FFF]/, "")
}
function getCachedOrNet(a) {
    if (refreshDate = a, cacheDate.hasOwnProperty(a + "-" + isball)) {
        var t = (new Date).getTime() - cacheDate[a + "-" + isball].time;
        t / 1e3 < 40 ? render(cacheDate[a + "-" + isball].data, a) : getData(a)
    } else getData(a);
    setTimeout(function() {
//      layer.closeAll()
j_loading.closeL();
    },
    250)
}
function getData(a) {
//  layer.open({
//      type: 2
//  }),
j_loading.openL();
    $("#analyze").find(".j").addClass("f_on"),
    $("#analyze").find(".q").removeClass("f_on"),
    isanalyze = !1,
    refreshDate = a,
    $.ajax({
        url: "http://www.jingcaishuo.com/match/list",
        type: "GET",
        data: {
            language: "M",
            sportType: isball,
            startTime: a
        },
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "cookieHandler",
        async: !0,
        success: function(t) {
            j_loading.closeL(),
            "0000" == t.code && (render(t, a), cacheDataMethod(t, a))
        },
        error: function(a, t, e) {
            j_loading.closeL();
        }
    })
}
function cacheDataMethod(a, t) {
    cacheDate[t + "-" + isball] = {
        time: (new Date).getTime(),
        data: a
    }
}
function render(a, t) {
    object = [],
    fadeData = {},
    shaixuan = [],
    str = "";
    var e = "";
    $.each(a.matchList,
    function(a, s) {
        startDate = s.startTime.split(" ")[0],
        startDate != t && (str += '<div class="list" id=' + s.lotteryMatchId + ' onclick="OpenNative(' + s.lotteryMatchId + ');" style="display: ' + isShowHide(s.articleCount) + ';"><div class="left" style="color: ' + showLeftClass(s.articleCount) + ';"><p class="top" id="count">' + s.articleCount + '</p><p class="bottom">精彩说</p></div><div class="right"><p class="top"><span class="saishi">' + s.cupName + '</span><span class="week">' + s.matchId + '</span><span class="time">' + formatDate(s.startTime) + "</span>" + showState(s.isRollball) + '</p><p class="bottom"><span class="hometeam">' + s.homeTeam + '</span><i class="vs">vs</i><span class="v-team">' + s.awayTeam + '</span></p></div><div class="goin"><span class="triangle"></span></div></div>', e = s.cupName, object = [s], fadeData.hasOwnProperty(e) ? (object = fadeData[e], fadeData[e] = object.concat(s)) : fadeData[e] = object)
    }),
    $(".wrapinner").html(str),
    set_rw()
}
function getCountNum() {
    sxCount = {};
    for (var a = 0; a < shaixuan.length; a++) {
        var t = 1;
        sxCount.hasOwnProperty(shaixuan[a]) && (t = sxCount[shaixuan[a]], t++),
        sxCount[shaixuan[a]] = t
    }
}
function isShowHide(a) {
    return "0" == a ? "none": "block"
}
function showLeftClass(a) {
    return "0" == a ? "#999999": "#ffdf1b"
}
function set_remo() {
//  layer.open({
//      type: 2
//  });
j_loading.openL();
    var a = $(".tab").find("ul>li"),
    t = a.width(),
    e = a.outerHeight();
    $(".remo").width(t).height(e).css({
        width: t,
        height: e,
        left: $(".on").offset().left
    }),
    cur_year = (new Date).getFullYear();
    var s = $(".tab").find(".on").attr("id");
    startTime = s,
    $("#analyze").find(".j").addClass("f_on"),
    $("#analyze").find(".q").removeClass("f_on"),
    isanalyze = !1,
    shaixuanflag = "",
    shaixuanCount = 0,
    getCachedOrNet(startTime),
    set_rw()
}
function showState(a) {
    return a > 0 ? '<i class="state">滚球中</i>': ""
}
function getWeek(a) {
    return "1" == a ? "周一": "2" == a ? "周二": (a = "3") ? "周三": (a = "4") ? "周四": (a = "5") ? "周五": (a = "6") ? "周六": (a = "7") ? "周日": void 0
}
function OpenNative(a) {
	
//  window.app.openMatch(a, startTime);
       var po_url = 'http://www.jingcaishuo.com/mandarin_h5_html/matchs_detail_mandarin/?matchId='+a;
//     alert(po_url); 
       app.pushToWebView(po_url, 0) ;
////     return false;
}
function set_rw() {
    $(".right").width($(".wrap").width() - $(".left").width() - $(".goin").width() - 30)
}
var startTime = "",
isball = "0",
cur_year = "",
shaixuan = [],
isanalyze = !1,
sxCount = {},
teamName = [],
refreshDate = "",
cacheDate = {},
fadeData = {},
object = [],
shaixuanflag = "",
shaixuanCount = 0,
li = $(".label").find("li");
$(".search").on("click",
function() {
    count = 0,
    shaixuan = [],
    "1" == isball ? $("#ballname").text("篮球赛事筛选") : "0" == isball && $("#ballname").text("足球赛事筛选"),
    null != shaixuanflag && "undefined" != shaixuanflag && "" != shaixuanflag ? ($(".label").html(shaixuanflag), getNum()) : showSXData(),
    $(".choose").show(function() {
        $(".foot").css({
            position: "fixed",
            bottom: "0"
        })
    }),
    $(".container").hide()
}),
$("#analyze").click(function() {
    if (shaixuanflag = "", shaixuanCount = 0, j_loading.openL(), cacheDate.hasOwnProperty(startTime + "-" + isball)) {
        var a = cacheDate[startTime + "-" + isball].data.matchList,
        t = "";
        $.each(a,
        function(a, e) {
            t += isanalyze ? '<div class="list" id=' + e.lotteryMatchId + ' onclick="OpenNative(' + e.lotteryMatchId + ');" style="display: ' + isShowHide(e.articleCount) + ';"><div class="left" style="color: ' + showLeftClass(e.articleCount) + ';"><p class="top" id="count">' + e.articleCount + '</p><p class="bottom">精彩说</p></div><div class="right"><p class="top"><span class="saishi">' + e.cupName + '</span><span class="week">' + e.matchId + "</span>" + showState(e.isRollball) + '<span class="time">' + formatDate(e.startTime) + '</span></p><p class="bottom"><span class="hometeam">' + e.homeTeam + '</span><i class="vs">vs</i><span class="v-team">' + e.awayTeam + '</span></p></div><div class="goin"><span class="triangle"></span></div></div>': '<div class="list" id=' + e.lotteryMatchId + ' onclick="OpenNative(' + e.lotteryMatchId + ');"><div class="left" style="color: ' + showLeftClass(e.articleCount) + ';"><p class="top" id="count">' + e.articleCount + '</p><p class="bottom">精彩说</p></div><div class="right"><p class="top"><span class="saishi">' + e.cupName + '</span><span class="week">' + e.matchId + "</span>" + showState(e.isRollball) + '<span class="time">' + formatDate(e.startTime) + '</span></p><p class="bottom"><span class="hometeam">' + e.homeTeam + '</span><i class="vs">vs</i><span class="v-team">' + e.awayTeam + '</span></p></div><div class="goin"><span class="triangle"></span></div></div>'
        }),
        $(".wrapinner").html(t)
    }
    isanalyze ? ($("#analyze").find(".j").addClass("f_on"), $("#analyze").find(".q").removeClass("f_on")) : ($("#analyze").find(".q").addClass("f_on"), $("#analyze").find(".j").removeClass("f_on")),
    set_rw(),
    isanalyze = !isanalyze,
    setTimeout(function() {
//      layer.closeAll()
j_loading.closeL();
    },
    250)
}),
$("#sure").click(function() {
    if (j_loading.openL(), shaixuanCount += intger, intger = 0, teamName = [], $(".num-chos").html("0"), $(".label").find("li").length == $(".label").find(".on").length) {
        var a = 0;
        $(".label").find("li").each(function(t, e) {
            $(e).hasClass("on") && (teamName[a] = $(e).text().substr(0, $(e).text().lastIndexOf("(")), a++)
        })
    } else {
        var a = 0;
        $(".label").find("li").each(function(t, e) {
            $(e).hasClass("on") && (teamName[a] = $(e).text().substr(0, $(e).text().lastIndexOf("(")), a++)
        })
    }
    setTimeout(function() {
        showTeam(),
//      layer.closeAll()
j_loading.closeL();
    },
    250),
    $(".choose").hide(),
    $(".container").show(),
    shaixuanflag = $(".label").html()
});
var afterData = [],
intger = 0,
toal = 1;
$(".back").on("click",
function() {
    intger = 0,
    $(".choose").hide(),
    $(".container").show(),
    set_rw()
}),
$(".all-chos").on("click",
function() {
    $(this).toggleClass("chos-on"),
    $(".all-chos").hasClass("chos-on") ? $(".label").find("li").each(function(a, t) {
        $(t).addClass("on"),
        $(".num-chos").html(toal),
        intger = toal
    }) : $(".label").find("li").each(function(a, t) {
        $(t).removeClass("on"),
        $(".num-chos").html("0"),
        intger = 0
    })
}),
$(".label").on("click", "li",
function() {
    $(this).toggleClass("on"),
    $(".label").find("li").length > $(".label").find(".on").length ? $(".all-chos").removeClass("chos-on") : $(".label").find("li").length == $(".label").find(".on").length && $(".all-chos").addClass("chos-on"),
    $(this).hasClass("on") ? intger += parseInt($(this).text().substring($(this).text().indexOf("(") + 1, $(this).text().indexOf(")"))) : intger -= parseInt($(this).text().substring($(this).text().indexOf("(") + 1, $(this).text().indexOf(")"))),
    setNum()
}),
setNum();
var callbackdata = {},
str = "";
init(),
$("#basketball").click(function() {
    j_loading.openL();
    $("#analyze").find(".j").addClass("f_on"),
    $("#analyze").find(".q").removeClass("f_on"),
    isanalyze = !1,
    shaixuanflag = "",
    shaixuanCount = 0,
    $(this).addClass("h-on"),
    $("#football").removeClass("h-on"),
    isball = "1",
    getCachedOrNet(startTime),
    set_rw()
}),
$("#football").click(function() {
    j_loading.openL();
    $("#analyze").find(".j").addClass("f_on"),
    $("#analyze").find(".q").removeClass("f_on"),
    isanalyze = !1,
    shaixuanflag = "",
    shaixuanCount = 0,
    $(this).addClass("h-on"),
    $("#basketball").removeClass("h-on"),
    isball = "0",
    getCachedOrNet(startTime),
    set_rw()
});