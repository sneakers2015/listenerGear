var HistoryControl = (function() {
    console.log('init');

    var page = document.getElementById('page-sound-history');
    var flashPanel = page.querySelector('.flash-panel');
    var headerBtn = page.querySelector('.ui-header');

    var btn_ok = page.querySelector('.send-message-cancel');
    var btn_cancel = page.querySelector('.send-message-ok');
    var popupElem = page.querySelector('#notiPopup');
    var toastPopupElem = page.querySelector('#popupToast');
    var icon_trash = page.querySelector('.trash-btn');

    var timerInterval = null;
//    var btn_popup_icon = page.querySelector('.notipopup-center-btn');

    var currentNoti = null;
    var popupOpened = false;

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
            diffMs = currentDate.getTime() - history.Time;
            diffMin =  Math.round(((diffMs % 86400000) % 3600000) / 60000);
            elem = page.querySelector('#ID'+history.Time);
            if (elem) {
                elem.innerText = diffMin + '분전';
            } else {
                _addHistoryItem(history.Title, diffMin + '분전', history.Time);
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
        if (popupOpened === false) {
            popupOpened = true;
            var currentDate = new Date;
            var data = {
                Lat: messageObj.Lat,
                Lng: messageObj.Lng,
                Time: currentDate.getTime(),
                Title: messageObj.Title,
                Phone: messageObj.Phone,
                Msg: messageObj.Msg
            }
            listenerApp.history.push(data);
            updateHistory();
            notification(history);
            openNotiPopup(data);
        }
    }

    function openNotiPopup (noti) {
        tau.openPopup(popupElem);
        showFlashPanel(noti.Title);
        currentNoti = noti;
    };

    function clearHistory () {
        $('.history-container').empty();
        listenerApp.history = [];
        updateHistory();
    };

    var _handleClickCallIcon = function (event) {
        if (currentNoti) {
            // FIXME::
            sendSocket(currentNoti);
            currentNoti = null;
        }
        tau.closePopup();
        tau.openPopup(toastPopupElem);
        setTimeout(function(){
        	if (popupOpened === true) {
        		tau.closePopup();
        	}
        }, 2000);
    };
    
    toastPopupElem.addEventListener ('popuphide', function () {
    	popupOpened = false;
    });

    var _handleClickTrash = function () {
        clearHistory();
    };
    
    var _handleTimerInterval = function () {
        updateHistory();
    };
   
    popupElem.addEventListener('popupcreate', function(){
        document.getElementById('notipopup-center-btn').addEventListener ('click', _handleClickCallIcon);
    });

    $('#1btnPopup-cancel').bind('click', function() {
        tau.closePopup();
        popupOpened = false;
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

    return {
        receiveMessageHandler : receiveMessageHandler
    }
}());