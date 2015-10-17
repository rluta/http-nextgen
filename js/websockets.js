(function() {
    var mySection = $('script[src="js/websockets.js"]').get(0).parentNode;

    var wsUrl = "wss://demo.aptiwan.com/ws";
    var ws_me = 'Unknown';
    var ws = null;
    var useRaw = false;

    function connect(url,onOpen) {
        "use strict";

        if (ws != null) {
            ws.close();
            ws = null;
        }
        var local = new WebSocket(url);
        local.addEventListener('open', function (evt) {
            log(null, 'Connected to '+url,'command');
            local.isConnected = true;
            if (typeof(onOpen) == 'function') onOpen(local)
        });

        local.addEventListener('close', function (evt) {
            log(null, 'Disconnected from '+url,'command');
            local.isConnected = false;
        });

        local.addEventListener('message', function (evt) {
            receiveMessage(evt.data);
        });

        return local
    }

    $('#ws form').on('submit',function (evt) {
        evt.preventDefault();

        var textInput = $('#ws input[type="text"]');
        var text = textInput.val();
        if (text) {
            if (text.substring(0,5) == '/name') {
                ws_me = text.substring(6);
                log(null, 'Name changed to ' + ws_me, 'command');
            } else if (text.substring(0,8) == '/connect') {
                if (ws != null) ws.close();
                var url = text.substring(9);
                if (url != null && url.substring(0,2) == 'ws') wsUrl = url;
                ws = connect(wsUrl);
            } else if (text.substring(0,11) == '/disconnect') {
                if (ws != null) ws.close();
            } else if (text.substring(0,4) == '/raw') {
                useRaw = !useRaw
                if (useRaw)
                    log(null,'Raw mode active','command')
                else
                    log(null,'Chat mode active','command')
            } else {
                var msg;
                if (useRaw)
                    msg = text;
                else
                    msg = ws_me+'>'+text;

                if (ws == null || !ws.isConnected)
                    connect(wsUrl,function (ws) {
                        "use strict";
                        ws.send(msg);
                    });
                else
                    ws.send(msg);
                if (useRaw)
                    log(null,msg,'self');
                else
                    log(ws_me,text,'self');
            }
            textInput.val('');
            textInput.focus()
        }
    });

    function receiveMessage(text) {
        if (useRaw)
            log(null,text,'remote');
        else {
            var idx =text.indexOf('>');
            var name = text.substring(0,idx);
            var msg = text.substring(idx+1);

            log(name,msg,'remote');

        }
    }

    function log(name, msg, type) {
        $('#log').append('<div class="chat '+type+'">'+((name)?'<span class="name">'+name+' :</span> ':'')+msg+'</div>');
        var scrollDiff = $('#log').height() - $('#log').parent().height();
        if (scrollDiff > 0) {
            $('#log').parent().scrollTop(scrollDiff);
        }
    }

    ws = connect(wsUrl);

    $(mySection).on('action', function () {
        $('[data-slidepanel]', mySection).click();
    });

    $('[data-slidepanel]',mySection).slidepanel({
        orientation: 'bottom',
        mode: 'overlay' // overlay or push
    });

    $(mySection).on('connect', function (evt) {
        "use strict";
        wsUrl = evt.data.url;
        connect(wsUrl, function () {
            log(null, 'Connected to '+wsUrl);
        });
    });
})()
