var HistoryControl = (function() {
    console.log('init');

    var page = document.getElementById('page-sound-history');
    var flashPanel = page.querySelector('.flash-panel');
    var headerBtn = page.querySelector('.ui-header');

    var btn_ok = page.querySelector('.send-message-cancel');
    var btn_cancel = page.querySelector('.send-message-ok');
    var popupElem = page.querySelector('#notiPopup');
    var icon_trash = page.querySelector('.trash-btn');
    
    var timerInterval = null;
//    var btn_popup_icon = page.querySelector('.notipopup-center-btn');

    var currentNoti = null;
    function startMatcher () {
        // TODO
    }

    function _createNewSoundByStream() {
        var sound;
        return sound;
    }

    function endMatcher() {
        var result;
        if (result) {
            
        }
    }

    function addNewItemElem (title, time) {
        $('.history-container').prepend("<div class='history-item'><span class='history-item-title'>" + title + "</span><span class='history-item-time'>" + time + "</span><div class='history-item-icon'>icon</div></div>"
        );
//        showFlashPanel(title);
    };

    function _addHistoryItem (title, time, id) {
    	 $('.history-container').prepend("<div class='history-item'><span class='history-item-title'>" + title + "</span><span id=ID" + id + " class='history-item-time'>" + time + "</span><div class='history-item-icon'>icon</div></div>"
         );
    };
    
    function updateHistory () {
    	var historyList = listenerApp.history;
    	var history;
    	var elem;
    	var currentDate = new Date;
    	var diffMs, diffMin;
    	for (var i = 0; i < historyList.length; i++) {
    		history = historyList[i];
    		diffMs = currentDate.getTime() - history.time;
            diffMin =  Math.round(((diffMs % 86400000) % 3600000) / 60000);
    		elem = page.querySelector('#ID'+history.time);
    		if (elem) {
    			elem.innerText = diffMin + '분전';
    		} else {
    			_addHistoryItem(history.title, diffMin + '분전', history.time);
    		}
    	}
    	
    	if (historyList.length > 0) {
    		$(icon_trash).addClass('trash-full');
    	} else {
    		$(icon_trash).removeClass('trash-full');
    	}
    }

    function showFlashPanel (text) {
        flashPanel.innerText = text;
        blinkBlue(flashPanel);
    };

    function receiveMessageHandler( messageObj ) {
        var currentDate = new Date;
//        notification(noti);        
        var history = {
    			title : messageObj.Title,
    			time : currentDate.getTime(),
    			dialNumber :messageObj.Phone,
    			message : messageObj.Msg
    	};
    	listenerApp.history.push(history);
    	updateHistory();
        openNotiPopup(history);
        // TODO:: link to send SMS in Alert Dialog
    }

    function openNotiPopup (noti) {
        tau.openPopup(popupElem);
        showFlashPanel(noti.title);
        currentNoti = noti;
    };

    function clearHistory () {
        $('.history-container').empty();
        listenerApp.history = [];
        updateHistory();
    };

    var _handleClickCallIcon = function (event) {
        if (currentNoti) {
        	sendSMS(currentNoti.dialNumber, currentNoti.msg);
        	currentNoti = null;
        }
        tau.closePopup();
        
        //send mms
    };
    
    var _handleClickTrash = function () {
    	clearHistory();
    };
    
    var _handleTimerInterval = function () {
    	updateHistory();
    };
   
    popupElem.addEventListener('popupcreate', function(){
    	document.getElementById('notipopup-center-btn').addEventListener ('click', _handleClickCallIcon);    	
    });

    page.addEventListener( "pageshow", function() {
        console.log('pagebeforeshow');        
        listenerApp.on('receiveSoundMessage', receiveMessageHandler);
        document.querySelector('.trash-btn').addEventListener('click', _handleClickTrash);
        timerInterval = setInterval(_handleTimerInterval, 30000);
        
    });

    page.addEventListener( "pagebeforehide", function() {
        console.log('pagebeforehide');
//        btn_popup_icon.removeEventListener ('click', _handleClickCallIcon);
        listenerApp.off('receiveSoundMessage', receiveMessageHandler);
        if (timerInterval) {
        	clearInterval(timerInterval);
        	timerInterval = null;
        }
        document.querySelector('.trash-btn').removeEventListener('click', _handleClickTrash);
       
    });

    function _createSamples () {
        var samples = ['alarm', 'crash', 'klaxon', 'doorbell'];
        var sampleCnt = 8;
        var idx;
        for (var i = sampleCnt - 1; i >= 0; i--) {
            idx = _.random(0, 4);
            addNewItemElem(samples[idx], parseInt(i/2) + '분전');
        }
    };

    return {
    	receiveMessageHandler : receiveMessageHandler
    }
}());