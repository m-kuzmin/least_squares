class Datapoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class LinearMathFn {
    constructor(mul, offset) {
        this.mul = mul;
        this.offset = offset
    }
}

/**
 * Computes linear least squares for emperical function.
 * @param {[Datapoint]} data - Data points describing a function
 * @returns {LinearMathFn} - a math function definition that approximates the input data
 *
 * # Usage
 *
 * ```js
 * lls([new Datapoint(1, 1), new Datapoint(2, 2)]);
 * ```
 */
function lls(data) {
    var len = data.length;

    if (len === 0) {
        return null;
    }

    var x_sum = 0;
    var y_sum = 0;
    var xy_sum = 0;
    var xx_sum = 0;

    data.forEach(
        function (value, _, _) {
            var x = value.x;
            var y = value.y;
            x_sum += x;
            y_sum += y;
            xx_sum += x*x;
            xy_sum += x*y;
        }
    );

    var mul = (len*xy_sum - x_sum*y_sum) / (len*xx_sum - x_sum*x_sum);
    var offset = (y_sum/len) - (mul*x_sum)/len;
    return new LinearMathFn(mul, offset);
}

function draw_chart() {
    var data = collect_data();
    if (data.length == 0) {
        document.getElementById('solution').hidden = true;
        return;
    } else {
       document.getElementById('solution').hidden = false;
    }

    var fn = lls(data);
    var canvas = document.getElementById('chart');
    var ctx = canvas.getContext('2d');

    fn = [
        { x: Math.floor(data[0].x - 1),
          y: Math.floor(data[0].x - 1) * fn.mul + fn.offset},
        { x: Math.ceil(data[data.length -1 ].x + 1),
          y: Math.ceil(data[data.length -1 ].x + 1) * fn.mul + fn.offset}
    ];

    let chartStatus = Chart.getChart("chart");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    var mixedChart = new Chart(ctx, {
        data: {
            datasets: [ {
                type: 'scatter',
                backgroundColor: '#000',
                borderColor: '#888',
                label: 'Data points',
                data: data
            }, {
                type: 'line',
                backgroundColor: '#2881CE',
                borderColor: '#9ACEEB',
                label: 'Linear Approximation',
                data: fn
            }],
        }
    });
}
