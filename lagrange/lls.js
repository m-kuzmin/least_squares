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

class Lagrange {
    constructor(datapoints) {
        this.data = datapoints;
        this.ws = [];
        this._updateWeights();
    }
    addPoint(point) {
        this.data.push(point);
        this._updateWeights();
    }

    _updateWeights() {
        var len = this.data.length;
        var w;

        for (var j = 0; j < len; ++j) {
            w = 1;
            for (var i = 0; i < len; ++i) {
                if (i != j) {
                    w *= this.data[j].x - this.data[i].x;
                }
            }
            this.ws[j] = 1/w;
        }
    }
    valueOf(x) {
        var a = 0;
        var b = 0;
        var c = 0;

        for (var j = 0; j < this.data.length; ++j) {
            if (x != this.data[j].x) {
                a = this.ws[j] / (x - this.data[j].x);
                b += a * this.data[j].y;
                c += a;
            } else {
                return this.data[j].y;
            }
        }

        return b / c
    }
}

function draw_chart() {
    var data = collect_data();
    if (data.length <= 1) {
        document.querySelector('#solution').hidden = true;
        return;
    } else {
        document.getElementById('solution').hidden = false;
    }

    let lgr = new Lagrange(data);

    let lgr_fn = [];
    for (var i = 0; i <= data.length * 5; i++) {
        var step = (Math.abs(data[data.length - 1].x - data[0].x) / (data.length * 5)) * i;
        var y = lgr.valueOf(data[0].x + step);
        if (y == NaN) {
            continue;
        }
        lgr_fn.push(new Datapoint(data[0].x + step, y));
    }

    let real_fn = [];
    for (var i = 0; i< lgr_fn.length; i++) {
        real_fn.push(new Datapoint(lgr_fn[i].x, Math.sqrt(lgr_fn[i].x, 2) + 2));
    }

    let chartStatus = Chart.getChart("chart");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }


    var canvas = document.getElementById('chart');
    var ctx = canvas.getContext('2d');

    var mixedChart = new Chart(ctx, {
        data: {
            datasets: [ {
                type: 'scatter',
                backgroundColor: '#CE2881',
                borderColor: '#f9f',
                label: 'Data points',
                data: data
            }, {
                type: 'line',
                backgroundColor: '#2881CE',
                borderColor: '#9ACEEB',
                label: 'Interpolation',
                data: lgr_fn,
                tension: .5
            }, {
                type: 'line',
                backgroundColor: '#4e5',
                borderColor: '#4b9',
                label: 'y = sqrt(x, 2) + 2',
                data: real_fn,
                tension: .5
            }],
        }
    });

    var err = 0;
    for (var i = 0; i < data.length; i++) {
        var point = data[i];
        var e = lgr.valueOf(point.x) - Math.sqrt(point.x, 2) + 2;
        err += e * e;
    }
    err = Math.pow(err / data.length, .5).toFixed(6);
    document.getElementById('av_error').innerHTML = `Average error: ${err}`;   document.getElementById('av_error').innerHTML = `Average error: ${err}`;
}

function calc_at_x() {
    var data = collect_data();
    let lgr = new Lagrange(data);
    document.getElementById('value_of_x').value = lgr.valueOf(parseInt(document.getElementById('x_point').value));
}
