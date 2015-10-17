
(function() {
    var mySection = $('script[src="js/eventsource.js"]').get(0).parentNode;

    var source = new EventSource("http://localhost:7001/stream");

    source.addEventListener('message',function (evt) {
        var obj = JSON.parse(evt.data);
        if (obj.type == 'twitter') {
            $('#twitter').html('<div class="news"><strong>'+obj.data.from+'</strong><br />'+obj.data.message+'</div>');
        } else {
            console.log(obj)
        }
    });


    $(mySection).on('action', function () {
        $('[data-slidepanel]', mySection).click();
    });

    $('[data-slidepanel]',mySection).slidepanel({
        orientation: 'bottom',
        mode: 'overlay' // overlay or push
    });
})()
