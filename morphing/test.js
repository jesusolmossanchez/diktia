/* Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.4
 *
 * Requires: 1.2.2+
 */
(function(c){var a=["DOMMouseScroll","mousewheel"];c.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var d=a.length;d;){this.addEventListener(a[--d],b,false)}}else{this.onmousewheel=b}},teardown:function(){if(this.removeEventListener){for(var d=a.length;d;){this.removeEventListener(a[--d],b,false)}}else{this.onmousewheel=null}}};c.fn.extend({mousewheel:function(d){return d?this.bind("mousewheel",d):this.trigger("mousewheel")},unmousewheel:function(d){return this.unbind("mousewheel",d)}});function b(i){var g=i||window.event,f=[].slice.call(arguments,1),j=0,h=true,e=0,d=0;i=c.event.fix(g);i.type="mousewheel";if(i.wheelDelta){j=i.wheelDelta/120}if(i.detail){j=-i.detail/3}d=j;if(g.axis!==undefined&&g.axis===g.HORIZONTAL_AXIS){d=0;e=-1*j}if(g.wheelDeltaY!==undefined){d=g.wheelDeltaY/120}if(g.wheelDeltaX!==undefined){e=-1*g.wheelDeltaX/120}f.unshift(i,j,e,d);return c.event.handle.apply(this,f)}})(jQuery);;
var IdleTimer = function (delay, callback)
{
    var timeout = null;
    var self = this;
    self.callback = callback;

    self.cancel = function ()
    {
        if (timeout)
        {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    self.bump = function ()
    {
        self.cancel();
        timeout = setTimeout(function () {self.callback(); timeout = null; }, delay);
    };
    return self;
};
;
var vec2d =
{
    dist_quadr: function(a, b)
    {
        var d0 = a[0]-b[0]; var d1 = a[1]-b[1];
        return d0*d0 + d1*d1;
    },

    dist_eucl: function(a, b)
    {
        return Math.sqrt(vec2d.dist_quadr(a, b));
    },

    atan2: function(a, b)
    {
        return Math.atan2(b[1]-a[1], b[0]-a[0]);
    },

    diff: function(a, b)
    {
        return [a[0]-b[0], a[1]-b[1]];
    },

    add: function(a, b)
    {
        return [a[0]+b[0], a[1]+b[1]];
    },

    mix: function(a, b, mix)
    {
        // add(mult(a, 1-mix), mult(b, mix))
        return [
            (1-mix) * a[0] + mix * b[0],
            (1-mix) * a[1] + mix * b[1]
        ];
    },

    mult: function(a, fact)
    {
        return [fact * a[0], fact * a[1]];
    },

    line_intersect: function(p1, p2, p3, p4)
    {
        // intersection
        var d = ( (p1[0]-p2[0])*(p3[1]-p4[1]) - (p1[1]-p2[1])*(p3[0]-p4[0]) );
        var px =
            ( (p1[0]*p2[1]-p1[1]*p2[0])*(p3[0]-p4[0]) - (p1[0]-p2[0])*(p3[0]*p4[1]-p3[1]*p4[0])) /
            d;
        var py =
            ( (p1[0]*p2[1]-p1[1]*p2[0])*(p3[1]-p4[1]) - (p1[1]-p2[1])*(p3[0]*p4[1]-p3[1]*p4[0])) /
            d;
        return [px, py];
    },

    shapeBoundaries: function(shapes, idxField)
    {
        idxField = idxField || 'points';

        var bounds = {minx: null, maxx: null, miny: null, maxy: null, width: null, height: null, cx: null, cy: null};
        $(shapes).each(function()
                       {
                           for (var i=0; i<this[idxField].length; i++) {
                               var x = this[idxField][i][0], y = this[idxField][i][1];
                               bounds.minx = (bounds.minx===null||x<bounds.minx)?x:bounds.minx;
                               bounds.maxx = (bounds.maxx===null||x>bounds.maxx)?x:bounds.maxx;
                               bounds.miny = (bounds.miny===null||y<bounds.miny)?y:bounds.miny;
                               bounds.maxy = (bounds.maxy===null||y>bounds.maxy)?y:bounds.maxy;
                           }
                       });
        bounds.width = bounds.maxx - bounds.minx;
        bounds.height = bounds.maxy - bounds.miny;
        bounds.cx = bounds.minx + bounds.width/2;
        bounds.cy = bounds.miny + bounds.height/2;
        return bounds;
    },

    center: function(vectors) 
    {
        var x = 0; var y = 0;
        var points = (typeof vectors == 'object') ? vectors.points : vectors;
        for (var i=0; i<points.length; i++) {
            x += points[i][0];
            y += points[i][1];
        }
        return [x/points.length, y/points.length];
    }

};
;
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}
;
var Util =
{

   formatDuration: function(duration) 
    {
        var d = Math.floor(duration);
        var h = Math.floor(d/3600);
        var m = Math.floor(d%3600 / 60);
        return (h?(h + "u "):"") + (m?((m<10?"":"") + m + "min"):"");
    },

   formatTime: function(i) 
    {
        var h = i.getHours();
        var m = i.getMinutes();
        return h + ":" + (m<10?"0":"") + m;
    },

    ISODateString: function(d)
    {
        function pad(n){return n<10 ? '0'+n : n;}
        return d.getUTCFullYear()+'-'
            + pad(d.getUTCMonth()+1)+'-'
            + pad(d.getUTCDate())+'T'
            + pad(d.getUTCHours())+':'
            + pad(d.getUTCMinutes())+':'
            + pad(d.getUTCSeconds())+'Z';
    }
};;
var Algorithm =
{

    sortFeatures: function(point, features, transformed, mainonly)
    {
        var s = [];
        mainonly = true;
        $(features).each(function() {
                             if (mainonly&&!this.main) return; // only 'main' features
                             //if (typeof filterfun == 'function' && !filterfun(this)) return; // ignore this point
                             var f = $.extend(true, {}, this);
                             f.distance = vec2d.dist_eucl(point, transformed ? f.currentPoint : f.point);
                             s.push(f);
                         });
        s.sort(function(a, b) { return a.distance-b.distance; });
        return s;
    },

    closestPoint: function(point, points)
    {
        var s = [];
        for (var i=0; i<points.length; i++) {
            var f = {point: points[i], index: i};
            f.distance = vec2d.dist_eucl(point, f.point);
            s.push(f);
        }
        s.sort(function(a, b) { return a.distance-b.distance; });
        return s[0].index;
    },

    None: function()
    {
        return {
            prepareShapes: function(shapes, features) 
            {
            },
            correctPoints: function(shape, featuresByCode) {
                return shape.points;
            }
        };
    },

    /**
     * Naive algorithm maintains the delta from the shape vertex to the closest city constant.
     */
    Naive: function()
    {
        return {

            prepareShapes: function(shapes, features)
            {
                // calculate for each point in each shape which is the nearest feature, and the delta to it.
                $(shapes).each(function()
                               {
                                this.closestCities = [];
                                for (var i=0; i<this.points.length; i++) {
                                    var s = Algorithm.sortFeatures(this.points[i], features);
                                    var c = s[0];

                                    var p = {code: c.code, delta: vec2d.diff(this.points[i], c.point)};
                                    this.closestCities.push(p);
                                }
                            });
            },

            correctPoints: function(shape, idx, featuresByCode)
            {
                var points = [];
                for (var idx=0; idx<shape.points.length; idx++) {
                    var city = featuresByCode[shape.closestCities[idx].code];
                    ponts.push(vec2d.add(city.currentPoint, shape.closestCities[idx].delta));
                }
                return points;
            }

        };
    },


    /**
     * Weighted algorithm looks at the N closest features and weighs
     * its displacement vectors based on distance.
     */
    Weighted: function(N)
    {
        var _correctSinglePoint = function(shape, idx, featuresByCode, which) {
            which = which || 'currentPoint';
            var point = shape.points[idx];
            for (var j=0; j<N; j++) {
                var w = shape.weights[idx][j];
                var f = featuresByCode[w.code];
                point = vec2d.add(point, vec2d.mult( vec2d.diff(f[which], f.point), w.weight));
            }
            return point;
        };

        return {
            correctSinglePoint: function(shape, idx, featuresByCode, which) {
                return _correctSinglePoint(shape, idx, featuresByCode, which);
            },

            prepareShapes: function(shapes, features)
            {
                // calculate for each feature which is the nearest point on each shape. This will be used to adjust nearest-feature calculation per point.
                $(features).each(function()
                                 {
                                     this.nearestPoints = {};
                                     var p = this.point;
                                     var n = this.nearestPoints;
                                     $(shapes).each(function(currentShape) {
                                                        n[currentShape] = Algorithm.closestPoint(p, this.points);
                                                    });
                                 });

                // calculate for each point in each shape which is the nearest feature, and the delta to it.
                $(shapes).each(function(currentShape)
                               {
                                this.weights = [];
                                for (var i=0; i<this.points.length; i++) {
                                    var j;
                                    var s = Algorithm.sortFeatures(this.points[i], features);

                                    var totalDistance = 0;
                                    var n=N;
                                    for (j=0; j<n; j++) {
                                        if (this.points.length>100&&Math.abs(i-s[j].nearestPoints[currentShape])>19) {n++; continue;}
                                        totalDistance += s[j].distance;
                                    }
                                    var totalw = 0, w = 0;
                                    this.weights[i] = [];
                                    var n = N;
                                    for (j=0; j<n; j++) {
                                        if (this.points.length>100&&Math.abs(i-s[j].nearestPoints[currentShape])>19) {n++; continue;}
                                        w = 2/N * (1-(s[j].distance/totalDistance));
                                        this.weights[i].push({code: s[j].code, weight: w});
                                        totalw += w;
                                    }
                                    // normalize
                                    for (j=0; j<N; j++) {
                                        this.weights[i].weight /= totalw;
                                    }

                                }
                            });
            },

            correctPoints: function(shape, featuresByCode, which)
            {
                var points = [];
                for (var i=0; i<shape.points.length; i++) {
                    points.push(_correctSinglePoint(shape, i, featuresByCode, which));
                }

                return points;
            }

        };
    },

    /**
     * GridWeighted is like Weighted but contrains polygon lines to 0,45,90 angles.
     */
    GridWeighted: function(N)
    {
        var _weighted = Algorithm.Weighted(N);
        return {

            correctSinglePoint: function(shape, idx, featuresByCode, which) {
                return _weighted.correctSinglePoint(shape, idx, featuresByCode, which);
            },

            prepareShapes: function(shapes, features)
            {
                _weighted.prepareShapes(shapes, features);
            },

            correctPoints: function(shape, featuresByCode, which)
            {
                var prev = _weighted.correctPoints(shape, featuresByCode, which);
                var points = [];

                for (var idx=0; idx<prev.length; idx++)
                if (idx % 2) {
                    // correct point based on neighbours
                    var angle;

                    // check left
                    var pl = prev[idx-1];
                    var pr = (idx<(shape.points.length-1))?prev[idx+1]:prev[0];

                    var vectors = [ [0,1], [1,0], [1,1], [-1,1],
                                    [2, 1], [1, 2] ]; // these last 2 are cheating
                    var intersections = [];
                    var min = Infinity;
                    var finalpoint = pl;
                    for (var i=0; i<vectors.length; i++) {
                        for (var j=0; j<vectors.length; j++) {
                            var candidate = 
                                vec2d.line_intersect(pl, vec2d.add(pl, vectors[i]), 
                                                     pr, vec2d.add(pr, vectors[j]));
                            var d = vec2d.dist_quadr(candidate, prev[idx]);
                            if (d < min) {
                                finalpoint = candidate;
                                min = d;
                            }
                        }
                    }
                    points.push(finalpoint);
                } else {
                    points.push(prev[idx]);
                }
                return points;
            }

        };
    },

    /**
     * Islandweighted keeps the islands in a more sane shape.
     */
    IslandWeighted: function()
    {
        var _weighted = Algorithm.GridWeighted(2);
        return {

            prepareShapes: function(shapes, features)
            {
                _weighted.prepareShapes(shapes, features);
                $(shapes).each(function()
                               {
                                   this.island = this.points.length <= 20;
                                   this.center = vec2d.center(this);
                               });
            },

            correctPoints: function(shape, featuresByCode, which)
            {
                var prev = _weighted.correctPoints(shape, featuresByCode, which);
                if (!shape.island) {
                    return prev;
                }

                var displacement = vec2d.diff(_weighted.correctSinglePoint(shape, 0, featuresByCode, which), shape.points[0]);
                var displaced = [];
                for (var i=0; i<shape.points.length; i++) {
                    displaced.push(vec2d.add(displacement, shape.points[i]));
                }
                var points = [];

                var fact = 0.6;
                if (which == 8) {
                    // flevoland
                    fact = 0.15;
                }
                for (var i=0; i<shape.points.length; i++) {
                    points.push(vec2d.mix(prev[i], displaced[i], fact));
                }
                return points;
            }

        };
    }


};;
var Map = function()
{
    // map boundaries
    var _bounds = {};
    var _prevBounds = {};
    var _nextBounds = {};

    var _zoomTransitionStart = null;
    var _currentZoomTransition = null;
    var _zoomTransitionTime = 500;
    var _zoomFactor = null;
    var _nextZoomFactor = 0;

    var _userZoom = 0;
    var _userZoomMax = 10;

    var _viewport = {x: 0, y: 0, width: 0, height: 0, cx: 0, cy: 0};

    var _currentTime = null;

    var _maximumTraject = {};

    var _invalidated = true;

    // the shapes
    var _shapes = [];
    var _lines = [];  // [ {from: [shapeidx, vertexidx], to: [shapeidx, vertexidx]} ]

    // the cities
    var _cities = [];
    var _citiesByCode = {};

    // the cities, transoformed by time scale
    var _selectedCity = null;
    var _nextSelectedCity = null;
    var _centerPoint = [0, 0];

    // debug flag
    var _debugging = false;

    // travel times
    var _travelTimes = null;
    var _startTimes = {};

    // The colors
    var _gradient = "#24A95D,#80BC52,#C1D242,#EBE324,#FFD50F,#FABC26,#F18931,#EB6834,#E44E31,#CB3938,#B6363B,#A53340,#912F42,#812A43,#712543,#631E42,#571840,#49163D,#3C173B,#2D1635,#1C1830,#181726,#14141C,#101112,#0C0C08,#000000".split(",");

    var _algorithm = Algorithm.IslandWeighted();

    var _secondsperunit = 1.0; // "default" number of seconds of travel time per map unit

    var _currentTransition = null;
    var _transitionStart = false;
    var _transitionTime = 1000;
    var _transitionTimeFactor = 1;

    var _fillCanvasRadius = 1000;
    var _fillCanvas = $("<canvas>").attr("width", 2*_fillCanvasRadius).attr("height", 2*_fillCanvasRadius);
    
    function _drawCircleCanvas()
    {
        var ctx = _fillCanvas.get(0).getContext("2d");
        ctx.fillStyle = "red";
        var f = _fillCanvasRadius;
        ctx.translate(f, f);

        var d = (_fillCanvasRadius / _gradient.length);
        for (var i=_gradient.length-1; i>=0; i--) 
        {
            ctx.fillStyle = _gradient[i];
            ctx.beginPath();
            ctx.arc(0, 0, (i+1)*d, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
        }

    }
    _drawCircleCanvas();


    // --------------------------------------------------------------------------------------------------------------------------
    // Private functions

    function _drawSelectedCity(ctx, city) 
    {
        ctx.save();
        var r = 3;
        if (city.large) r *= 2;

        // Dot
        ctx.fillStyle = "black";
        ctx.translate(city.currentPoint[0], city.currentPoint[1]);
        ctx.beginPath();
        ctx.arc(0, 0, r+2, 0, 2*Math.PI);
        ctx.fill();
        ctx.restore();
    }


    function _drawPolygons(ctx)
    {
        // polygons
        ctx.save();

        $(_shapes).each(function(idx)
                        {
                            var p = this.currentPoints[0];
                            ctx.moveTo(p[0], p[1]);
                            for (var i=1; i<this.points.length; i++) {
                                p = this.currentPoints[i];
                                ctx.lineTo(p[0], p[1]);
                            }
                            ctx.closePath();
                            ctx.fill();
                        });
        ctx.lineWidth = 2;
        $(_lines).each(function() 
                       {
                           var p1 = _shapes[this.from.shape].currentPoints[this.from.vertex];
                           var p2 = _shapes[this.to.shape].currentPoints[this.to.vertex];
                           ctx.moveTo(p1[0], p1[1]);
                           ctx.lineTo(p2[0], p2[1]);
                           ctx.stroke();
                       });

        // in webkit, clip() is faster; in firefox, globalCompositeOperation.
        if (_debugging&&$.browser.webkit) {
            ctx.clip();
        } else {
            ctx.globalCompositeOperation = "source-atop";
        }

        // Then the filling
        ctx.translate(_centerPoint[0], _centerPoint[1]);
        var r = 1800 * (1/_secondsperunit);

        var scale = (1800 * (1/_secondsperunit))*_gradient.length / _fillCanvasRadius;
        ctx.scale(scale, scale);
        ctx.translate(-_fillCanvasRadius, -_fillCanvasRadius);
        ctx.drawImage(_fillCanvas[0], 0, 0);
        ctx.restore();
    }


    function _drawMap(ctx)
    {
        _drawPolygons(ctx);

        // First the circles
        ctx.save();
        ctx.translate(_centerPoint[0], _centerPoint[1]);

        var r = 1800 * (1/_secondsperunit);
        ctx.lineWidth = 20*(1/_secondsperunit);
        for (var i=30; i>=0; i--)
        {
            ctx.strokeStyle="rgba(0,0,0," + 0.3*(1-Math.floor(10*(i/30))/10) + ")";
            ctx.beginPath();
            ctx.arc(0, 0, i*r, 0, 2*Math.PI);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();

        if (_debugging)
        {
            // lines around polys
            ctx.strokeStyle = "#333";
            $(_shapes).each(function()
                            {
                                var p = this.currentPoints[0];
                                ctx.moveTo(p[0], p[1]);
                                for (var i=1; i<this.points.length; i++) {
                                    p = this.currentPoints[i];
                                    ctx.lineTo(p[0], p[1]);
                                }
                                ctx.closePath();
                                ctx.stroke();
                            });
        }

        // Selected city lines
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.6; // 50*(1/_secondsperunit);
        $(_cities).each(function()
                        {
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(_centerPoint[0], _centerPoint[1]);
                            ctx.lineTo(this.currentPoint[0], this.currentPoint[1]);
                            ctx.stroke();
                        });

        // All cities
        $(_cities).each(function()
                        {
                            var r = 3;
                            if (!this.searchResult) {
                                ctx.fillStyle = "white";
                            } else {
                                ctx.fillStyle = "#3399FF";
                                r = 10;
                            }
                            if (this.large) r *= 2;
                            ctx.save();
                            ctx.translate(this.currentPoint[0], this.currentPoint[1]);
                            ctx.beginPath();
                            ctx.arc(0, 0, r, 0, 2*Math.PI);
                            ctx.fill();
                            ctx.scale(2, 2);
                            //ctx.rotate(Math.atan2(-_bounds.cx-this.point[0], _bounds.cy-this.point[1]));
                           // ctx.fillText(this.code, 3, 3);
                            ctx.restore();
                            //ctx.fillRect(this.point[0], this.point[1], 12, 12);
                        });


        // Selected city name
        if (_selectedCity)
        _drawSelectedCity(ctx, _selectedCity);

        if (_nextSelectedCity)
        {
            _drawSelectedCity(ctx, _nextSelectedCity);
        }

        ctx.restore();
    }


    function _getZoomAndPan() {

            // var fact = Math.min(_viewport.height / 
            //                     ( (1-_currentTransition)*_prevBounds.height + _currentTransition*_nextBounds.height),
            //                     _viewport.width / 
            //                     ( (1-_currentTransition)*_prevBounds.width + _currentTransition*_nextBounds.width));
        var dx = (1-_currentTransition) * _prevBounds.cx + _currentTransition * _nextBounds.cx;
        var dy = (1-_currentTransition) * _prevBounds.cy + _currentTransition * _nextBounds.cy;

        var fact = _zoomFactor;
        if (_zoomTransitionStart) {
            fact = (1-_currentZoomTransition)*_zoomFactor + _currentZoomTransition*_nextZoomFactor;
        }

        if (_userZoom < 0)
            fact *= (1/(-_userZoom+1));
        if (_userZoom > 0)
            fact *= _userZoom;
        return {zoom: fact, dx: dx, dy: dy};
    }

    function _userToWorldCoordinate(point) {
        var p = _getZoomAndPan();
        var x = point[0]; var y = point[1];

        x -= _viewport.cx;
        x /= p.zoom;
        x += p.dx;

        y -= _viewport.cy;
        y /= p.zoom;
        y += p.dy;

        return [x, y];
    }

    function _worldToUserCoordinate(point) {
        var p = _getZoomAndPan();
        var x = point[0]; var y = point[1];

        x -= p.dx;
        x *= p.zoom;
        x += _viewport.cx;

        y -= p.dy;
        y *= p.zoom;
        y += _viewport.cy;

        return [x, y];
    }


    var _maxDist = 0;

    /**
     * Calculate the vector between two cities given the travel time
     */
    function _cityTransform(currentCity, targetCity, correction)
    {
        correction = correction || 1.0;

        if (typeof _travelTimes[currentCity.code] == 'undefined' || typeof _travelTimes[currentCity.code][targetCity.code] == 'undefined') {
            // unknown travel time; bail out
            return [targetCity.point[0], targetCity.point[1]];
        }
        
        /*
        var t = _travelTimes[currentCity.code][targetCity.code];
        if (currentCity.code != targetCity.code && typeof _startTimes[currentCity.code] != 'undefined') {
            var besttime = null;
            for (var i=0; i<_startTimes[currentCity.code].length; i++) {
                var starttime = _startTimes[currentCity.code][i];
                if (starttime > now && (besttime === null || starttime < besttime)) besttime = starttime;
            }
            if (besttime) {
                t += (besttime - now)/1000; // Add relative start time
            }
        }
         */

        var traject = _travelTimes[currentCity.code][targetCity.code];
        var t = traject.duration + Math.max(0, (traject.startTime - _currentTime)/1000);

        //if (t > _maxDist) { _maxDist = t; console.log(currentCity.code, targetCity.code, traject.duration, traject.startTime, t); }

        var angle = vec2d.atan2(currentCity.point, targetCity.point);
        var dist = (1/_secondsperunit) * t;
        dist *= correction;
        //if (currentCity.code == 'ehv' && targetCity.code == 'asd') console.log('xx', traject.startTime);

        if (targetCity.name == "Stavoren") dist *= .8; // FIXME
        if (targetCity.name == "IJlst") dist *= .8; // FIXME
        if (targetCity.name == "Hindeloopen") dist *= .8; // FIXME
        if (targetCity.name == "Workum") dist *= .8; // FIXME
        if (targetCity.name == "Koudum Molkwerum") dist *= .8; // FIXME

        if (targetCity.name == "Enkhuizen") dist *= .8;
        // if (targetCity.name == "Harderwijk") dist *= .8;

        return [currentCity.point[0] + Math.cos(angle) * dist, currentCity.point[1] + Math.sin(angle) * dist];
    }


    function _correctCityDistortion(next)
    {
        var viewpointcity = !next ? _selectedCity : _nextSelectedCity;

        // limit cities to not cross boundaries to other cities too much
        var normalOrdering = Algorithm.sortFeatures(viewpointcity.point, _cities, false);
        var normalOrderingCodes = []; $(normalOrdering).each(function() { normalOrderingCodes.push(this.code); });

        var distortedOrdering = Algorithm.sortFeatures(viewpointcity.point, _cities, true);
        var distortedOrderingCodes = []; $(distortedOrdering).each(function() { distortedOrderingCodes.push(this.code); });

        $(_cities).each(function()
         {
             var idxNormal = $.inArray(this.code, normalOrderingCodes);
             var idxDistorted = $.inArray(this.code, distortedOrderingCodes);
             if (idxDistorted == idxNormal) return;
             var sign = (idxDistorted-idxNormal)/Math.abs(idxDistorted-idxNormal);

             var problem = false;
             for (var i=idxNormal; i!=idxDistorted; i+=sign) {

                 var a = vec2d.atan2(viewpointcity.point, _citiesByCode[normalOrderingCodes[i]].point);
                 var b = vec2d.atan2(viewpointcity.point, _citiesByCode[distortedOrderingCodes[i]].point);
                 if (Math.abs(a-b) <= 0.125*Math.PI) {
                     problem = true;
                     break;
                 }
             }
             if (!problem) {
                 return;
             }

             if (idxDistorted < idxNormal) {
                 // handle the case where cities are "pulled" closer than normal
             } else {
                 // handle the case where cities are "pushed" further than normal
                 var p = _cityTransform(viewpointcity, this, 0.8);
                 if (!next) {
                     this.prevPoint = this.currentPoint = p;
                 } else {
                     this.nextPoint = p;
                 }

             }
         });
    }

    function stringToTime(s) {
        var l = s.split(" ");
        var d = l[0].split("-");
        var h = l[1].split(":");
        var dt = new Date(parseInt(d[0].replace(/^0+([1-9])/, '$1')), parseInt(d[1].replace(/^0+([1-9])/, '$1'))-1, parseInt(d[2].replace(/^0+([1-9])/, '$1')),
                          parseInt(h[0].replace(/^0+([1-9])/, '$1')), parseInt(h[1].replace(/^0+([1-9])/, '$1')), parseInt(h[2].replace(/^0+([1-9])/, '$1')));
        return dt;
    }

    // Update the current time, the travel times and, accordingly, the new positions of the cities.
    function _updateTimes(time, times) {
        _currentTime = time;
        _invalidated = true;

        if (times) {
            _travelTimes = {};
            for (var i=0; i<times.length; i++) {
                var from = times[i][0];
                var to = times[i][1];
                var t = {startTime: stringToTime(times[i][2]), duration: times[i][3], spoor: times[i][4]};
                if (typeof _travelTimes[from] == 'undefined') _travelTimes[from] = {};
                _travelTimes[from][to] = t;
            }

            var m = {minx: Infinity, miny: Infinity, maxx: -Infinity, maxy: -Infinity};
            var mincity = undefined;
            for (var i=0; i<_cities.length; i++) {
                for (var j=0; j<_cities.length; j++) {
                    var p = _cityTransform(_cities[i], _cities[j]);
                    if (m.minx > p[0]) m.minx = p[0];
                    if (m.maxx < p[0]) m.maxx = p[0];
                    if (m.miny > p[1]) {m.miny = p[1];mincity=_cities[j].code;}
                    if (m.maxy < p[1]) m.maxy = p[1];
                }
            }
            _maximumTraject = m;

            if (_viewport.width) {
                _calculateZoomFactor();
            }
        }

        if (_travelTimes === null) return;

        // interpolate times for main cities to non-main cities
        for (var i=0; i<_cities.length; i++) {
            var fromCity = _cities[i];
            if (!fromCity.main) continue;
            if (typeof _travelTimes[fromCity.code] == 'undefined') _travelTimes[fromCity.code] = {};
            _travelTimes[fromCity.code][fromCity.code] = {duration: 0, startTime: _currentTime, spoor: null};

            for (var j=0; j<_cities.length; j++) {
                var toCity = _cities[j];
                if (toCity.main) continue;
                if (typeof _travelTimes[toCity.code] == 'undefined') _travelTimes[toCity.code] = {};
                //if (typeof _travelTimes[fromCity.code][toCity.code] != 'undefined') continue;
                var t = {startTime: null, duration: 0, spoor: null};
                for (var code in toCity.weights) {
                    var traject = _travelTimes[fromCity.code][code];
                    if (typeof traject == 'undefined') {
                        console.log("??", fromCity.code, code);
                    }

                    if (t.startTime === null || t.startTime > traject.startTime) {
                        t.startTime = traject.startTime;
                    }
                    t.duration += traject.duration * toCity.weights[code];
                }
                _travelTimes[fromCity.code][toCity.code] = t;
                _travelTimes[toCity.code][fromCity.code] = t;
            }
        }
        // update times for non-main cities to non-main cities
        for (var i=0; i<_cities.length; i++) {
            var fromCity = _cities[i];
            if (fromCity.main) continue;
            _travelTimes[fromCity.code][fromCity.code] = {duration: 0, startTime: _currentTime, spoor: null};

            for (var j=0; j<_cities.length; j++) {
                var toCity = _cities[j];
                if (toCity.main) continue;
                if (typeof _travelTimes[fromCity.code][toCity.code] != 'undefined') continue;
                var t = {startTime: null, duration: 0, spoor: null};
                for (var code in toCity.weights) {
                    var traject = _travelTimes[fromCity.code][code];
                    if (t.startTime === null || t.startTime > traject.startTime) {
                        t.startTime = traject.startTime;
                    }
                    t.duration += traject.duration * toCity.weights[code];
                }
                _travelTimes[fromCity.code][toCity.code] = t;
                _travelTimes[toCity.code][fromCity.code] = t;
            }
        }


        if (!_selectedCity)
        {
            $(_cities).each(function()
                            {
                                this.currentPoint[0] = this.point[0];
                                this.currentPoint[1] = this.point[1];
                            }
                           );
            $(_shapes).each(function()
                            {
                                this.currentPoints = this.points;
                            });
            return;
        }

        $(_cities).each(function()
                        {
                            this.prevPoint = _cityTransform(_selectedCity, this);
                            this.currentPoint = this.prevPoint;
                            if (_nextSelectedCity) {
                                this.nextPoint = _cityTransform(_nextSelectedCity, this);
                            }
                        });


        // Calculate polygon shapes
        $(_shapes).each(function()
                        {
                            this.prevPoints = _algorithm.correctPoints(this, _citiesByCode, 'prevPoint');
                            this.nextPoints = _algorithm.correctPoints(this, _citiesByCode, 'nextPoint');

                            this.currentPoints = [];
                            for (var i=0; i<this.points.length; i++) {
                                this.currentPoints.push(this.prevPoints[i]);
                            }
                        });

        _prevBounds = vec2d.shapeBoundaries(_shapes, 'prevPoints');
        _nextBounds = vec2d.shapeBoundaries(_shapes, 'nextPoints');

        document.location = "#" + Util.formatTime(_currentTime);
    }

    function _getClosestCity(point, transformed) {
        var city = null;
        var mindist = Infinity;
        $(_cities).each(function()
                        {
                            var d = vec2d.dist_quadr(point, transformed ? this.currentPoint : this.point);
                            if (d < mindist) {
                                city = this;
                                mindist = d;
                            }
                        });
        if (Math.sqrt(mindist) > (1/_secondsperunit)*7200) return null;
        return city;
    }


    function _setSelectedCity(city)
    {
        if (typeof city == "string") city = _citiesByCode[city];
        _selectedCity = city;
        if (city)
            _centerPoint = city.point;
        _nextSelectedCity = null;
        _updateTimes(_currentTime);

        _transitionStart = null;

        return city;
    }


    function _transitionToSelectedCity(city)
    {
        if (typeof city == "string") city = _citiesByCode[city];
        if (!_selectedCity || !city) {
            _setSelectedCity(city);
            return city;
        }
        _nextSelectedCity = city;
        _updateTimes(_currentTime);
        _transitionStart = new Date();
        _transitionTime = Math.min(2500, vec2d.dist_eucl(_selectedCity.currentPoint, _nextSelectedCity.currentPoint));
        return city;
    }

    
    function _calculateZoomFactor()
    {
        var fact = Math.max(
            _viewport.width / Math.abs(_maximumTraject.maxx - _maximumTraject.minx),
            _viewport.height / Math.abs(_maximumTraject.maxy - _maximumTraject.miny)
        );
        fact =  _viewport.width / Math.abs(_maximumTraject.maxx - _maximumTraject.minx) * 0.6;
        
        var animate = _zoomFactor > 0;
        if (animate) 
        {
            _zoomTransitionStart = new Date();
            _nextZoomFactor = fact;
        }
        else
        {
            _zoomFactor = fact;
        }
    }

    // --------------------------------------------------------------------------------------------------------------------------
    // Public functions

    return {

        /**
         * Set the map viewport (in user coordinates)
         */
        setViewport: function(x, y, w, h)
        {
            _viewport.width = w;
            _viewport.height = h;
            _viewport.x = x;
            _viewport.y = y;
            _viewport.cx = x + Math.floor(w/2);
            _viewport.cy = y + Math.floor(h/2);

            _calculateZoomFactor();
            _invalidated = true;
        },

        /**
         * Loads shape list
         */
        setShapes: function(shapes)
        {
            _shapes = shapes;
            _bounds = vec2d.shapeBoundaries(shapes);
            _zoomFactor = Math.min(_viewport.height / _bounds.height, _viewport.width / _bounds.width);
        },


        /**
         * Load city list
         */
        setCities: function(cities)
        {
            _cities = [];
            _citiesByCode = {};
            // filter on 'main'
            $(cities).each(function() { this.prevPoint = [0, 0]; // the current cities' position
                                        this.currentPoint = [0, 0]; // the next position (for animation)
                                        this.nextPoint = [0, 0];
                                        this.point = [this.point_x, this.point_y];
                                        _citiesByCode[this.code] = this;
                                        _cities.push(this); });

            // calculate city weights for non-main 
            $(cities).each(function() { 
                               if (this.main) return;
                               var l = Algorithm.sortFeatures(this.point, _cities, false, true);
                               var n = 2;
                               this.weights = {};
                               var totaldist = 0;
                               var distfun = vec2d.dist_eucl;
                               var i;
                               // total distance
                               for (i=0; i<n; i++) totaldist += distfun(this.point, l[i].point);
                               var d = 0, t = 0;
                               // distribute over weights
                               for (i=0; i<n; i++) {
                                   var d = (1-distfun(this.point, l[i].point)/totaldist);
                                   this.weights[l[i].code] = d; 
                                   t += d;
                               }
                               // normalize weights
                               for (i=0; i<n; i++) {
                                   this.weights[l[i].code] /= t;
                               }
                           });


            // ams-ut = 1560 seconds -- magic number alert!
            _secondsperunit = 2000 / vec2d.dist_eucl(_citiesByCode['asd'].point, _citiesByCode['ut'].point);

            // Call algorithm to prepare the morphing
            _algorithm.prepareShapes(_shapes, _cities);
        },


        /**
         * (partial) update of travel times
         */
        updateTimes: function(t, times) 
        {
            _updateTimes(t, times);
        },

        /**
         * Draw the entire map.
         */
        redraw: function(ctx)
        {
            if (_transitionStart)
            {
                var millis = (new Date()) - _transitionStart;
                if (millis > _transitionTime)
                {
                    // animation finished
                    _setSelectedCity(_nextSelectedCity);
                    _currentTransition = 0.0;
                }
                else
                {
                    _currentTransition = (millis / _transitionTime);
                    // non-linear animation looks nicer
                    _currentTransition = Math.cos((_currentTransition * 0.5 * Math.PI) - 0.5 * Math.PI);

                    $(_cities).each(function()
                                    {
                                        this.currentPoint = vec2d.mix(this.prevPoint, this.nextPoint, _currentTransition);
                                    });
                    $(_shapes).each(function()
                                    {
                                        for (var i=0; i<this.points.length; i++) {
                                            this.currentPoints[i] = vec2d.mix(this.prevPoints[i], this.nextPoints[i], _currentTransition);
                                        }
                                    });
                    _centerPoint = vec2d.mix(_selectedCity.point, _nextSelectedCity.point, _currentTransition);
                }
            }
            else if (_zoomTransitionStart)
            {
                var millis = (new Date()) - _zoomTransitionStart;

                if (millis > _zoomTransitionTime) {
                    _zoomTransitionStart = null;
                    _currentZoomTransition = null;
                    _zoomFactor = _nextZoomFactor;
                }
                else 
                {
                    _currentZoomTransition = (millis / _zoomTransitionTime);
                    _currentZoomTransition = Math.cos((_currentZoomTransition * 0.5 * Math.PI) - 0.5 * Math.PI);
                }
            }
            else if (!_invalidated) 
            {
                return;
            }

            ctx.clearRect(_viewport.x, _viewport.y, _viewport.width, _viewport.height);

            ctx.save();

            // go to center of viewport
            ctx.translate(_viewport.cx, _viewport.cy);

            // scale to fit map
            var z = _getZoomAndPan();
            ctx.scale(z.zoom, z.zoom);
            ctx.translate(-z.dx, -z.dy);

            _drawMap(ctx);

            ctx.restore();

            _invalidated = false;
        },


        /**
         * Convert user (canvas pixels) X/Y coordinate to world coordinate
         */
        userToWorldCoordinate: function(point) {
            return _userToWorldCoordinate(point);
        },

        worldToUserCoordinate: function(point) {
            return _worldToUserCoordinate(point);
        },

        /**
         * Returns closest city. x,y in world coordinates.
         */
        closestCity: function(point, transformed) {
            return _getClosestCity(point, transformed);
        },

        setSelectedCity: function(city) {
            return _setSelectedCity(city);
        },

        transitionToSelectedCity: function(city) {
            return _transitionToSelectedCity(city);
        },

        isTransitioning: function () {
            return _selectedCity && _nextSelectedCity;
        },

        getSelectedCity: function() {
            return _selectedCity;
        },

        reisinfo: function(from, to) {
            return _travelTimes[from][to];
        },

        getRandomCity: function() {
            var idx = Math.floor(_cities.length * Math.random());
            return _cities[idx];
        },

        isSelectableCity: function(city) {
            return typeof _travelTimes[city.code] != "undefined";
        },

        toggleDebugging: function() {
            _debugging = !_debugging;
        },

        isDebugging: function() {
            return _debugging;
        },

        getCities: function() {
            return _cities;
        },

        getTimes: function() {
            return _travelTimes;
        },

        invalidate: function() {
            _invalidated = true;
        },

        fixZoom: function() {
            _calculateZoomFactor();
        },

        getCityByGeoLocation: function(lat, lon) {
            var point = [lat, lon];
            var s = [];
            $(_cities).each(function() {
                                var f = $.extend(true, {}, this);
                                f.distance = vec2d.dist_quadr(point, [f.lat, f.lon]);
                                s.push(f);
                            });
            s.sort(function(a,b){return a.distance-b.distance;});
            return _citiesByCode[s[0].code];
        },

        setSearchCities: function(prefix) {
            $(_cities).each(function() {
                                this.searchResult = false;
                                if (prefix && this.name.substr(0, prefix.length).toLowerCase() == prefix.toLowerCase()) {
                                    this.searchResult = true;
                                }
                            });
            _invalidated = true;
        },

        zoomInOut: function(delta) {
            _userZoom += delta;
            if (_userZoom < -_userZoomMax) _userZoom = -_userZoomMax;
            if (_userZoom > _userZoomMax) _userZoom = _userZoomMax;
            _invalidated = true;
        },

        setLines: function(lines) {

            var closestVertex = function(point) {
                var min_shape = null;
                var min_dist = Infinity;
                var min_vertex = null;
                for (var i=0; i<_shapes.length; i++) {
                    var v = Algorithm.closestPoint(point, _shapes[i].points);
                    var d = vec2d.dist_eucl(point, _shapes[i].points[v]);
                    if (d < min_dist) {
                        min_dist = d;
                        min_shape = i;
                        min_vertex = v;
                    }
                }
                return {shape: min_shape ,vertex: min_vertex};
            };

            $(lines).each(function() {
                              var f = closestVertex(this[0]);
                              var t = closestVertex(this[1]);
                              if (f.shape != t.shape || f.vertex != t.vertex) 
                              {
                                  _lines.push({from: f, to: t});
                              }
                          });
        },

        getSVGString: function()
        {
            function xml2Str(xmlNode) {
                try {
                    // Gecko- and Webkit-based browsers (Firefox, Chrome), Opera.
                    return (new XMLSerializer()).serializeToString(xmlNode);
                }
                catch (e) {
                    try {
                        // Internet Explorer.
                        return xmlNode.xml;
                    }
                    catch (e) {  
                        //Other browsers without XML Serializer
                        alert('Xmlserializer not supported');
                    }
                }
                return false;
            }

            // Create a namespace for our SVG-related utilities
            var SVG = {};

            // These are SVG-related namespace URLs
            SVG.ns = "http://www.w3.org/2000/svg";
            SVG.xlinkns = "http://www.w3.org/1999/xlink";
            var svg = document.createElementNS(SVG.ns, "svg");

            var oldzoom = _zoomFactor;
            _zoomFactor = Math.min(_viewport.height / _bounds.height, _viewport.width / _bounds.width);

            var W = 1000, H = _prevBounds.height / _prevBounds.width * W;

            svg.setAttribute("width", W);
            svg.setAttribute("height", H);

            var b = document.createElementNS(SVG.ns, "rect");
            b.setAttribute("width", W); b.setAttribute("height", H);
            b.setAttribute("fill", "#f3ecca");
            svg.appendChild(b);

            var b = document.createElementNS(SVG.ns, "rect");
            if (W > H) {
                b.setAttribute("width", H); b.setAttribute("height", H);
                b.setAttribute("x", W/2-H/2);
            } else { 
                b.setAttribute("width", W); b.setAttribute("height", W);
                b.setAttribute("y", H/2-W/2);
            }
            b.setAttribute("fill", "url(#bg)");
            svg.appendChild(b);


            var s = W/Math.abs(_prevBounds.width);

            var main = document.createElementNS(SVG.ns, "g");
            var transf = function(type, p) { return type + "(" + (p.length ? (p[0] + ","+p[1]) : p) + ") "; };
            main.setAttribute("transform", transf("translate", [W/2, H/2]) + transf("scale", s) + transf("translate", [-_prevBounds.cx, -_prevBounds.cy]));

            var defs = document.createElementNS(SVG.ns, "defs");
            main.appendChild(defs);

            svg.appendChild(main);

            var gr = document.createElementNS(SVG.ns, "radialGradient");
            gr.setAttribute("id", "bg");
            gr.setAttribute("cx", "50%");
            gr.setAttribute("cy", "50%");
            gr.setAttribute("r", "50%");
            gr.setAttribute("fx", "50%");
            gr.setAttribute("fy", "50%");
            var s = document.createElementNS(SVG.ns, "stop");
            s.setAttribute("offset", "0%");
            s.setAttribute("style", "stop-color:#FFFDF5;");
            gr.appendChild(s);
            var s = document.createElementNS(SVG.ns, "stop");
            s.setAttribute("offset", "100%");
            s.setAttribute("style", "stop-color:#F3ECCA;");
            gr.appendChild(s);

            defs.appendChild(gr);
            // var url = "data:image/svg+xml," + encodeURIComponent(xml2Str(svg));
            // window.open(url);
            // return;

            // the paths
            {
                var shapes = document.createElementNS(SVG.ns, "clipPath");
                //var shapes = document.createElementNS(SVG.ns, "g");

                shapes.setAttribute("id", "clipper");
                var c = _centerPoint;
                $(_shapes).each(function(idx)
                                {
                                    var path = document.createElementNS(SVG.ns, "path");
                                    var p = this.currentPoints[0];
                                    var d = "M" + (p[0]-c[0]) + " " + (p[1]-c[1]) + " ";
                                    for (var i=1; i<this.points.length; i++) {
                                        p = this.currentPoints[i];
                                        d += "L" + (p[0]-c[0]) + " " + (p[1]-c[1]) + " ";
                                    }
                                    d += "Z";
                                    path.setAttribute("d", d);
                                    path.setAttribute("fill", "#ff00ff");
                                    shapes.appendChild(path);
                                });
                //shapes.setAttribute("transform", transf("translate", [-_centerPoint[0], -_centerPoint[1]]));
                defs.appendChild(shapes);
            }


            {
                var circles = document.createElementNS(SVG.ns, "g");
                circles.setAttribute("id", "circles");

                var b = document.createElementNS(SVG.ns, "rect");
                b.setAttribute("width", 100000); b.setAttribute("height", 100000);
                b.setAttribute("fill", "#000000");
                b.setAttribute("transform", transf("translate", [-50000, -50000]));
                circles.appendChild(b);

                var s = (1800 * (1/_secondsperunit));
                for (var i=_gradient.length-1; i>=0; i--)
                {
                    var r = (i+1) * s;
                    var circle = document.createElementNS(SVG.ns, "circle");
                    circle.setAttribute("r", r);
                    circle.setAttribute("fill", _gradient[i]);
                    circles.appendChild(circle);
                }
                circles.setAttribute("clip-path", "url(#clipper)");
                circles.setAttribute("transform", transf("translate", _centerPoint));
                main.appendChild(circles);
            }

            // circle outlines
            {
                var linecircles = document.createElementNS(SVG.ns, "g");
                linecircles.setAttribute("id", "linecircles");

                var s = (1800 * (1/_secondsperunit));
                for (var i=30; i>=0; i--)
                {
                    var r = i * s;
                    var circle = document.createElementNS(SVG.ns, "circle");
                    circle.setAttribute("r", r);
                    circle.setAttribute("style", "fill:none; stroke: #000000; stroke-width: 2;"); // opacity: " + 0.3*(1-Math.floor(10*(i/30))/10) + "); 
                    linecircles.appendChild(circle);
                }

                linecircles.setAttribute("transform", transf("translate", _centerPoint));
                main.appendChild(linecircles);
            }

            {
                var citylines = document.createElementNS(SVG.ns, "path");
                citylines.setAttribute("id", "citylines");
                var d = "";
                // cities
                $(_cities).each(function()
                        {
                            d += "M"+_centerPoint[0] + " " + _centerPoint[1] + " ";
                            d += "L"+this.currentPoint[0] + " " + this.currentPoint[1];
                        });
                citylines.setAttribute("d", d);
                citylines.setAttribute("style", "fill:none; stroke: #ffffff; stroke-width: 2;");
                main.appendChild(citylines);
            }

            // city dots
            {
                var cities = document.createElementNS(SVG.ns, "g");
                cities.setAttribute("id", "cities");
                $(_cities).each(function()
                                {
                                    var r = 3;
                                    if (this.large) r *= 2;
                                    var c = document.createElementNS(SVG.ns, "circle");
                                    c.setAttribute("cx", this.currentPoint[0]);
                                    c.setAttribute("cy", this.currentPoint[1]);
                                    c.setAttribute("r", r);
                                    c.setAttribute("style", "fill:#ffffff;");
                                    cities.appendChild(c);
                                }
                               );

                main.appendChild(cities);
            }

            // city texts
            {
                var cities = document.createElementNS(SVG.ns, "g");
                cities.setAttribute("id", "city_texts");
                $(_cities).each(function()
                                {
                                    var r = 3;
                                    if (this.large) r *= 2;

                                    var t = document.createElementNS(SVG.ns, "text");
                                    t.appendChild(document.createTextNode(this.name));
                                    t.setAttribute("style", "fill:#ffffff;font-size: 10px;");
                                    t.setAttribute("x", this.currentPoint[0]+r+2);
                                    t.setAttribute("y", this.currentPoint[1]);
                                    cities.appendChild(t);
                                }
                               );

                main.appendChild(cities);
            }
            _zoomFactor = oldzoom;
            return xml2Str(svg);
        }
    };
};
;
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
                               return  window.requestAnimationFrame       || 
                                   window.webkitRequestAnimationFrame || 
                                   window.mozRequestAnimationFrame    || 
                                   window.oRequestAnimationFrame      || 
                                   window.msRequestAnimationFrame     || 
                                   function(/* function */ callback, /* DOMElement */ element){
                                       window.setTimeout(callback, 1000 / 60);
                                   };
                           })();

$.misc = { error: function() { }, warn: function(){} };

var Timemaps = (function()
{
    // the canvas
    var _canvas = $("#canvas");

    var _tzoffset = 0;
    var _historyCache = {};

    var _currentTimes = {};

    // The map
    var _map = Map();

    var _selectedCity;

    var ua = navigator.userAgent.toLowerCase();
    var _isMobile = ua.match(/iphone/) || ua.match(/android/) || ua.match(/ipad/);
    var _isTablet = ua.match(/ipad/) || (ua.match(/android/) && !ua.match(/mobile/));

    var _currentTime = now();
    var _mode = "now"; // now | history

    function now() {
        var n = new Date();
        var o = n.getTimezoneOffset() * 60;
        var add = 1000 * (o + _tzoffset);
        return new Date(n.getTime()+add);
    }

    function reposition()
    {
        var w = $(window).width();
        var h = $(window).height();
        _canvas.attr("width", w).attr("height", h);
        _map.setViewport(0, 0, w, h);
    }

    function redraw()
    {
        var ctx = _canvas[0].getContext("2d");
        _map.redraw(ctx);
    }

    function drawLoop() 
    {
        redraw();
        window.requestAnimFrame(drawLoop);
    }

    function setSelectedCity(c, transition) 
    {
        if (transition) {
            _selectedCity = _map.transitionToSelectedCity(c);
        } else {
            _selectedCity = _map.setSelectedCity(c);
        }
        $("#sidebar input").val("");
        _map.setSearchCities(null);
        $("#cityheading span.city").text(_selectedCity.name);
        $("#info").fadeOut();
        if (_isMobile && !_isTablet) {
            hideSidebar();
        }

        if (_mode != "now") _nowTimer.bump();
    }

    function updateTime(t) {
        var w = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
        $("#cityheading span.date").text(w[t.getDay()] + ", " + Util.formatTime(t));
    }

    function _updateHoverInfo(hover) 
    {
        var from = _map.getSelectedCity();
        if (!from) {
            $("#info").html("");
            return;
        }

        var p = _map.worldToUserCoordinate(hover.currentPoint);

        var info = _map.reisinfo(from.code, hover.code);

        var t = "<h3>"+hover.name+" &mdash; <span>" + Util.formatDuration(Math.max(0, (info.startTime-_currentTime)/1000) + info.duration) + "</span></h3>";
        t += "<div>Trein vertrekt om <b>" + Util.formatTime(info.startTime) + "</b>";
        if (info.spoor) {
            t += " van spoor <b>" + info.spoor + "</b>";
        }
        t += "</div>";
        $("#info").css({left: Math.floor(p[0]), top: Math.floor(p[1])});
        $("#info div").html(t);
        $("#info").fadeIn();
    }


    var _homePosition = null;

    function goToHomePosition(transition) {
        if (!_homePosition) 
        {
            // Ask the user agent about his geolocation on load.
            navigator.geolocation.getCurrentPosition(function(pos) {
                                                         var p = [pos.coords.latitude, pos.coords.longitude];
                                                         _homePosition = p;
                                                         goToHomePosition(transition);
                                                     });
        } else {
            var c = _map.getCityByGeoLocation(_homePosition[0], _homePosition[1]);
            if (vec2d.dist_eucl(_homePosition, [c.lat, c.lon]) > 4) {
                // too far away...
                setSelectedCity("asd", transition);
            } else {
                setSelectedCity(c, transition);
            }
        }
    }


    function loadTimes() {
        $.ajax({url: '/api/reisplanner/actueel',
                success: function(times) {
                    _currentTimes = times;
                    if (_mode != "now") return;
                    _map.updateTimes(now(), times);
                }
               });
    }
    setInterval(loadTimes,60*1000); 


    // Reposition when DOM is ready
    $(document).ready(function()
    {
        reposition();
        drawLoop();

        if (navigator.geolocation) {
            goToHomePosition();
        }

        setSelectedCity("asd");
        updateTime(now());
    });

    var _resizeTimer = new IdleTimer(100, reposition);
    $(window).resize(function(){_resizeTimer.bump();});

    var _closestCity;

    // setup click handler
    var _overlay = $("#overlay");
    function _setHoverInfo(e) 
    {
        e = e || window.event;
        var o = _canvas.offset();

        if (_mode != "now") _nowTimer.bump();

        _closestCity = _map.closestCity(_map.userToWorldCoordinate([e.pageX-o.left, e.pageY-o.top]), true);
        if (_closestCity && _closestCity.code != _selectedCity.code) {
            document.body.style.cursor = _map.isSelectableCity(_closestCity) ? "pointer" : "";
            _updateHoverInfo(_closestCity);
        } else {
            $("#info").fadeOut();
        }
    }

    if (_isMobile)
    {
        _overlay.mouseup(_setHoverInfo);
    }
    else
    {
        _overlay.mousemove(_setHoverInfo);
        _overlay.click(function(e) {
                           e.preventDefault();
                           e.cancelBubble = true;
                           if (_map.isTransitioning()) return false;
                           if (_closestCity && _map.isSelectableCity(_closestCity))
                           {
                               setSelectedCity(_closestCity, true); // transition
                           }
                           return false;
                       })
            .mousewheel(function(e, delta) {
                            _map.zoomInOut(delta);
                            e.cancelBubble = true;
                            e.preventDefault();
                            return false;
                        });
    }

    var _shift = false;
    $(document).keydown(function(e){ _shift = e.shiftKey; });
    $(document).keyup(function(){ _shift = false; });


    $("#info").click(function(e) {
                         setSelectedCity(_closestCity, true); // transition
                     })
        .mousewheel(function(e, delta) {
                        if (_shift) _map.zoomInOut(delta);
                            e.cancelBubble = true;
                            e.preventDefault();
                            return false;
                        });


    if (navigator.geolocation) {
        // Ask the user agent about his geolocation on load.
        $("button.currentlocation")
            .click(function(e) {
                       e.preventDefault();
                       goToHomePosition(true);
                       return false;
                   })
            .mousedown(function(e) {
                           var b = $(this);
                           b.css({'backgroundColor': 'white'});
                           setTimeout(function(){b.css({'backgroundColor': ''});}, 300);
                       });
    } else {
        // no location support in browser
        $("button.currentlocation").hide();
    }


    function doSearch(e) {
        var txt = $("#sidebar input").val();
        var city = null;
        $(_map.getCities()).each(function() {
                                     if (this.code == txt) {
                                         city = this;
                                     }
                                 });
        if (city === null) {
            _map.setSearchCities(txt);
        } else {
            setSelectedCity(city, true);
        }
    }

    var _searchTimer = new IdleTimer(500, doSearch);
    $("#sidebar input").keyup(function() { _searchTimer.bump(); });

    $("#sidebar form").submit(function(e) { _searchTimer.bump(); e.cancelBubble=true; e.preventDefault(); return false; });


    function gotoNow() {
        _setSlider(22, true);
        _mode = "now";
        _currentTime = now();
        updateTime(_currentTime);
        _map.updateTimes(_currentTime, _currentTimes);
    }
    var _nowTimer = new IdleTimer(120*1000, gotoNow);


    function gotoHistory(hours)
    {
        _setSlider(22+hours, true);
        _nowTimer.bump();
        _mode = "history";
        console.log(now());

        var t = (now()-(-hours*3600*1000))/1000;

        t = (Math.floor(t/3600.0)*3600);

        $(".last24 span").removeClass("current");

        _currentTime = new Date(1000*t);
        updateTime(_currentTime);

        if (typeof _historyCache[t] != "undefined") {
            _map.updateTimes(_currentTime, _historyCache[t]);
        } else {
            // FIXME loader
            $.ajax({url: '/api/reisplanner/history?date='+Util.ISODateString(_currentTime),
                    success: function(times) {
                        _historyCache[t] = times;
                        _map.updateTimes(_currentTime, times);
                    }
                   });
        }
    }


    function hideSidebar() {
        var h = $("#sidebar").height();
        $("#sidebar").animate({top: -h+12});
        $("#sidebar #opener").show();
        $("#sidebar #closer").hide();
    }

    function showSidebar() {
        $("#sidebar").animate({top: 28});
        $("#sidebar #opener").hide();
        $("#sidebar #closer").show();
    }

    if (_isMobile && !_isTablet) {
        hideSidebar();
    }


    var _lastidx = 0;
    function _setSlider(idx, doclick) {
        $("div.last24 span")
            .css({left: (1+Math.floor(idx * (235/23)))+"px"});
        $("div.last24 span").attr("class", idx == 22 ? "current" : "");
        if (doclick) {
            _lastidx = idx;
        }
    }
    _setSlider(22, true);

    $("div.last24").mousemove(function(e) {
                                  var o = e.pageX - $("div.last24").offset().left;
                                  var idx = Math.floor((o / 235) * 23);
                                  _setSlider(idx, false);
                              })
        .mouseout(function(e) {
                      _setSlider(_lastidx);
                  })
        .click(function(e) {
                   var o = e.pageX - $("div.last24").offset().left;
                   var idx = Math.floor((o / 235) * 23);

                   var h = 22-idx;
                   if (h > 0) {
                       gotoHistory(-h);
                   } else {
                       gotoNow();
                   }
               });


    setInterval(function()
                {
                    if (_mode != "now") return;
                    // "tick"
                    _currentTime = now();
                    _map.updateTimes(_currentTime);
                    updateTime(_currentTime);
                }, 2000);

    // Public interface
    return {
        getMap: function() 
        {
            return _map;
        },

        goTo: function(city) {
            setSelectedCity(city, true);
        },

        addFavorite: function() {
            var c = _map.getSelectedCity();
            z_event("addFavorite", {code: c.code, name: c.name});
        },

        removeFavorite: function(code) {
            z_event("removeFavorite", {code: code});
            $("h2.favorites a").css({"backgroundColor":""});
        },

        editFavorites: function() {
            $("ul.favorites li a.remove").toggle();
            $("h2.favorites a").css({"backgroundColor":
                                     $("ul.favorites li a.remove:visible").length ? "#FFFDF5": ""});
        },

        showSidebar: function() {
            showSidebar();
        },

        hideSidebar: function() {
            hideSidebar();
        },

        updateTimes: function(d, t) {
            _currentTimes = t;
            _currentTime = d;
            _map.updateTimes(d, t);
        },

        now: function() {
            gotoNow();
        },

        history: function(hours) {
            gotoHistory(hours);
        },

        setTZOffset: function(offset) {
            _tzoffset = offset;
        },

        fillOrderForm: function()
        {
            $("#form-city").val($("#cityheading span.city").text());
            $("#form-date").val($("#cityheading span.date").text());
            $("#form-timestamp").val(Util.ISODateString(_currentTime));
            $("#form-svg").val(_map.getSVGString());
        }

    };
})();;
var InfoWindow =
{

    open: function(html)
    {
        var infowindow = $("#infowindow");
        if (infowindow.length) {
            InfoWindow.close(function(){InfoWindow.open(html);});
        }

        var w = $(window);
        var curtain = $("<div>")
            .addClass("infowindow-curtain")
            .css({position: "absolute", left: 0, top: 0, width: w.width(), height: w.height(), opacity: 0.0})
            .appendTo("body");
        curtain
            .animate({opacity: 0.8})
            .click(function(){InfoWindow.close();});

        infowindow = $("<div id=\"infowindow\">")
            .html(html)
            .css({opacity: 0})
            .appendTo("body");
        var h = $(infowindow).height();
        var w = $(infowindow).width();

        infowindow
            .css({top: -h, left: $("html").width()/2-w/2})
            .animate({top: 0, opacity: 1},
                     function()
                     {
//                         z_init_postback_forms();
                     });

    },

    close: function()
    {
        $("#infowindow, .infowindow-curtain").fadeOut(function(){$(this).remove();});
    }

};
;
// Auto-generated from full_ExtraFlevo_ALLlong02.svg by stations.py
Timemaps.getMap().setShapes([{"points": [[161.931, 11.181], [21.843, 112.176], [21.841, 1179.194], [186.832, 1164.187], [129.618, 1164.196], [114.752, 1179.188], [144.84, 1209.28]], "type": "polygon"}, {"points": [[514.521, 192.389], [527.02, 204.787], [470.821, 261.058], [445.603, 261.058]], "type": "polygon"}, {"points": [[645.636, 119.34], [625.575, 139.544], [611.2, 139.513], [575.533, 175.14], [563.658, 175.14], [549.758, 189.046], [539.44, 178.749], [598.791, 119.326]], "type": "polygon"}, {"points": [[671.593, 111.705], [686.304, 96.993], [777.696, 96.995], [757.649, 117.049], [710.349, 117.036], [699.098, 128.28], [671.598, 128.273]], "type": "polygon"}, {"points": [[849.764, 66.945], [831.324, 85.307], [883.056, 85.307], [901.681, 66.945]], "type": "polygon"}, {"points": [[138.027, 1150.867], [163.131, 1125.779], [199.462, 1162.118], [241.606, 1162.104], [255.589, 1148.274], [214.837, 1107.538], [147.368, 1107.538], [121.072, 1133.839]], "type": "polygon"}, {"points": [[410.591, 315.128], [410.618, 387.506], [448.796, 387.494], [448.799, 380.044], [473.86, 354.989], [473.852, 301.632], [448.979, 276.759]], "type": "polygon"}, {"points": [[264.321, 1085.604], [235.143, 1056.593], [210.077, 1056.587], [180.359, 1086.349], [193.683, 1099.653], [216.06, 1077.444], [264.511, 1125.899], [307.78, 1125.911], [319.741, 1137.8], [345.805, 1137.808], [352.137, 1131.461], [306.69, 1085.595]], "type": "polygon"}, {"points": [[736.788, 566.822], [787.897, 566.817], [806.495, 566.815], [823.546, 583.844], [823.548, 609.583], [823.549, 631.514], [785.677, 669.362], [747.693, 707.323], [747.676, 722.692], [719.866, 750.519], [706.563, 750.513], [693.617, 750.508], [672.467, 729.371], [658.564, 729.387], [643.6, 729.404], [609.307, 694.614], [651.067, 652.753], [690.02, 613.704]], "type": "polygon"}, {"points": [[46.818, 1305.044], [46.788, 1336.033], [70.66, 1359.781], [99.755, 1359.762], [99.77, 1339.369], [177.785, 1339.369], [177.785, 1367.918], [257.579, 1367.889], [289.899, 1335.584], [324.865, 1300.634], [324.824, 1277.027], [400.496, 1276.998], [400.496, 1258.261], [393.17, 1250.896], [412.031, 1231.8], [440.662, 1231.8], [440.662, 1253.224], [481.279, 1253.234], [504.276, 1230.296], [522.706, 1211.913], [545.48, 1211.917], [545.48, 1227.714], [527.801, 1227.714], [527.807, 1253.029], [585.116, 1253.066], [603.016, 1235.03], [617.736, 1220.198], [617.736, 1206.946], [642.247, 1206.946], [642.284, 1248.593], [667.178, 1273.63], [692.991, 1299.591], [729.895, 1299.593], [762.449, 1299.594], [783.906, 1278.423], [808.841, 1303.308], [833.056, 1327.472], [873.336, 1327.472], [873.362, 1361.579], [873.392, 1402.253], [842.232, 1433.266], [842.216, 1481.579], [842.198, 1538.538], [885.562, 1538.538], [922.562, 1538.538], [964.826, 1538.538], [964.825, 1524.251], [986.562, 1502.372], [986.638, 1461.577], [986.711, 1422.421], [957.214, 1422.397], [957.214, 1397.354], [913.199, 1397.357], [952.37, 1358.056], [989.6, 1320.702], [989.59, 1292.625], [968.14, 1292.594], [968.166, 1258.948], [986.384, 1240.734], [1004.26, 1222.861], [1004.258, 1178.58], [1004.256, 1131.763], [965.323, 1092.813], [938.33, 1065.811], [905.396, 1032.862], [905.338, 979.16], [953.771, 979.16], [953.801, 947.194], [993.721, 947.189], [1017.866, 971.47], [1029.377, 971.47], [1029.377, 941.896], [1064.962, 941.896], [1098.899, 907.854], [1146.498, 907.854], [1146.498, 878.915], [1146.498, 850.479], [1114.297, 818.271], [1114.297, 787.792], [1138.321, 787.792], [1179.847, 746.239], [1179.812, 691.58], [1179.778, 638.428], [1132.707, 591.36], [1072.344, 591.343], [1072.297, 519.136], [1090.574, 500.881], [1163.24, 500.888], [1163.24, 457.581], [1163.24, 415.434], [1189.007, 389.542], [1188.988, 332.246], [1188.967, 271.261], [1177.913, 260.339], [1177.922, 213.579], [1177.931, 166.667], [1140.591, 166.682], [1140.595, 133.798], [1067.671, 133.798], [1067.668, 81.713], [1001.899, 81.713], [982.806, 100.675], [929.56, 100.64], [894.853, 135.21], [838.561, 135.201], [778.144, 135.192], [758.491, 154.843], [736.431, 176.903], [707.965, 176.904], [677.642, 207.325], [648.186, 236.875], [648.284, 293.397], [630.426, 311.047], [650.925, 331.427], [650.918, 358.917], [650.907, 386.583], [650.898, 417.198], [673.491, 439.905], [703.232, 439.907], [730.564, 439.909], [759.389, 439.911], [740.295, 459.145], [740.291, 497.582], [740.288, 534.383], [761.856, 555.916], [787.23, 555.916], [819.639, 555.916], [819.604, 573.571], [827.961, 581.918], [827.957, 608.916], [827.954, 636.521], [790.634, 673.657], [754.382, 709.729], [754.367, 729.948], [722.732, 761.608], [707.23, 761.608], [691.946, 761.608], [673.853, 743.733], [658.563, 743.736], [641.575, 743.74], [610.479, 712.504], [593.23, 712.496], [575.098, 712.487], [571.181, 708.573], [584.875, 694.894], [600.0, 679.784], [600.013, 660.247], [600.025, 642.4], [581.135, 623.667], [561.569, 604.263], [561.57, 583.579], [561.571, 563.24], [589.229, 563.219], [614.446, 563.199], [635.375, 542.261], [635.375, 491.219], [604.563, 491.219], [573.598, 491.219], [573.596, 466.915], [573.592, 444.6], [555.27, 426.202], [537.241, 408.099], [520.563, 408.099], [501.681, 408.099], [490.036, 419.722], [477.788, 431.948], [460.94, 415.197], [447.783, 402.119], [427.895, 402.115], [406.74, 402.112], [406.741, 424.246], [406.742, 449.579], [406.744, 470.913], [406.745, 492.073], [387.129, 511.693], [387.128, 542.913], [387.126, 574.579], [387.124, 604.913], [387.122, 639.62], [371.825, 654.846], [355.884, 670.714], [355.885, 694.246], [355.886, 719.263], [328.469, 746.964], [328.469, 770.246], [328.469, 802.247], [328.469, 831.218], [299.723, 860.072], [274.438, 885.452], [248.154, 911.836], [216.536, 943.573], [216.543, 967.58], [216.551, 995.581], [216.558, 1024.854], [267.806, 1076.247], [314.742, 1076.26], [344.866, 1106.437], [445.529, 1106.437], [445.529, 1116.656], [375.908, 1116.683], [375.896, 1136.261], [357.618, 1154.407], [278.243, 1154.431], [244.955, 1187.55], [267.368, 1209.953], [327.913, 1209.953], [341.754, 1223.802], [341.763, 1234.803], [260.41, 1234.793], [229.39, 1203.712], [164.274, 1203.768], [145.859, 1222.146], [113.96, 1190.419], [85.149, 1190.425], [55.048, 1220.659], [99.618, 1265.182], [151.846, 1265.188], [164.493, 1277.819], [217.659, 1277.792], [217.666, 1248.501], [245.399, 1248.505], [258.493, 1261.511], [324.39, 1261.511], [324.366, 1277.79], [315.866, 1277.79], [301.533, 1292.044], [269.577, 1292.036], [251.689, 1274.188], [232.62, 1274.212], [232.625, 1285.142], [217.285, 1300.556], [149.535, 1300.556], [131.74, 1282.723], [69.077, 1282.734]], "type": "polygon"}]);

// Auto-generated from full_ExtraFlevo_ALLlong02.svg by stations.py
Timemaps.getMap().setLines([[[634.12783, 313.48311], [538.09718, 409.51376]], [[634.77888, 542.32903], [697.6057199999999, 605.1558699999999]], [[372.40361, 1105.1663], [348.80286, 1128.7671]], [[265.63055, 1125.349], [248.37758000000002, 1142.6019999999999]], [[249.35417, 1054.0585], [241.05321, 1062.3594]], [[192.71236, 1098.0047], [181.80718, 1108.9098999999999]], [[135.09397, 1148.136], [131.18764000000002, 1165.3889]], [[122.39839, 1185.8972], [115.23678000000001, 1192.0822]], [[199.87397, 1192.0822], [199.54844000000003, 1204.4522]], [[199.22291, 1158.8784], [191.08472, 1167.3421]]]);
