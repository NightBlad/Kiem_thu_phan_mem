/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3079584775086505, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06, 500, 1500, "Search Page Request"], "isController": false}, {"data": [0.019230769230769232, 500, 1500, "Main Page"], "isController": false}, {"data": [0.92, 500, 1500, "Search Page Request-0"], "isController": false}, {"data": [0.14, 500, 1500, "Search Page Request-1"], "isController": false}, {"data": [0.105, 500, 1500, "Home Page Request"], "isController": false}, {"data": [0.057692307692307696, 500, 1500, "Main Page-1"], "isController": false}, {"data": [0.003424657534246575, 500, 1500, "Portal:Science"], "isController": false}, {"data": [0.0136986301369863, 500, 1500, "Portal:Science-1"], "isController": false}, {"data": [0.8589743589743589, 500, 1500, "Main Page-0"], "isController": false}, {"data": [0.9657534246575342, 500, 1500, "Portal:Science-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1156, 0, 0.0, 2635.2326989619405, 59, 23711, 2290.0, 5348.9, 7104.849999999998, 11854.400000000012, 18.42642183116552, 3082.0149677318445, 8.160062603608774], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Search Page Request", 50, 0, 0.0, 3781.96, 1297, 23711, 2834.0, 5347.1, 13789.099999999937, 23711.0, 1.3843512929841078, 79.09174766563763, 1.069357297607841], "isController": false}, {"data": ["Main Page", 156, 0, 0.0, 3407.128205128205, 1162, 14524, 2801.5, 6528.8, 7646.05, 12306.130000000026, 2.5183224098408292, 576.089267769509, 1.4091784578503859], "isController": false}, {"data": ["Search Page Request-0", 50, 0, 0.0, 360.52000000000004, 102, 3439, 222.0, 938.3999999999996, 1092.1499999999992, 3439.0, 1.6606330333122985, 2.34233586718257, 0.6859841534092795], "isController": false}, {"data": ["Search Page Request-1", 50, 0, 0.0, 3420.56, 978, 23490, 2526.0, 5200.4, 13153.549999999934, 23490.0, 1.3998544151408254, 78.00297753408644, 0.5030726804412341], "isController": false}, {"data": ["Home Page Request", 100, 0, 0.0, 4009.8700000000013, 308, 15842, 3404.5, 8364.800000000001, 9694.8, 15811.619999999984, 2.055413960371619, 392.9373407054181, 0.39341907835238016], "isController": false}, {"data": ["Main Page-1", 156, 0, 0.0, 2937.5897435897436, 901, 13948, 2498.0, 5024.700000000005, 6728.9000000000015, 11599.600000000028, 2.543450614667232, 577.2788390207714, 0.9016333721916066], "isController": false}, {"data": ["Portal:Science", 146, 0, 0.0, 4124.287671232875, 1454, 17598, 3438.0, 6303.9000000000015, 8969.750000000004, 14946.730000000007, 2.3847636470549802, 793.4237730615628, 1.967895782970174], "isController": false}, {"data": ["Portal:Science-1", 146, 0, 0.0, 3895.034246575344, 1105, 17389, 3260.5, 6143.100000000001, 8240.600000000002, 14751.360000000006, 2.4009998684383635, 795.8687590448625, 0.9894745551572162], "isController": false}, {"data": ["Main Page-0", 156, 0, 0.0, 468.97435897435895, 59, 4859, 214.5, 1039.4000000000026, 2104.900000000002, 4771.790000000001, 2.596754057428215, 4.6542733042030795, 0.5325374531835205], "isController": false}, {"data": ["Portal:Science-0", 146, 0, 0.0, 228.99315068493144, 62, 3145, 179.0, 322.4000000000001, 566.0500000000002, 2171.6300000000024, 2.493850778901339, 3.0712410217101667, 1.030174686987565], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1156, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
