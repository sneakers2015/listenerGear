var Cast = (function() {
    var cast = new Broadcast(function(msg) {
        console.log('receive msg: ' + msg);

        if (strStartsWith(msg, "#")) {
            // number
            var num = parseInt(msg.substr(1));
            console.log('listenerApp.emit(soundMatched, ' + num +')');
            listenerApp.emit('soundMatched', num);
        } else if (strStartsWith(msg, "@")) {
            // string
            // do nothing
            var str = parseInt(msg.substr(1));
        } else {
            console.log('not match');
        }
    });

    function strStartsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }

    return {
        cast : cast
    }
}());