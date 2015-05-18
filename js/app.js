var listenerApp;

(function(jQuery) {
    jQuery.eventEmitter = {
            _JQInit: function() {
                this._JQ = jQuery(this);
            },
            emit: function(evt, data) {
                !this._JQ && this._JQInit();
                this._JQ.trigger(evt, data);
            },
            once: function(evt, handler) {
                !this._JQ && this._JQInit();
                this._JQ.one(evt, handler);
            },
            on: function(evt, handler) {
                !this._JQ && this._JQInit();
                this._JQ.bind(evt, handler);
            },
            off: function(evt, handler) {
                !this._JQ && this._JQInit();
                this._JQ.unbind(evt, handler);
            }
    };
}(jQuery));

/**
 * Listener App model
 *
 * Emit 'soundMatched' event when sound is matched.
 *
 * @class
 * @extends {jQuery.eventEmitter}
 */
function ListenerApp() {
    this.sounds = {}; // soundID -> Sound map
    this.currentState = 'stopped'; // 'stopped' | 'running'
    this.history = []; // Alert list
    this.addNewSound = addNewSound;
    this.deleteSound = deleteSound;
    this.getSoundById = getSoundByID;
}

jQuery.extend(ListenerApp.prototype, jQuery.eventEmitter);

function start() {
    console.log('start');
    listenerApp.currentState = 'running';
}

function stop() {
    console.log('stop');
    listenerApp.currentState = 'stopped';
}

/**
 * Sound model
 * @param id
 * @param title
 * @param soundData
 * @param samplePackage
 * @param alertMethods
 * @param dialNumber
 * @param message
 * @class
 */
function Sound(id, title, enabled, soundData, samplePackage, notiEnabled, dialNumber, message) {
    console.log('Sound: ' + 'id: ' + id + ' title: ' + title + ' enabled: ' + enabled + 'soundData: ' + soundData +
            ' samplepackage: ' + samplePackage + ' notiEnabled: ' + notiEnabled + ' dialNumber: ' + dialNumber + ' message: ' + message);
    this.id = id;
    this.title = title;
    this.enabled = enabled;
    this.soundData = soundData;
    this.samplePackage = samplePackage;
    this.notiEnabled = notiEnabled;
    this.dialNumber = dialNumber;
    this.message = message;
}

/**
 * Generate new sound id (max sound id + 1)
 * @returns {Number}
 */
function generateNewSoundID() {
    var maxid = 0;
    for(var i in listenerApp.sounds) {
        var sound = listenerApp.sounds[i];
        maxid = (sound.id > maxid) ? sound.id : maxid;
    }
    return maxid + 1;
}

/**
 * Add new sound
 * @param title
 * @param soundData
 * @param samplePackage
 * @param dialNumber
 * @param message
 * @returns {Sound}
 */
function addNewSound(title, soundData, samplePackage, dialNumber, message) {
    console.log('addNewSound');
    var newid = generateNewSoundID();
    var _dialNumber = null;
    var _message = null;
    if (dialNumber !== undefined) {
        _dialNumber = dialNumber;
    }
    if (message !== undefined) {
        _message = message;
    }
    var newSound = new Sound(newid, title, true, soundData, samplePackage, true, _dialNumber, _message);
    listenerApp.sounds[newid] = newSound;
    saveApp();
    return newSound;
}

function getSoundByID(soundID) {
    console.log('getSoundByID: ' + soundID);
    for (var i in listenerApp.sounds) {
        var sound = listenerApp.sounds[i];
        if (sound.id == soundID) {
            return sound;
        }
    }
    return null;
}

/**
 * Change sound properties
 */
function changeSound(soundID, soundObject) {
    var sound = getSoundByID(soundID);
    console.log('changeSound: ' + 'sound: ' + sound + 'soundObject: ' + soundObject);
    if (!sound) {
        console.error('changeSound soundID not found: ' + soundID);
        return false;
    }
    soundObject = _.pick(soundObject, 'title', 'soundData', 'samplePackage', 'enabled', 'alertMethods', 'notiEnabled', '_dialNumber', '_message');
    _.extend(sound, soundObject);
    saveApp();
    return true;
}

