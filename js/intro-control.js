var IntroControl = (function() {
    console.log('init');

    var page = document.getElementById('intro');
    var bg = page.querySelector('.intro-bg');//    var btn_popup_icon = page.querySelector('.notipopup-center-btn');

    function fadeOutBg () {
    	$(bg).addClass('fade-out');
    	bg.addEventListener("webkitAnimationEnd", function() {
    	    tau.changePage('#page-sound-history');
    	}, false);
    }
    
    var _handleBgClick = function() {
    	bg.removeEventListener('click', _handleBgClick);
    	fadeOutBg();
    }    
    
    page.addEventListener( "pageshow", function() {
    	bg.addEventListener('click', _handleBgClick);        
    });

    page.addEventListener( "pagebeforehide", function() {
    	bg.removeEventListener('click', _handleBgClick);       
    });

    return {
    }
}());