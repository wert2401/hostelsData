(function() {
    const FILL = 0; // const to indicate filltext render
    const STROKE = 1;
    var renderType = FILL; // used internal to set fill or stroke text
    const multiplyCurrentTransform = false; // if true Use current transform when rendering
    // if false use absolute coordinates which is a little quicker
    // after render the currentTransform is restored to default transform



    // measure circle text
    // ctx: canvas context
    // text: string of text to measure
    // r: radius in pixels
    //
    // returns the size metrics of the text
    //
    // width: Pixel width of text
    // angularWidth : angular width of text in radians
    // pixelAngularSize : angular width of a pixel in radians
    var measure = function(ctx, text, radius) {
        var textWidth = ctx.measureText(text).width; // get the width of all the text
        return {
            width: textWidth,
            angularWidth: (1 / radius) * textWidth,
            pixelAngularSize: 1 / radius
        };
    }

    // displays text along a circle
    // ctx: canvas context
    // text: string of text to measure
    // x,y: position of circle center
    // r: radius of circle in pixels
    // start: angle in radians to start. 
    // [end]: optional. If included text align is ignored and the text is 
    //        scaled to fit between start and end;
    // [forward]: optional default true. if true text direction is forwards, if false  direction is backward
    var circleText = function(ctx, text, x, y, radius, start, end, forward) {
            var i, textWidth, pA, pAS, a, aw, wScale, aligned, dir, fontSize;
            if (text.trim() === "" || ctx.globalAlpha === 0) { // dont render empty string or transparent
                return;
            }
            if (isNaN(x) || isNaN(y) || isNaN(radius) || isNaN(start) || (end !== undefined && end !== null && isNaN(end))) { // 
                throw TypeError("circle text arguments requires a number for x,y, radius, start, and end.")
            }
            aligned = ctx.textAlign; // save the current textAlign so that it can be restored at end
            dir = forward ? 1 : forward === false ? -1 : 1; // set dir if not true or false set forward as true  
            pAS = 1 / radius; // get the angular size of a pixel in radians
            textWidth = ctx.measureText(text).width; // get the width of all the text
            if (end !== undefined && end !== null) { // if end is supplied then fit text between start and end
                pA = ((end - start) / textWidth) * dir;
                wScale = (pA / pAS) * dir;
            } else { // if no end is supplied correct start and end for alignment
                // if forward is not given then swap top of circle text to read the correct direction
                if (forward === null || forward === undefined) {
                    if (((start % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) > Math.PI) {
                        dir = -1;
                    }
                }
                pA = -pAS * dir;
                wScale = -1 * dir;
                switch (aligned) {
                    case "center": // if centered move around half width
                        start -= (pA * textWidth) / 2;
                        end = start + pA * textWidth;
                        break;
                    case "right": // intentionally falls through to case "end"
                    case "end":
                        end = start;
                        start -= pA * textWidth;
                        break;
                    case "left": // intentionally falls through to case "start"
                    case "start":
                        end = start + pA * textWidth;
                }
            }

            ctx.textAlign = "center"; // align for rendering
            a = start; // set the start angle
            for (var i = 0; i < text.length; i += 1) { // for each character
                aw = ctx.measureText(text[i]).width * pA; // get the angular width of the text
                var xDx = Math.cos(a + aw / 2); // get the yAxies vector from the center x,y out
                var xDy = Math.sin(a + aw / 2);
                if (multiplyCurrentTransform) { // transform multiplying current transform
                    ctx.save();
                    if (xDy < 0) { // is the text upside down. If it is flip it
                        ctx.transform(-xDy * wScale, xDx * wScale, -xDx, -xDy, xDx * radius + x, xDy * radius + y);
                    } else {
                        ctx.transform(-xDy * wScale, xDx * wScale, xDx, xDy, xDx * radius + x, xDy * radius + y);
                    }
                } else {
                    if (xDy < 0) { // is the text upside down. If it is flip it
                        ctx.setTransform(-xDy * wScale, xDx * wScale, -xDx, -xDy, xDx * radius + x, xDy * radius + y);
                    } else {
                        ctx.setTransform(-xDy * wScale, xDx * wScale, xDx, xDy, xDx * radius + x, xDy * radius + y);
                    }
                }
                if (renderType === FILL) {
                    ctx.fillText(text[i], 0, 0); // render the character
                } else {
                    ctx.strokeText(text[i], 0, 0); // render the character
                }
                if (multiplyCurrentTransform) { // restore current transform
                    ctx.restore();
                }
                a += aw; // step to the next angle
            }
            // all done clean up.
            if (!multiplyCurrentTransform) {
                ctx.setTransform(1, 0, 0, 1, 0, 0); // restore the transform
            }
            ctx.textAlign = aligned; // restore the text alignment
        }
        // define fill text
    var fillCircleText = function(text, x, y, radius, start, end, forward) {
            renderType = FILL;
            circleText(this, text, x, y, radius, start, end, forward);
        }
        // define stroke text
    var strokeCircleText = function(text, x, y, radius, start, end, forward) {
            renderType = STROKE;
            circleText(this, text, x, y, radius, start, end, forward);
        }
        // define measure text
    var measureCircleTextExt = function(text, radius) {
            return measure(this, text, radius);
        }
        // set the prototypes
    CanvasRenderingContext2D.prototype.fillCircleText = fillCircleText;
    CanvasRenderingContext2D.prototype.strokeCircleText = strokeCircleText;
    CanvasRenderingContext2D.prototype.measureCircleText = measureCircleTextExt;
})();

export default class Wheel {

    defaultConfig = {
        radius: 200,
        levels: 10,
        fontSize: 15,
        segments: [{
                color: "#97CC64",
                text: "Section 1",
                level: 10
            },
            {
                color: "#4569BC",
                text: "Section 2",
                level: 10
            },
            {
                color: "#A955B8",
                text: "Section 3",
                level: 10
            }
        ]
    };

    constructor(canvas, config) {
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw "First argument should be of type HTMLCanvasElement";
        }

        this.canvas = canvas;

        if (config) {
            this.config = config;

            if (!this.config.fontSize) {
                this.config.fontSize = this.defaultConfig.fontSize;
            }

            if (!this.config.radius) {
                this.config.radius = this.defaultConfig.radius;
            }

            if (!this.config.levels) {
                this.config.levels = this.defaultConfig.levels;
            }
        } else {
            this.config = this.defaultConfig;
        }

        const width = canvas.width;
        const height = canvas.height;

        this.config.center = {
            x: width / 2,
            y: height / 2
        };

        const maxRadius = Math.min(width, height) / 2 - this.config.fontSize;
        this.config.radius = Math.min(this.config.radius, maxRadius);

        this.step = this.config.radius / this.config.levels;
        this.degreesPerSegment = 360 / this.config.segments.length;
        this.radiansPerSegment = this.degreesPerSegment / 180 * Math.PI;
        this.data = this.config.segments.map(s => ({
            level: s.level
        }));

        this.canvas.onmousedown = event => this.setLevel(canvas, event);
    }

    draw = function() {
        const ctx = this.canvas.getContext('2d');

        this.canvas.style.font = ctx.font;
        this.canvas.style.fontSize = this.config.fontSize + "px";
        ctx.font = this.canvas.style.font;
        ctx.textBaseline = "middle";

        this.drawSegments(ctx, this.config.center, this.config.segments, this.radiansPerSegment, this.step);
        this.drawCircles(ctx, this.config.center, this.config.levels, this.step, this.config.segments.length);
        this.drawTexts(ctx, this.config.center, this.config.segments, this.radiansPerSegment, this.config.radius, this.config.fontSize);
    };

    download = function() {
        this.canvas.toBlob(function(blob) {
            saveAs(blob, "wheel-of-balance.jpg");
        }, "image/jpeg");
    };

    clear = function() {
        this.data = this.config.segments.map(s => ({
            level: s.level || this.config.levels
        }));

        this.redraw();
    };

    redraw() {
        this.clean();
        this.draw();
    };

    clean() {
        const context = this.canvas.getContext('2d');

        context.beginPath();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.closePath();
    };

    drawSegments(ctx, center, segments, radiansPerSegment, step) {

        for (var i = 0; i < segments.length; i++) {
            const startAngle = i * radiansPerSegment;
            const endAngle = startAngle + radiansPerSegment;

            const segment = segments[i];
            const dataItem = this.data[i];

            this.drawSegment(ctx, center, step * dataItem.level, startAngle, endAngle, segment.color);
        }
    };

    drawTexts(ctx, center, segments, radiansPerSegment, radius, fontSize) {
        for (var i = 0; i < segments.length; i++) {

            const segment = segments[i];

            const startAngle = i * radiansPerSegment;
            const endAngle = startAngle + radiansPerSegment;
            let centerAngel = (startAngle + endAngle) / 2;

            const textAngularWidth = ctx.measureCircleText(segment.text, radius).angularWidth;
            if (centerAngel >= Math.PI) {
                centerAngel -= textAngularWidth / 2;
            } else {
                centerAngel += textAngularWidth / 2;
            }

            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            //Titles color
            ctx.fillStyle = "#FFF";
            ctx.fillCircleText(segment.text, center.x, center.y, radius + fontSize / 1.5, centerAngel);
            //Numbers color
            ctx.fillStyle = "#000";
            ctx.fillCircleText(this.data[i].level.toFixed(2).toString(), center.x, center.y, radius / 2, centerAngel);

            ctx.fill();
            ctx.closePath();
        }
    };

    drawSegment(ctx, center, radius, startAngle, endAngle, color) {
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.arc(center.x, center.y, radius, startAngle, endAngle, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    };

    drawCircles(ctx, center, levels, step, segmentsCount) {

        for (let i = 1; i <= segmentsCount; i++) {
            const radians = i * (360 / segmentsCount) / 180 * Math.PI;
            const endX = center.x + levels * step * Math.cos(radians);
            const endY = center.y - levels * step * Math.sin(radians);

            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        }

        let currentR = step;

        for (let i = 0; i < levels; i++) {

            ctx.beginPath();
            ctx.arc(center.x, center.y, currentR, 0, 2 * Math.PI);
            ctx.strokeStyle = "#808080";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();

            currentR += step;
        }
    };

    setLevel(canvas, e) {
        const {
            dx,
            dy
        } = this.calculateLineEnd(canvas, this.config.center, e);

        const degrees = this.calculateLineAngel(dx, dy);
        const segmentId = Math.floor(degrees / this.degreesPerSegment);
        let dataItem = this.data[segmentId];

        const pointRadius = Math.sqrt(dx * dx + dy * dy);
        const length = Math.min(pointRadius, this.config.radius);
        dataItem.level = length / this.step;

        this.redraw();
    };

    calculateLineEnd(canvas, center, e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        return {
            dx: x - center.x,
            dy: y - center.y,
        };
    };

    calculateLineAngel(dx, dy) {
        let radians = Math.atan(dy / dx); // wrong, in [-1/2 pi, 1/2 pi]

        if (1 / dx < 0) radians += Math.PI; // fixed, in [-1/2 pi, 3/2 pi]
        if (1 / radians < 0) radians += 2 * Math.PI; // fixed, in [+0, 2 pi]

        return radians * 180 / Math.PI;
    };
}

window.Wheel = Wheel;