var Cast = (function() {
    var cast = new Broadcast(function(msg) {
        console.log('receive msg: ' + msg);
        if (strStartsWith(msg, '@')) {
        	
        } else {
        	var messageObj = JSON.parse(msg);
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