(function() {
    var mySection = $('script[src="js/hpack.js"]').get(0).parentNode;

    var sceneState = {
        headerIn:[],
        headerOut:[],
        lookupIn:[],
        lookupOut:[],
        frame:[]
    };

    var headerIn = d3.select("div.hpack-demo",mySection).append('div')
        .attr('id','hpack-header-in')
        .attr('class','hpack-header');

    var headerOut = d3.select("div.hpack-demo",mySection).append('div')
        .attr('id','hpack-header-out')
        .attr('class','hpack-header');

    var lookupIn = d3.select("div.hpack-demo",mySection).append('div')
        .attr('id','hpack-lookup-in')
        .attr('class','hpack-table');

    var lookupOut = d3.select("div.hpack-demo",mySection).append('div')
        .attr('id','hpack-lookup-out')
        .attr('class','hpack-table');

    var frame = d3.select("div.hpack-demo",mySection).append('div')
        .attr('id','hpack-frame')
        .attr('class','hpack-frame');

    var requests = [
        [
            {name:':authority',value:'localhost:9000'},
            {name:':method',value:'GET'},
            {name:':path',value:'/'},
            {name:':scheme',value:'https'},
            {name:'User-Agent',value:'NSS Enterprise (NCC 1202)'},
            {name:'Accept',value:'teleporter/beam, phase/stun, shields/*'},
            {name:'Cookie',value:'type=chocolate_chip_level_1'},
            {name:'Cookie',value:'sessionid=FDE3461A0371391133'}
        ],
        [
            {name:':authority',value:'localhost:9000'},
            {name:':method',value:'GET'},
            {name:':path',value:'/style.css'},
            {name:':scheme',value:'https'},
            {name:'User-Agent',value:'NSS Enterprise (NCC 1202)'},
            {name:'Accept',value:'teleporter/beam, phase/stun, shields/*'},
            {name:'Cookie',value:'type=chocolate_chip_level_1'},
            {name:'Cookie',value:'sessionid=FDE3461A0371391133'}
        ],
        [
            {name:':authority',value:'localhost:9000'},
            {name:':method',value:'GET'},
            {name:':path',value:'/style.js'},
            {name:':scheme',value:'https'},
            {name:'User-Agent',value:'NSS Enterprise (NCC 1202)'},
            {name:'Accept',value:'teleporter/beam, phase/stun, shields/*'},
            {name:'Cookie',value:'type=chocolate_chip_level_1'},
            {name:'Cookie',value:'sessionid=FDE3461A0371391133'}
        ]
    ];
    var access = function (prop) { return function (obj) { return obj[prop]} };
    var nameAccess = access('name');
    var valueAccess = access('value');

    function asMap(myArray) {
        var res={};
        myArray.forEach(function (obj) {res[obj.name]=obj.value})
        return res;
    }

    function asArray(myMap) {
        return Object.keys(myMap).map(function (key) { return {name:key,value:mymap[key]}; });
    }

    function update(encoded,lookupState) {
        encoded.forEach(function (obj) { lookupState[obj.name]=obj.value; })
    }

    function load(request) {
        sceneState.headerIn = request;
        sceneState.headerOut=[];
    }

    function encode(request) {
        sceneState.frame = request.filter(function (d) {
            return !sceneState.lookupIn.contains(d)
        });
    }

    function decode(request) {
        var keys = header.map(function (d) { return d.name;});
        return header.concat(
            Object.keys(lookupState)
                .filter(function (d) { return keys.indexOf(d) === -1})
                .map(function (d) { return {name:d,value:lookupState[d]} })
        );
    }

    function send(request) {
        sceneState.frame.forEach( function (d) {
        })
        var headerKeys = request.map(nameAccess);
        sceneState.lookupIn = sceneState.headerIn.concat(sceneState.lookupIn.filter(function (d) {
            return headerKeys.indexOf(d.name) < 0
        }));
    }

    function unload(request) {
        sceneState.frame=[];
        sceneState.headerIn=[];
    }

    var sequence = [load,encode,send,decode,unload];

    function updateScene() {
        var hIn = headerIn.selectAll('div.header').data(sceneState.headerIn,nameAccess);
        hIn.enter().append('div').attr('class','header');
        hIn.html(function (d) {
            return '<span class="header-name">'+d.name+'</span>' +
                '<span class="header-value">'+ d.value+'</span>';
        });
        hIn.exit().remove();

        var hOut = headerOut.selectAll('div.header').data(sceneState.headerOut,nameAccess);
        hOut.enter().append('div').attr('class','header');
        hOut.html(function (d) {
            return '<span class="header-name">'+d.name+'</span>' +
                '<span class="header-value">'+ d.value+'</span>';
        });
        hOut.exit().remove();

        var lIn = lookupIn.selectAll('div.lookup').data(sceneState.lookupIn,nameAccess);
        lIn.enter().append('div').attr('class','lookup');
        lIn.html(function (d) {
            return '<span class="lookup-name">'+d.name+'</span>' +
                '<span class="lookup-value">'+ d.value+'</span>';
        });
        lIn.exit().remove();

        var lOut = lookupIn.selectAll('div.lookup').data(sceneState.lookupOut,nameAccess);
        lOut.enter().append('div').attr('class','lookup');
        lOut.html(function (d) {
            return '<span class="lookup-name">'+d.name+'</span>' +
                '<span class="lookup-value">'+ d.value+'</span>';
        });
        lOut.exit().remove();

        var fr = frame.selectAll('div.frame').data(sceneState.frame);
        fr.enter().append('div').attr('class','frame');
        fr.html(function (d) {
            return '<span class="lookup-name">'+d.name+'</span>' +
                '<span class="lookup-value">'+ d.value+'</span>';
        });
        fr.exit().remove();
    }

    updateScene();

    var requestIdx=0;
    var sequenceIdx=0;

    $(mySection).on('action', function () {
        var currentReq = requests[requestIdx];
        var action=sequence[sequenceIdx];
        action(currentReq);
        updateScene();
        sequenceIdx = (sequenceIdx + 1) % sequence.length;
        requestIdx += (sequenceIdx == 0) ? 1 : 0;
        requestIdx = requestIdx % requests.length;
    });
}());
