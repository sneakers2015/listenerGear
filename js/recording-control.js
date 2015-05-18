var RecordingControlUI = (function() {
    console.log('init');

    var page = document.getElementById( "recording-sound-page" );
    var pageSoundInfo = document.getElementById( "page-sound-info" );

    var headerBtn = page.querySelector('ui-header');

    var eualizer_bg = page.querySelector('.recording-page-equalizer-bg');
    var btn_play = page.querySelector( "#recording-page-play-btn" );
    var CLASS_RECORDING = 'recording-btn-recording';
    var CLASS_NORMAL = 'recording-btn-normal';

    function getState () {
        if ($(btn_play).hasClass(CLASS_RECORDING)) {
            return 'recording';
        }
        return 'normal';
    }

    function setState (state) {
        if (state === 'recording') {
            $(btn_play).addClass(CLASS_RECORDING);
            $(btn_play).removeClass(CLASS_NORMAL);
            $(eualizer_bg).css('display', 'block');
        } else {
            $(btn_play).addClass(CLASS_NORMAL);
            $(btn_play).removeClass(CLASS_RECORDING);
            $(eualizer_bg).css('display', 'none');
            _handleEndOfRecord(); //TODO : FIXME
//            tau.changePage(pageSoundInfo);
//            tau.back();
        }
    }

    function _handleEndOfRecord () {
        var newSoundID = generateNewSoundID();
        var defaultTitle = 'Sound Sample #' + newSoundID;
        var randomDial = _.random(0, 100);
        var newSound = addNewSound(defaultTitle, null, null, randomDial, 'msg');
        if (newSound) {
            SoundInfoControl.openModifySoundPage(newSound.id);
        }
        
//        updateSoundList();
    }
//
//
//    function updateIcon() {
//        if (getSate() === 'recording') {
//            $(btn_play).addClass(CLASS_RECORDING);
//        } else {
//            $(btn_play).removeClass(CLASS_RECORDING);
//        }
//    }
//

    var _handleInterval = function () {
        var r = _.random(0, 255)
        var g = _.random(0, 255);
        var b = _.random(0, 255);
        var a = _.random(0, 100);
        a = 255;
        $(eualizer_bg).css('background-color', 'RGBA(' +  r + ',' + g + ',' + b + ',' + a + ')');
    }

    var intervalId;

    function startRecord () {
        _handleInterval();
        intervalId = setInterval(_handleInterval, 1000);
        $(eualizer_bg).css('display', 'block');
    }

    function endRecord () {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            $(eualizer_bg).css('display', 'none');
        }
    }

    btn_play.addEventListener('click', function(ev) {
        if (getState() === 'recording') {
            endRecord();
            setState ('normal');
        } else {
            startRecord();
            setState('recording');
            
        }
    });

    page.addEventListener( "pagebeforeshow", function() {
        $(btn_play).removeClass(CLASS_RECORDING);
        $(eualizer_bg).css('display', 'none');
    });

    return {
    }
}());
