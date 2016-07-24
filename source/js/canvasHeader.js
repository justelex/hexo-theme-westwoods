/**
 * JavaScript Canvas Animation for the Header
 *
 * @author MoritzKn
 * @license MIT
 */

(function(debug) {
    'use strict';

    var canvas = document.getElementById('canvasHeader');
    var ctx = canvas.getContext('2d');

    /**
     * returns the value if it is between the minimum and maximum,
     * minimum if smaller and maximum if bigger.
     * @param  {number} value
     * @param  {number} min
     * @param  {number} max
     * @return {number}
     */
    var limit = function (value, min, max) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    };


    /**
     * Creates a new point
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @constructor
     */
    var Point = function (x, y){
        this.x = x || 0;
        this.y = y || 0;
    };

    Point.prototype.move = function (vector) {
        return new Point(this.x + vector.x, this.y + vector.y);
    };

    /**
     * true if x and y are the same on the compared point
     * @param  {Point}   point
     * @return {boolean}
     */
    Point.prototype.isEqual = function (point) {
        return this.x === point.x
            && this.y === point.y;
    };

    /**
     * Creates a new vector
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @constructor
     */
    var Vector = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    /**
     * returns the vector between to points
     * @param  {Point} p1
     * @param  {Point} p2
     * @return {Vector}
     */
    Vector.fromPoints = function (p1, p2) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        return new Vector(x, y);
    };

    /**
     * length of the vector
     * @return {number}
     */
    Vector.prototype.getDistance = function () {
        return Math.abs(Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    };

    /**
     * returns normalized vector
     * @return {Vector}
     */
    Vector.prototype.normalized = function () {
        var dist = this.getDistance();
        return new Vector(this.x / dist, this.y / dist);
    };

    /**
     * @return {Vector} - inverted vector
     */
    Vector.prototype.invert = function () {
        return new Vector(this.x * -1, this.y * -1);
    };

    /**
     * multiply x and y of this vector with another vector
     * @param  {Vector} vector - vector to multiply
     * @return {Vector} the new vector
     */
    Vector.prototype.multiply = function (vector) {
        return new Vector(this.x * vector.x, this.y * vector.y);
    };

    Vector.prototype.multiplyScalar = function (n) {
        return new Vector(this.x * n, this.y * n);
    };

    /**
     * Creates a line
     * @param {Point} p1
     * @param {Point} p2
     * @constructor
     */
    var Line = function (p1, p2) {
      this.p1 = p1;
      this.p2 = p2;
    };

    /**
     * Vector from the first point for the line to the second
     * @return {Vector}
     */
    Line.prototype.getVector = function () {
      return Vector.fromPoints(this.p1, this.p2);
    };

    Line.prototype.getCenter = function () {
      var x = this.p2.x + (this.p1.x - this.p2.x) / 2;
      var y = this.p2.y + (this.p1.y - this.p2.y) / 2;
      return new Point(x, y);
    };

    Line.prototype.getLength = function () {
      return this.getVector().getDistance();
    };


    /**
     * Creates a polygon
     * @param {Array<Point>} points - Corners of the polygon
     * @param {Color} [color=Black] - Fill color of the polygon
     * @constructor
     */
    var Polygon = function (points, color, borderColor){
      this.points = points || [];
      this.color = color || new Color();
      this.borderColor = borderColor;
    };

    // FIXME: Shouldn't be a method of Polygon. Maybe canvas.drawPolygon instead?
    Polygon.prototype.fill = function (){
        ctx.fillStyle = this.color.toString();
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        this.points.forEach(function (point, i){
            ctx.lineTo(point.x, point.y);
        });

        ctx.closePath();
        ctx.fill();

        if (this.borderColor) {
            ctx.strokeStyle = this.borderColor.toString();
            ctx.stroke();
        }

        if (debug) {
            ctx.font = "12px Arial";
            this.points.forEach(function (point, i){
                ctx.strokeText("x: "+point.x+" y: "+point.y, point.x, point.y);
            });
        }
    };

    /**
     * Creates a new Color
     * @param  {number} [r=0] - red color value (0-255)
     * @param  {number} [g=0] - green color value (0-255)
     * @param  {number} [b=0] - blue color value (0-255)
     * @constructor
     */
    var Color = function(r, g, b) {
        // initialise values
        this._r = 0;
        this._g = 0;
        this._b = 0;
        // use setter to save the values
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
    };

    Object.defineProperties(Color.prototype, {
        r: {
            get: function() { return this._r; },
            set: function(r) {
                this._r = limit(parseInt(r, 10), 0, 255);
            }
        },
        g: {
            get: function() { return this._g; },
            set: function(g) {
                this._g = limit(parseInt(g, 10), 0, 255);
           }
        },
        b: {
            get: function() { return this._b; },
            set: function(b) {
                this._b = limit(parseInt(b, 10), 0, 255);
            }
        }
    });

    /**
     * Get hexadecimal RGB color code as String
     * @return {string} - RGB hex color code
     */
    Color.prototype.getHexCode = function () {
        var code = "#";
        if (this.r < 16) code += "0";
        code += this.r.toString(16);
        if (this.g < 16) code += "0";
        code += this.g.toString(16);
        if (this.b < 16) code += "0";
        code += this.b.toString(16);
        return code;
    };

    Color.prototype.toString = Color.prototype.getHexCode;

    /**
     * Get a random integer in a specific range
     * @param  {number} min
     * @param  {number} max
     * @return {number}
     */
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    /**
     * get a RandomColor
     * @param  {Color} color - base color
     * @param  {number} randomness - factor of randomness in percent
     * @return {Color} random color
     */
    var getRandomColor = function (color, randomness) {
        if (!color) color = new Color();
        if (isNaN(randomness)) randomness = 100;
        var f = randomness / 100;

        var r = getRandomInt(color.r * (1-f), color.r + ((255-color.r) * f));
        var g = getRandomInt(color.g * (1-f), color.g + ((255-color.g) * f));
        var b = getRandomInt(color.b * (1-f), color.b + ((255-color.b) * f));

        return new Color(r, g, b);
    };

    function newGrid(grid, s) {
        var grid = new Array(parseInt(canvas.width/s.gridSize, 10)+5); //40

        for (var lineIndex = 0; lineIndex < grid.length; lineIndex++) {
            grid[lineIndex] = new Array(parseInt(canvas.height/s.gridSize, 10)+5); //13
            for (var nodeIndex = 0; nodeIndex < grid[lineIndex].length; nodeIndex++) {
                grid[lineIndex][nodeIndex] = {};

                var posRandomness = new Vector(s.posRandomness, s.posRandomness);
                var currPos = new Point(lineIndex*s.gridSize, nodeIndex*s.gridSize);
                currPos = currPos.move(new Vector(-40,-40));
                currPos = currPos.move(new Vector(
                    getRandomInt(-posRandomness.x, posRandomness.x),
                    getRandomInt(-posRandomness.y, posRandomness.y)
                ));

              var startColor = getRandomColor(s.startColor, s.startColorRandomness);
              var color = new Color(
                  grid[lineIndex-1]
                      ? grid[lineIndex-1][nodeIndex].color.r
                      : startColor.r,
                  grid[lineIndex-1] && grid[lineIndex-1][nodeIndex-1]
                      ? grid[lineIndex-1][nodeIndex-1].color.g
                      : startColor.g,
                  grid[lineIndex][nodeIndex-1]
                      ? grid[lineIndex][nodeIndex-1].color.b
                      : startColor.b
              );

              color = getRandomColor(color, s.overTimeColorRandomness || 0);

              grid[lineIndex][nodeIndex] = {
                  _color: color,
                  color: getRandomColor(color, 0),
                  orgPos: new Point(currPos.x, currPos.y),
                  currPos: currPos
              };
          }
      }

      return grid;
    }

    function drawGrid(grid, s) {
        for (var lineIndex = 0; lineIndex < grid.length - 1; lineIndex++) {
            for (var nodeIndex = 0; nodeIndex < grid[lineIndex].length - 1; nodeIndex++) {
                var drawColor = getRandomColor(grid[lineIndex][nodeIndex].color, 0);
                if (s.baseColor) {
                    var bc = s.baseColor;
                    var bco = s.baseColorOpacity;
                    drawColor.r = (drawColor.r + bc.r * bco) / (1 + bco);
                    drawColor.g = (drawColor.g + bc.g * bco) / (1 + bco);
                    drawColor.b = (drawColor.b + bc.b * bco) / (1 + bco);
                }

                var r = new Polygon([
                        grid[lineIndex + 1][nodeIndex].currPos,
                        grid[lineIndex][nodeIndex].currPos,
                        grid[lineIndex][nodeIndex + 1].currPos,
                        grid[lineIndex + 1][nodeIndex + 1].currPos,
                    ],
                    drawColor,
                    s.borderColor
                );
                r.fill();
            }
        }
    }

    var animateGrid = function(grid, s) {
        for (var lineIndex = 0; lineIndex < grid.length - 1; lineIndex++) {
            for (var nodeIndex = 0; nodeIndex < grid[lineIndex].length - 1; nodeIndex++) {
                var node = grid[lineIndex][nodeIndex];

                if (s.mousePos) {
                    var diff = Vector.fromPoints(node.orgPos, s.mousePos);
                    var dist = diff.getDistance();
                    var pow = 1 - Math.pow( dist / 420, 2);

                    if (pow > 0) {
                        node.currPos = node.orgPos.move(diff.normalized()
                            .multiply(new Vector(30, 30))
                            .multiply(new Vector(pow, pow)));
                    }
                }

                node.currPos.x = (node.orgPos.x + node.currPos.x * 50) / 51;
                node.currPos.y = (node.orgPos.y + node.currPos.y * 50) / 51;
            }
        }
    };


    (function() {
        var grid = newGrid(grid, {
            posRandomness: 26,
            startColor: new Color(80, 90, 250),
            //startColor: new Color(120, 20, 150),
            startColorRandomness: 10,
            overTimeColorRandomness: 5,
            //gridSize: 38
            gridSize: 80000 / (window.screen.availWidth/2 + 900)
        });

        var mousePos = new Point(canvas.width  / 2, canvas.height / 2);
        var lastMouseMove = Date.now();
        var lastRender = 0;
        // give the browser some time
        setTimeout(function () {
            canvas.parentNode.addEventListener("mousemove", function(event) {
                var rect = canvas.getBoundingClientRect();
                var topLeft = new Point(rect.left, rect.top);
                var browsersMousPos = new Point(event.clientX, event.clientY);
                var canvasMousePos = new Point(
                    (browsersMousPos.x - topLeft.x) * (canvas.width / canvas.clientWidth),
                    (browsersMousPos.y - topLeft.y) * (canvas.height / canvas.clientHeight)
                );
                mousePos = canvasMousePos;
                lastMouseMove = Date.now();
            });
        }, 600);

        var draw = function() {
            requestAnimationFrame(function() {
                if (lastMouseMove > lastRender) {
                    animateGrid(grid, {
                        mousePos: mousePos
                    });

                    drawGrid(grid, {
                        //baseColor: new Color(250, 80, 25),
                        baseColor: new Color(25, 80, 250),
                        borderColor: new Color(18, 31, 45),
                        baseColorOpacity: 0.4
                    });

                    lastRender = Date.now();
                }

                draw();
            });
        };

        draw();
    }());

}(false));
