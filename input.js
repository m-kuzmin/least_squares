function append_point(datapoint) {
    var list = document.querySelector("#table_list");
    var element = document.createElement('li');
    element.classList.add('xy-point');

    var x = "";
    var y = "";
    if (datapoint !=null && datapoint.x != null && datapoint.y != null) {
        x = datapoint.x;
        y = datapoint.y;
    }

    element.innerHTML = `\
<label class="titlefont" style="margin-left: .5em;">x:</label>\
<input type="text" class="point_table_x" value="${x}"/>\
<label class="titlefont">y:</label>\
<input type="text" class="point_table_y" value="${y}"/>\
<button class="btn btn-red" onclick="delete_point(this)"><i class="fa fa-trash"></i></button>`;

    list.appendChild(element);
}

function delete_point(element) {
    element.parentElement.parentElement.removeChild(element.parentElement);
}

function clear_points() {
    var list = document.querySelector("#table_list");
    while (list.lastChild) {
        list.removeChild(list.lastChild);
    }
}

function load_sample() {

    const data = [
        new Datapoint(1.1, 3.2),
        new Datapoint(2.0, 4.1),
        new Datapoint(3.2, 5.3),
        new Datapoint(4.3, 6.0),
        new Datapoint(5.2, 6.3),
        new Datapoint(6.5, 6.7),
        new Datapoint(7.6, 7.0)
    ];

    clear_points();

    data.forEach(function (value, _, _) {
        append_point(value);
    })
}

function collect_data() {
    var data = [];

    var list = document.querySelector("#table_list").children;
    for (var i = 0; i < list.length; i++) {
        var child = list[i].children;
        var x = child[1].value;
        var y = child[3].value;

        if (isNaN(Number(x)) || x.trim() =='' || isNaN(Number(y)) || y.trim() == '') {
            list[i].remove();
            continue;
        }

        var datapoint = new Datapoint(Number(x), Number(y));
        data.push(datapoint);
    }

    if (data.length == 0) {
        clear_points();
        append_point();
    }
    return data;
}
