var mySection = $('script[src="js/h2demo.js"]').get(0).parentNode;

$('div.btn',mySection).click(function (e) {
    e.preventDefault();

    var url = $(this).data('url');
    var iframe = $('iframe',mySection);

    iframe.attr('src',url);
    $('div.btn',mySection).removeClass('active');
    $(this).addClass('active');
});

