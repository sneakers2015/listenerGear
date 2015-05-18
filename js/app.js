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
        // update sound list
//        SoundListControl.updateSoundList();
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
//    SoundListControl.updateSoundList();
    var appdata = _.pick(listenerApp, 'sounds');
    console.log('appdata: ' + appdata);
    localStorage.setItem('appdata', JSON.stringify(appdata));
    // FIXME:: for wearable
    //startMatching();
}

/**
 * Initialize app
 */
function initApp() {
    console.log('init');
    listenerApp = new ListenerApp();
    loadApp();
    // FIXME:: for wearable
    //init_Matcher();
}
//
//window.onload = function () {
//    console.log('window onload');
//    initApp();
//};

function startMatching() {
    var onSounds = _.filter(listenerApp.sounds, function (sound) { return sound.enabled; });
    var soundArray = _.toArray(onSounds);
    var samplePackages = _.pluck(soundArray, 'samplePackage');
    console.log('samplePackages: ' + samplePackages);
    console.log("startMatching(packages, sampleMatched); length: " + samplePackages.length);
    matcher.startMatching(samplePackages, function (sampleIndex) {
        var sound = soundArray[sampleIndex];
        console.log("sample matched index: " + sampleIndex + ", sound: " + sound.id +' , '+ sound.title);
        listenerApp.emit('soundMatched', sound.id);
    });
}

function stopMatching() {
    console.log("stopMatching();");
    matcher.stopMatching();
}

/**
 * Initialize for Matcher
 */
var matcher;
function init_Matcher() {
    matcher = new Matcher();
    startMatching();
}

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
    console.log('notification: ' + noti.id + ' : ' + noti.title + ' : ' + noti.dialNumber + ' : ' + noti.message);
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

/**
 * Send SMS
 *
 * @see http://tools.ietf.org/html/rfc5724
 */
function sendSMS(number, msg) {
    console.log('send sms: ' + number + ',' + msg);
    // Tizen wearable is not support sms protocol.
    // var sms = 'smsto:+' + number + '?body=' + msg;
    // window.location.href = sms;

    var location = getLocation();
    var data = {
            time: (new Date()).toLocaleTimeString(),
            number: number,
            msg: msg,
            location: location
    }

    // send msg notification
    Cast.cast.send(JSON.stringify(data));
}

/**
 * getLocation
 */
function getLocation() {
    if (navigator.geolocation) {
        console.log('geolocation')
        navigator.geolocation.getCurrentPosition(function showPosition(position) {
            console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
            return position;
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
    return null;
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
