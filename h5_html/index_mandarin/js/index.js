$(document).ready(function(){

	$(".bt_soll").hover(function(){
		$("#btn_prev,#btn_next").fadeIn()
	},function(){
		$("#btn_prev,#btn_next").fadeOut()
	});
	
	$dragBln = false;
	
	$(".bt_sbox").touchSlider({
		flexible : true,
		speed : 200,
		btn_prev : $("#btn_prev"),
		btn_next : $("#btn_next"),
		paging : $(".bt_bico a"),
		counter : function (e){
			$(".bt_bico a").removeClass("on").eq(e.current-1).addClass("on");
		}
	});
	
	$(".bt_sbox").bind("mousedown", function() {
		$dragBln = false;
	});
	
	$(".bt_sbox").bind("dragstart", function() {
		$dragBln = true;
	});
	
	$(".bt_sbox a").click(function(){
		if($dragBln) {
			return false;
		}
	});
	
	timer = setInterval(function(){
		$("#btn_next").click();
	}, 5000);
	
	$(".bt_soll").hover(function(){
		clearInterval(timer);
	},function(){
		timer = setInterval(function(){
			$("#btn_next").click();
		},5000);
	});
	
	$(".bt_sbox").bind("touchstart",function(){
		clearInterval(timer);
	}).bind("touchend", function(){
		timer = setInterval(function(){
			$("#btn_next").click();
		}, 5000);
	});
	
});