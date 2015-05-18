var Cast = (function() {
    var cast = new Broadcast(function(msg) {
        console.log('receive msg: ' + msg);
        if (strStartsWith(msg, '#')) {
            var messageObj = JSON.parse(msg.substr(1));
            if (messageObj) {
                HistoryControl.receiveMessageHandler(messageObj);
            } else {
                console.log('not match');
            }
        } 
    });

    function strStartsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }

    return {
        cast : cast
    }
}());