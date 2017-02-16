function Loading (){
	this.ele = '<div class="jcs_dialog"><div class="j_inner"><img src="../jcs_dialog/cai.png" alt="">'+
				'<span class="j_move"></span></div></div>';
	this.timerj = null;
	this.startH = 0;
	this.createLink();
}
Loading.prototype = {
	openL: function (){
		var that = this;
		$('html').append($(this.ele))
		if($('.jcs_dialog').length>1){
			return;
		}			
		this.timerj=setInterval(function(){
			that.startH++;
			if(that.startH>=76){that.startH=0}
			document.querySelector('.j_move').style.height=that.startH+'px';
			document.querySelector('.j_move').style.backgroundPosition='0 '+(-76+that.startH)+'px';
		},15);
		
	},
	closeL: function (){
		var that = this;
		setTimeout(function(){
			$('.jcs_dialog').remove();
			clearInterval(that.timerj);
			that.startH = 0;
			that.timerj = null;			
		},500)
		
	},
	createLink: function (){
		$('head').append('<link rel="stylesheet" href="../jcs_dialog/jcs_dialog.css">')
	}
}