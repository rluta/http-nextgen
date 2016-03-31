(function() {
    d3.csv("data/blink-perf.txt",function(error,data) {
        var obj={};
        data.forEach(function (d) {
            if (!obj.hasOwnProperty(d.category)) obj[d.category]=0;
            obj[d.category]+=parseFloat(d.elapsed);
        });
        var finalData = Object.keys(obj).map(function (k) { return {name:k,value:obj[k]}}).sort(function (a,b) {
            return a.value- b.value;
        });
        //Donut chart example
        nv.addGraph(function() {
            var chart = nv.models.pieChart()
                    .x(function(d) { return d.name })
                    .y(function(d) { return d.value })
                    .showLabels(true)     //Display pie labels
                    .labelThreshold(.03)  //Configure the minimum slice size for labels to show up
                    .labelType("value") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                    .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                ;

            d3.select("svg#speed-chart")
                .datum(finalData)
                .transition().duration(350)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    });

}());
