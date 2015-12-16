
(function() {
    var mySection = $('script[src="js/eventsource.js"]').get(0).parentNode;
    var state = {
        subscriptions: '',
        sourceUrl: 'http://localhost:7001/stream'
    };
    var source = new EventSource(state.sourceUrl);

    source.addEventListener('twitter',function (evt) {
        var obj = JSON.parse(evt.data);
        $('#twitter').html('<div class="news">'+
            '<strong>'+obj.from+'</strong>'
            +'<br />'+obj.message
            +'</div>'
        );
    });

    source.addEventListener('subscriptions',function (evt) {
        state.subscriptions = evt.data;
        $(document).trigger('state',state);
    });

    $(mySection).on('getstate', function () {
        $(document).trigger('state',state);
    });

    $(mySection).on('action', function () {
        $('[data-slidepanel]', mySection).click();
        $(document).trigger('state',state);
    });

    $('[data-slidepanel]',mySection).slidepanel({
        orientation: 'bottom',
        mode: 'overlay' // overlay or push
    });
})()
