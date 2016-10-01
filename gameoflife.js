/**
 * @class Point
 * @param {Number} x
 * @param {Number} y
 */
/**
 * @param {Array<Point>} configuration
 */

// 0 dead
// 1 alive
// 2 dead now
// 3 alive now
var run = function (configuration) {
    var currentPosition = {x: 0, y: 0};
    var previousPosition = null;
    var width = window.innerWidth, height = window.innerHeight;
    var width_of_one = 10;//width of one rectangle
    var clicked = false;
    var loopcontinue = true;
    var canvas = window.document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.onmousedown = function () {
        clicked = true;
    };
    canvas.onmouseup = function () {
        clicked = false;
        previousPosition = null;
    };
    window.onkeypress = function (event) {
        if (event.key === 'q')
            loopcontinue = !loopcontinue;
        else if (event.key === '+' && width_of_one < Math.min(width, height))
            width_of_one++;
        else if (event.key === '-' && width_of_one > 1)
            width_of_one--;
    };
    canvas.onmousemove = function (event) {
        if (!clicked)
            return;
        if (previousPosition === null)
            previousPosition = {
                x: event.clientX,
                y: event.clientY
            };
        else {
            currentPosition = {
                x: currentPosition.x + (previousPosition.x - event.clientX),
                y: currentPosition.y + (previousPosition.y - event.clientY)
            };
            previousPosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    };
    /**
     * @type {CanvasRenderingContext2D}
     */
    var context = canvas.getContext('2d');

    var Container = function () {
        this.live = {};
    };
    Container.prototype.add = function (positionX, positionY, state) {
        var posx = positionX.toString();
        var posy = positionY.toString();
        if (!this.live.hasOwnProperty(posy))
            this.live[posy] = {};

        if (this.live[posy].hasOwnProperty(posx) && this.live[posy][posx] === true && state === false)
            return;
        this.live[posy][posx] = state;
    };
    Container.prototype.addLive = function (positionX, positionY) {
        for (var h = positionY - 1; h < positionY + 2; h++)
            for (var w = positionX - 1; w < positionX + 2; w++)
                this.add(w, h, h === positionY && w === positionX);
    };
    Container.prototype.isAlive = function (positionX, positionY) {
        var posx = positionX.toString();
        var posy = positionY.toString();
        if (!this.live.hasOwnProperty(posy))
            return false;
        if (!this.live[posy].hasOwnProperty(posx))
            return false;
        return this.live[posy][posx];
    };
    Container.prototype.mytraverse = function (callback) {
        for (var h in this.live)
            if (this.live.hasOwnProperty(h)) {
                var ypos = Number(h);
                for (var w in this.live[h])
                    if (this.live[h].hasOwnProperty(w))
                        callback(Number(w), ypos, this.live[h][w]);
            }
    };
    var Alive = new Container();

    for (var i = 0; i < configuration.length; i++) {
        Alive.addLive(configuration[i].x, configuration[i].y);
    }


    var render = function () {
        context.fillStyle = '#000000';
        context.fillRect(0, 0, width, height);
        context.fillStyle = '#FFFFFF';
        var startx = Math.floor(currentPosition.x / width_of_one);
        var starty = Math.floor(currentPosition.y / width_of_one);
        var howManyRectX = Math.ceil(width / width_of_one) + 1;
        var howManyRectY = Math.ceil(height / width_of_one) + 1;
        var shiftX = (-1) * currentPosition.x % width_of_one;
        var shiftY = (-1) * currentPosition.y % width_of_one;
        for (var h = 0; h < howManyRectY; h++)
            for (var w = 0; w < howManyRectX; w++)
                if (Alive.isAlive(w + startx, h + starty)) {
                    context.fillRect(shiftX + w * width_of_one,
                                     shiftY + h * width_of_one,
                                     width_of_one,
                                     width_of_one)
                }
    };

    var update = function () {
        var temp = new Container();
        Alive.mytraverse(function (xpos, ypos, state) {
            var liveAround = 0;
            for (var h = ypos - 1; h < ypos + 2; h++)
                for (var w = xpos - 1; w < xpos + 2; w++)
                    if (!(h === ypos && w === xpos))
                        if (Alive.isAlive(w, h) === true)
                            liveAround++;
            if (liveAround < 2 || liveAround > 3)
                return; //do nothing, because is dead
            else if ((liveAround === 2 || liveAround === 3) && state === true)
                temp.addLive(xpos, ypos); //stay alive
            else if (liveAround === 3 && state === false)
                temp.addLive(xpos, ypos); //born new
        });
        Alive = temp;
    };

    var cycling = function () {
        if (loopcontinue) {
            update();
        }
        render();
        window.requestAnimationFrame(cycling);
    };
    //setInterval(cycling,0);
    cycling();
    //render();
};


window.onload = function () {
    var inputs = [];
    for (var h = 10; h < 20; h++)
        for (var w = 0; w < 20; w++)
            inputs.push({
                            x: w,
                            y: h
                        })

    //squere
    //run(inputs);
    //rect
    //run([{x: 4, y: 4}, {x: 4, y: 5}, {x: 5, y: 4}, {x: 5, y: 5}]);
    //walking
    //run([{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:2,y:-1},{x:1,y:-2}]);
    //10 in row
    //run([{x:10,y:10},{x:11,y:10},{x:12,y:10},{x:13,y:10},{x:14,y:10},{x:15,y:10},{x:16,y:10},{x:17,y:10},{x:18,y:10},{x:19,y:10}]);
    // exploder
    /*run([{x: 10, y: 10},
     {x: 10, y: 11},
     {x: 10, y: 12},
     {x: 10, y: 13},
     {x: 10, y: 14},
     {x: 14, y: 10},
     {x: 14, y: 11},
     {x: 14, y: 12},
     {x: 14, y: 13},
     {x: 19, y: 14},
     {x: 12, y: 10},
     {x: 12, y: 14}]);*/
    //gun
    run([{x: 10, y: 10}, //rect left
            {x: 11, y: 10},
            {x: 10, y: 11},
            {x: 11, y: 11},
            {x: 19, y: 10},  //diamond left
            {x: 20, y: 10},
            {x: 20, y: 11},
            {x: 19, y: 12},
            {x: 18, y: 12},
            {x: 18, y: 11},
            {x: 26, y: 12}, //ship left
            {x: 26, y: 13},
            {x: 26, y: 14},
            {x: 27, y: 12},
            {x: 28, y: 13},
            {x: 32, y: 10}, //diamond right
            {x: 33, y: 10},
            {x: 32, y: 9},
            {x: 33, y: 8},
            {x: 34, y: 9},
            {x: 34, y: 8},
            {x: 44, y: 8}, //rect right
            {x: 45, y: 8},
            {x: 44, y: 9},
            {x: 45, y: 9},
            {x: 45, y: 15}, //ship right
            {x: 45, y: 16},
            {x: 45, y: 17},
            {x: 46, y: 15},
            {x: 47, y: 16},
            {x: 34, y: 20}, //ship down
            {x: 35, y: 20},
            {x: 36, y: 20},
            {x: 34, y: 21},
            {x: 35, y: 22}]);
};