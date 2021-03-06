window = document = this;
importScripts('sockjs-min-0.3.4.js');
importScripts('vertxbus.js');

var eb = null;
var config = {
    hostUrl:  'http://127.0.0.1:4242/eventbus', // default vertx URL
    queries: 'amour'
};

// Vertx event bus handling
function init(onOpen) {

    eb = new vertx.EventBus(config.hostUrl);

    eb.onopen = function() {
        if (typeof(onOpen) == 'function') onOpen();
    };

    eb.onclose = function() {
        eb = null;
    };
}


function updateQuery(query) {
    self.postMessage({type:'debug',data:query});
    var q = (query)?query.split(','):null;
    if (eb == null) {
        init(function () {
            eb.send('twitter',{query:q}, function (reply) {
                self.postMessage({type:'debug',data:reply})
                self.postMessage({type:'query',data:reply.join(',')})
            });
        });
    } else {
        eb.send('twitter',{query:q}, function (reply) {
            self.postMessage({type:'debug',data:reply})
            self.postMessage({type:'query',data:reply.join(',')})
        });
    }
}

// Worker API with main script
self.addEventListener('message',function (event) {
    var message = event.data;

    if (message.type == 'query')  {
        updateQuery(message.data)
    }

},false);
