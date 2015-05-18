var SoundInfoControl = (function() {
    console.log('init -- sound info');

    var page = document.getElementById( "page-sound-info" );
    var soundlistPage = document.getElementById( "soundlist-page" );
    var recordingSoundPage = document.getElementById( "recording-sound-page" );
    
    var btn_ok = page.querySelector( "#page-sound-info-btn-ok" );
    var input_title = page.querySelector("#page-sound-info-nametag-input");
    var input_phone = page.querySelector("#page-sound-info-call-input");
    var input_message = page.querySelector("#page-sound-info-message-input");
        
    var currentSound = null;
    
    var openModifySoundPage = function (id) {
    	currentSound = listenerApp.getSoundById(id);
    	if (currentSound) {
    		tau.changePage(page);
    		_setValues(currentSound.title, currentSound.dialNumber, currentSound.message);    		
    	}
    }
    
    function _handleOk () {
    	if (currentSound) {
    		currentSound.title = input_title.value;
    		currentSound.dialNumber = input_phone.value;
    		currentSound.message = input_message.value;
    	}
    	currentSound = null;
    	tau.changePage(soundlistPage);    	
    }
    
    function _handleCancel () {
    	currentSound = null;
    	tau.back();    	
    }
    
    function _setValues (title, dial, message) {
    	if (title) {
    		input_title.value = title;
    	}
    	if (dial) {
    		input_phone.value = dial;
    	}
    	if (message) {
    		input_message.value = message;
    	}
    }
    
    btn_ok.addEventListener('click', function(ev) {
    	_handleOk();    
    });

    return {
    	openModifySoundPage: openModifySoundPage
    }
}());