/**
 * Delete sound
 */
function deleteSound(soundID) {
    console.log('deleteSound: ' + soundID);
    for (var i in listenerApp.sounds ) {
        var sound = listenerApp.sounds[i];
        if (sound.id == soundID) {
            delete listenerApp.sounds[i];
            saveApp();
            return true;
        }
    }
    console.error('changeSound soundID not found:', soundID);
    return false;
}

/**
 * load saved app data (sounds, etc)
 */
function loadApp() {
    console.log('load');
    console.log('get appdata: ' + localStorage.appdata);
    console.log('before load listenerApp: ' + listenerApp)
    if (localStorage.appdata) {
        _.extend(listenerApp, JSON.parse(localStorage.appdata));
    }
    console.log('after load listenerApp: ' + listenerApp)
}

/**
 * save app data (sounds, etc)
 *
 * call this when something that should be saved is changed
 */
function saveApp() {
    console.log('save');
    var appdata = _.pick(listenerApp, 'sounds');
    console.log('appdata: ' + appdata);
    localStorage.setItem('appdata', JSON.stringify(appdata));
}

/**
 * Initialize app
 */
function initApp() {
    console.log('init');
    listenerApp = new ListenerApp();
    loadApp();
}

//window.onload = function () {
//    console.log('window onload');
//    initApp();
//};

/**
 * Notification wrapper
 *
 * notification {
 *     id,
 *     title,
 *     dialNumber,
 *     message,
 * }
 */
function notification(noti) {
    console.log('notification');
    try {
        // TODO::
        // noti from history, to fix from listner page
        function onsuccess() {
            vibrate(true);
            setTimeout(function() {
               vibrate(false);
            }, 2000);
        }
        var app = tizen.application.getCurrentApplication();
        tizen.application.launch(app.appInfo.id, onsuccess);
    } catch (e) {
        console.log (e.name + ": " + e.message);
    }
/*
    var notification = '<div data-role="notification" id="'+ noti.id + '" data-type="ticker"><img src="../res/warning.png"><p>' + noti.message + '</p></div>';
    $('#history').append(notification);
    $('#'+noti.id).notification().on("click", function() {
            $('#'+noti.id).remove();
            if ( noti.vibration == true ) {
                vibrate(false);
            }
        });
    $('#'+noti.id).notification('open');
    if ( noti.vibration == true ) {
        vibrate(true);
    }
*/
}

/**
 * Trigger for vibrate
 *
 * @see http://www.w3.org/TR/2012/WD-vibration-20120202/
 */
var timeID = null;
function vibrate(flag) {
    if ( flag == true ) {
        if ( timeID != null ) {
            clearInterval(timeID);
            timeID = null;
        }
        timeID = setInterval( function() { navigator.vibrate(1000); }, 1000);
        console.log('vibrate on');
    } else {
        if ( timeID != null ) {
            clearInterval(timeID);
            timeID = null;
        }
        navigator.vibrate(0);
        console.log('vibrate off');
    }
}

function sendSocket(data) {
    Cast.cast.send("@"+JSON.stringify(data));
}

/**
 * Alert model
 * @param soundID
 * @param timestamp
 * @class
 */
function Alert(soundID, timestamp) {
    this.soundID = soundID;
    this.timestamp = timestamp;
}

function History(soundID, timestamp) {
    this.soundID = soundID;
    this.timestamp = timestamp;
}

function addNewHistory(soundID, timestamp) {
    var newHistory = new History(soundID, timestamp);
    listenerApp.history.push(newHistory);
}

function getHistoryByID(soundID) {
    for (var i in listenerApp.history ) {
        var history = listenerApp.history[i];
        if (history.soundID == soundID) {
            return history;
        }
    }
    return null;
}

window.addEventListener( 'tizenhwkey', function( ev ) {
    if( ev.keyName === "back" ) {
        window.history.back();
    }
});

document.addEventListener("rotarydetent", function (e) {
    direction = e.detail.direction;
    console.log('rotary', e.detail.direction);
    if (direction === "CCW") {
        window.history.back();
    }
});

initApp();
