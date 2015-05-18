var SoundListControl = (function() {
    console.log('init');

    var page = document.getElementById( "soundlist-page" );
    var recordingSoundPage = document.getElementById( "recording-sound-page" );
    var pageSoundInfo = document.getElementById( "page-sound-info" );
    var pageSoundHistory = document.getElementById( "page-sound-history" );
    var listElement = page.querySelector("#sound-listview" );

    var btn_addSound = page.querySelector( "#addSoundBtn" );
    var soundDeletePopup = page.querySelector( "#sound-delete-popup" );
    var soundDeletePopupBtnOk = page.querySelector( "#sound-delete-popup-ok" );
    var soundDeletePopupBtnCancel = page.querySelector( "#sound-delete-popup-cancel" );

    var deleteTargetListItemId = null; //using
    var swipeList = null; //dynamic create

    var rotaryDetentHandler;
    function updateSoundList () {
        console.log('updateSoundList');
        var soundListView = $('#sound-listview');
        soundListView.children().remove();
        for (var i in listenerApp.sounds) {
            var sound = listenerApp.sounds[i];
            addSoundListItem(sound.id, sound.title, sound.enabled, sound.dialNumber);
        }
        refreshSwipeList();
    }

    function addSoundListItem (id, title, enabled, dialNumber) {
        console.log('addSoundListItem');
        var li, label, span, input;
        li = document.createElement('li')
        label = document.createElement('label');
        span = document.createElement('span');
        input = document.createElement('input');

        li.setAttribute('id', id);
        li.setAttribute('class', 'li-has-multiline li-has-checkbox')
        label.textContent = title;

        span.setAttribute('class', 'ui-li-sub-text li-text-sub');
        if (dialNumber !== undefined) {
            span.textContent = dialNumber
        } else {
            span.textContent = '';
        }

        input.setAttribute('type', 'checkbox');
        if (enabled === true) {
            input.checked = true;
        } else {
            input.checked = false;
        }

        label.appendChild(span);
        label.appendChild(input);
        li.appendChild(label)
        listElement.appendChild(li);
        console.log('list item added: ' + li);
    }

    function removeSoundListItem (id) {
        console.log('removeSoundListItem');
        var listItem = listElement.querySelector('#' + id);
        if (listItem) {
            console.log('list item deleted', listItem);
            listItem.remove();
            return true;
        }
        return false;
    }

    function refreshSwipeList () {
        if (swipeList) {
            swipeList.destroy();
            swipeList = null;
        }
        swipeList = tau.widget.SwipeList( listElement, {
            swipeTarget: "li",
            swipeElement: ".ui-swipelist",
            rtlStartColor : "#FF2200",
                /*
                 * ltrStartColor : #xx
                 * ltrEndColor : #xx
                 * rtlStartColor : #xx
                 * rtlEndColor : #xx
                 */
        });
    }

    function getSoundItemFromID(soundID) {
        return $('#sound-listview li[id=' + soundID +']')[0];
    }
    function listMatchHandler(event, soundID) {
        console.log('list matchHandler: ' + soundID);
        blink(getSoundItemFromID(soundID));
    }

    function openModifyPage (soundID) {
       SoundInfoControl.openModifySoundPage(soundID);
//        tau.changePage(modifySoundPage);
    }

    listElement.addEventListener("swipelist.right", function(evt) {
        console.log('swipe right', evt.target);
        var list = evt.currentTarget;
        var target = evt.target;
        deleteTargetElem = target;
        tau.openPopup(soundDeletePopup);
    });

    listElement.addEventListener("swipelist.left", function(evt) {
       console.log('swipe left', evt.target);
       var id = evt.target.id;
       openModifyPage (id);
   });

    page.addEventListener( "pageshow", function() {
        console.log('pageshow');
        listenerApp.on('soundMatched', listMatchHandler);
        updateSoundList();
    });

    page.addEventListener( "pagebeforeshow", function() {
        console.log('pagebeforeshow');

        // "rotarydetent" event handler
        rotaryDetentHandler = function(e) {
            // Get rotary direction
            direction = e.detail.direction;
            if (direction === "CW") {
                tau.changePage(pageSoundHistory);
            } 
        };

        // Add rotarydetent handler to document
        document.addEventListener("rotarydetent", rotaryDetentHandler);
    });

    document.getElementById('sound-delete-popup-cancel').addEventListener('click', function(ev) {
         tau.closePopup();
    });

    document.getElementById('sound-delete-popup-ok').addEventListener('click', function(ev) {
        if (deleteTargetElem !== null) {
            deleteSound(deleteTargetElem.id);
            deleteTargetElem.remove();
            deleteTargetElem = null;
        }
        tau.closePopup();
    });
    
    function _createSample () {
    	listenerApp.sounds = [];
    	var samples = [
    	               {title:'alarm',
    	            	   dial : '0000' },
    	            	   {title:'crash',
        	            	   dial : '112'
        	            	   },
        	            	   {title:'klaxon',
            	            	   dial : '119'
            	            	   },
            	            	   {title:'doorbell',
                	            	   dial : '010-555-5555'
                	            	   }
    	               ]
    	;
    	for (var i = 0; i < samples.length; i++) {
    		var newSoundID = generateNewSoundID();
    		addNewSound(samples[i].title, null, null, samples[i].dial, 'msg');
    	}    		    
    }

    page.addEventListener( "pagebeforehide", function() {
        console.log('pagebeforehide');

        document.removeEventListener("rotarydetent", rotaryDetentHandler);
        // release handler
        console.log('off listMatchHandler');
        listenerApp.off('soundMatched', listMatchHandler);

        // release object
        if (swipeList) {
            swipeList.destroy();
            swipeList = null;
        }
    });

    document.getElementById('addSoundBtn').addEventListener('click', function(ev) {
    	_createSample(); //TODO : remove it
        tau.changePage(recordingSoundPage);
    });

    return {
        updateSoundList : updateSoundList
    };
}());
