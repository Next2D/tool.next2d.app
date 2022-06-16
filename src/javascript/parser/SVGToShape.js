/**
 * @class
 */
class SVGToShape
{
    /**
     * @param  {string} value
     * @param  {MovieClip} movie_clip
     * @return {void}
     * @method
     * @static
     */
    static parse (value, movie_clip)
    {
        const defs  = /<defs>(.*)<\/defs>/sgi.exec(value);
        const paths = SVGToShape.parseXML(
            `${value.replace(/<defs>(.*)<\/defs>/sgi, "")}`
        );

        if (paths) {

            SVGToShape.parsePath(paths, movie_clip, defs ? defs[1] : null);

            const layers = [];
            for (const layer of movie_clip._$layers.values()) {
                layers.unshift(layer);
            }

            movie_clip.clearLayer();
            for (let idx = 0; idx < layers.length; ++idx) {
                movie_clip.setLayer(idx, layers[idx]);
            }
        }
    }

    /**
     * @param  {string} xml
     * @return {array}
     * @method
     * @static
     */
    static parseXML (xml)
    {
        const pathReg = /<((path|rect|circle|polygon).+?)\/>/gi;

        const paths = [];
        for (let reg = "1"; reg;) {
            reg = pathReg.exec(xml);
            reg && paths.push(reg[1]);
        }

        return paths;
    }

    /**
     * @param  {array}     paths
     * @param  {MovieClip} movie_clip
     * @param  {string}    [defs=null]
     * @method
     * @static
     */
    static parsePath (paths, movie_clip, defs = null)
    {
        const { Shape, Graphics } = window.next2d.display;
        const workSpace = Util.$currentWorkSpace();

        for (let idx = 0; idx < paths.length; ++idx) {

            const graphics = new Shape().graphics;

            const value = paths[idx];

            // STROKE
            let strokeWidth = /stroke-width=\"(.+?)\"/gi.exec(value);
            if (!strokeWidth) {
                strokeWidth = /stroke-width:(.+?)["|;]/gi.exec(value);
            }

            if (strokeWidth) {
                strokeWidth = +strokeWidth[1];
                if (strokeWidth) {
                    let color = /stroke=\"(.+?)\"/gi.exec(value);
                    if (!color) {
                        color = /stroke:(.+?)["|;]/gi.exec(value);
                    }

                    graphics.lineStyle(strokeWidth, color ? color[1] : 0);
                }
            }

            // FILL
            let color = /fill=\"(.+?)\"/gi.exec(value);
            if (!color) {
                color = /fill:(.+?)["|;]/gi.exec(value);
            }

            let alpha = 1;
            let style = /style=\"(.+?)\"/gi.exec(value);
            if (style && style[1].indexOf("opacity") > -1) {
                alpha = style[1].split(":")[1];
            }

            if (color) {
                graphics.beginFill(color[1], +alpha);
            } else {
                if (!strokeWidth) {
                    graphics.beginFill(0, +alpha);
                }
            }

            const id = workSpace.nextLibraryId;

            const shape = workSpace.addLibrary(
                Util.$controller.createContainer("shape", `Shape_${id}`, id)
            );

            const layer = new Layer();
            layer.name  = `Layer_${movie_clip._$layers.size}`;
            layer
                ._$frame
                .setClasses(1, [
                    "key-frame"
                ]);

            movie_clip.setLayer(movie_clip._$layers.size, layer);

            const character = new Character();
            character.libraryId  = shape.id;
            character.startFrame = 1;
            character.endFrame   = layer.getEndFrame(2);
            character.setPlace(1, {
                "frame": 1,
                "matrix": [1, 0, 0, 1, 0, 0],
                "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                "blendMode": "normal",
                "filter": [],
                "depth": layer._$characters.length
            });
            layer.addCharacter(character);

            // draw rect
            if (value.indexOf("rect") > -1) {

                const param  = value.replace("rect", "");
                const x      = +/x=\"(.+?)\"/gi.exec(param)[1];
                const y      = +/y=\"(.+?)\"/gi.exec(param)[1];
                const width  = +/width=\"(.+?)\"/gi.exec(param)[1];
                const height = +/height=\"(.+?)\"/gi.exec(param)[1];
                const rx     = +/rx=\"(.+?)\"/gi.exec(param)[1];

                graphics
                    .drawRoundRect(x, y, width, height, rx * 2)
                    .endFill();

                shape._$recodes = graphics._$recode.slice();
                shape._$bounds = {
                    "xMin": graphics._$xMin,
                    "xMax": graphics._$xMax,
                    "yMin": graphics._$yMin,
                    "yMax": graphics._$yMax
                };

                continue;
            }

            if (value.indexOf("circle") > -1) {

                const param = value.replace("rect", "");
                const x     = +/cx=\"(.+?)\"/gi.exec(param)[1];
                const y     = +/cy=\"(.+?)\"/gi.exec(param)[1];
                const r     = +/r=\"(.+?)\"/gi.exec(param)[1];

                graphics
                    .drawCircle(x, y, r)
                    .endFill();

                shape._$recodes = graphics._$recode.slice();
                shape._$bounds = {
                    "xMin": graphics._$xMin,
                    "xMax": graphics._$xMax,
                    "yMin": graphics._$yMin,
                    "yMax": graphics._$yMax
                };

                continue;
            }

            if (value.indexOf("polygon") > -1) {

                const path = value.replace("polygon", "");

                let points = /points=\"(.+?)\"/gi.exec(path)[1];

                points = points.replace(/,/g, " ");
                points = points.replace(/-/g, " -");
                points = points.trim().split(" ");
                points = SVGToShape._$adjParam(points);

                graphics.moveTo(+points[0], +points[1]);
                for (let idx = 2; idx < points.length; idx += 2) {
                    graphics.lineTo(
                        +points[idx    ],
                        +points[idx + 1]
                    );
                }
                graphics.endFill();

                shape._$recodes = graphics._$recode.slice();
                shape._$bounds = {
                    "xMin": graphics._$xMin,
                    "xMax": graphics._$xMax,
                    "yMin": graphics._$yMin,
                    "yMax": graphics._$yMax
                };

                continue;
            }

            let start   = false;
            let startX  = 0;
            let startY  = 0;

            const currentPoint = [0, 0];
            const lastControl  = [0, 0];
            const actionReg = /([a-z])([^a-z]*)/gi;

            const d = /d=\"(.+?)\"/gi.exec(value)[1];
            for (let reg = "1"; reg;) {

                // TODO transform
                // let tx = 0;
                // let ty = 0;
                // if (value.indexOf("translate") > -1) {
                //
                //     let translate = /translate\((.+?)\)/gi.exec(value)[1];
                //     translate = translate.replace(/,/g, " ");
                //     translate = translate.replace(/-/g, " -");
                //     translate = translate.trim().split(" ");
                //     translate = SVGToShape._$adjParam(translate);
                //
                //     const param = [];
                //     for (let idx = 0; idx < translate.length; ++idx) {
                //
                //         const value = translate[idx];
                //         if (value === "") {
                //             continue;
                //         }
                //
                //         param.push(+value);
                //     }
                //
                //     tx = param[0];
                //     ty = param[1];
                // }

                reg = actionReg.exec(d);
                if (reg) {

                    const type = `${reg[1]}`;

                    let param = reg[2];
                    switch (type) {

                        case "m":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            currentPoint[0] += +param[0];
                            currentPoint[1] += +param[1];

                            if (!start) {
                                start = true;
                                startX = currentPoint[0];
                                startY = currentPoint[1];
                            }

                            graphics.moveTo(
                                currentPoint[0],
                                currentPoint[1]
                            );

                            for (let idx = 2; idx < param.length; idx += 2) {
                                currentPoint[0] += +param[idx    ];
                                currentPoint[1] += +param[idx + 1];
                                lastControl[0]   = currentPoint[0];
                                lastControl[1]   = currentPoint[1];
                                graphics.lineTo(
                                    currentPoint[0],
                                    currentPoint[1]
                                );
                            }
                            break;

                        case "M":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            currentPoint[0] = +param[0];
                            currentPoint[1] = +param[1];

                            if (!start) {
                                start = true;
                                startX = currentPoint[0];
                                startY = currentPoint[1];
                            }

                            graphics.moveTo(
                                currentPoint[0],
                                currentPoint[1]
                            );

                            for (let idx = 2; idx < param.length; idx += 2) {
                                currentPoint[0] = +param[idx    ];
                                currentPoint[1] = +param[idx + 1];
                                lastControl[0]  = currentPoint[0];
                                lastControl[1]  = currentPoint[1];
                                graphics.lineTo(
                                    currentPoint[0],
                                    currentPoint[1]
                                );
                            }
                            break;

                        case "l":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 2) {
                                currentPoint[0] += +param[idx    ];
                                currentPoint[1] += +param[idx + 1];
                                lastControl[0]   = currentPoint[0];
                                lastControl[1]   = currentPoint[1];
                                graphics.lineTo(
                                    currentPoint[0],
                                    currentPoint[1]
                                );
                            }
                            break;

                        case "L":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 2) {
                                currentPoint[0] = +param[idx    ];
                                currentPoint[1] = +param[idx + 1];
                                lastControl[0]  = currentPoint[0];
                                lastControl[1]  = currentPoint[1];
                                graphics.lineTo(
                                    currentPoint[0],
                                    currentPoint[1]
                                );
                            }
                            break;

                        case "h":
                            currentPoint[0] += +param;
                            lastControl[0]   = currentPoint[0];
                            graphics.lineTo(
                                currentPoint[0],
                                currentPoint[1]
                            );
                            break;

                        case "H":
                            currentPoint[0] = +param;
                            lastControl[0]  = currentPoint[0];
                            graphics.lineTo(
                                currentPoint[0],
                                currentPoint[1]
                            );
                            break;

                        case "v":
                            currentPoint[1] += +param;
                            lastControl[1]   = currentPoint[1];
                            graphics.lineTo(
                                currentPoint[0],
                                currentPoint[1]
                            );
                            break;

                        case "V":
                            currentPoint[1] = +param;
                            lastControl[1]  = currentPoint[1];
                            graphics.lineTo(currentPoint[0], currentPoint[1]);
                            break;

                        case "q":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 4) {

                                param[idx    ] = +param[idx    ] + currentPoint[0];
                                param[idx + 1] = +param[idx + 1] + currentPoint[1];
                                param[idx + 2] = +param[idx + 2] + currentPoint[0];
                                param[idx + 3] = +param[idx + 3] + currentPoint[1];

                                graphics.curveTo(
                                    param[idx    ], param[idx + 1],
                                    param[idx + 2], param[idx + 3]
                                );

                                currentPoint[0] = param[idx + 2];
                                currentPoint[1] = param[idx + 3];

                                lastControl[0]  = currentPoint[0];
                                lastControl[1]  = currentPoint[1];
                            }
                            break;

                        case "Q":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 4) {

                                param[idx    ] = +param[idx    ];
                                param[idx + 1] = +param[idx + 1];
                                param[idx + 2] = +param[idx + 2];
                                param[idx + 3] = +param[idx + 3];

                                graphics.curveTo(
                                    param[idx    ], param[idx + 1],
                                    param[idx + 2], param[idx + 3]
                                );

                                currentPoint[0] = param[idx + 2];
                                currentPoint[1] = param[idx + 3];

                                lastControl[0]  = currentPoint[0];
                                lastControl[1]  = currentPoint[1];
                            }
                            break;

                        case "c":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 6) {

                                param[idx    ] = +param[idx    ] + currentPoint[0];
                                param[idx + 1] = +param[idx + 1] + currentPoint[1];
                                param[idx + 2] = +param[idx + 2] + currentPoint[0];
                                param[idx + 3] = +param[idx + 3] + currentPoint[1];
                                param[idx + 4] = +param[idx + 4] + currentPoint[0];
                                param[idx + 5] = +param[idx + 5] + currentPoint[1];

                                graphics.cubicCurveTo(
                                    param[idx    ], param[idx + 1], param[idx + 2],
                                    param[idx + 3], param[idx + 4], param[idx + 5]
                                );

                                currentPoint[0] = param[idx + 4];
                                currentPoint[1] = param[idx + 5];

                                lastControl[0] = 2 * param[idx + 4] - param[idx + 2];
                                lastControl[1] = 2 * param[idx + 5] - param[idx + 3];
                            }

                            break;

                        case "C":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 6) {

                                param[idx    ] = +param[idx    ];
                                param[idx + 1] = +param[idx + 1];
                                param[idx + 2] = +param[idx + 2];
                                param[idx + 3] = +param[idx + 3];
                                param[idx + 4] = +param[idx + 4];
                                param[idx + 5] = +param[idx + 5];

                                graphics.cubicCurveTo(
                                    param[idx    ], param[idx + 1], param[idx + 2],
                                    param[idx + 3], param[idx + 4], param[idx + 5]
                                );

                                currentPoint[0] = param[idx + 4];
                                currentPoint[1] = param[idx + 5];

                                lastControl[0] = 2 * param[idx + 4] - param[idx + 2];
                                lastControl[1] = 2 * param[idx + 5] - param[idx + 3];

                            }
                            break;

                        case "s":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 4) {

                                param[idx    ] = +param[idx    ] + currentPoint[0];
                                param[idx + 1] = +param[idx + 1] + currentPoint[1];
                                param[idx + 2] = +param[idx + 2] + currentPoint[0];
                                param[idx + 3] = +param[idx + 3] + currentPoint[1];

                                graphics.cubicCurveTo(
                                    lastControl[0], lastControl[1],
                                    param[idx    ], param[idx + 1],
                                    param[idx + 2], param[idx + 3]
                                );

                                currentPoint[0] = param[idx + 2];
                                currentPoint[1] = param[idx + 3];

                                lastControl[0] = 2 * param[idx + 2] - param[idx    ];
                                lastControl[1] = 2 * param[idx + 3] - param[idx + 1];
                            }

                            break;

                        case "S":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 4) {

                                param[idx    ] = +param[idx    ];
                                param[idx + 1] = +param[idx + 1];
                                param[idx + 2] = +param[idx + 2];
                                param[idx + 3] = +param[idx + 3];

                                graphics.cubicCurveTo(
                                    lastControl[0], lastControl[1],
                                    param[idx    ], param[idx + 1],
                                    param[idx + 2], param[idx + 3]
                                );

                                currentPoint[0] = param[idx + 2];
                                currentPoint[1] = param[idx + 3];

                                lastControl[0] = 2 * param[idx + 2] - param[idx    ];
                                lastControl[1] = 2 * param[idx + 3] - param[idx + 1];
                            }
                            break;

                        case "a":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 7) {

                                param[idx    ] = +param[idx    ];
                                param[idx + 1] = +param[idx + 1];
                                param[idx + 2] = +param[idx + 2];
                                param[idx + 3] = +param[idx + 3];
                                param[idx + 4] = +param[idx + 4];
                                param[idx + 5] = +param[idx + 5] + currentPoint[0];
                                param[idx + 6] = +param[idx + 6] + currentPoint[1];

                                const curves = SVGToShape._$arcToCurve(
                                    currentPoint[0], currentPoint[1],
                                    param[idx + 5], param[idx + 6],
                                    param[idx + 3], param[idx + 4],
                                    param[idx    ], param[idx + 1],
                                    param[idx + 2]
                                );

                                for (let idx = 0; idx < curves.length; ++idx) {
                                    const curve = curves[idx];
                                    graphics.cubicCurveTo(
                                        curve[0], curve[1],
                                        curve[2], curve[3],
                                        curve[4], curve[5]
                                    );
                                }

                                currentPoint[0] = param[idx + 5];
                                currentPoint[1] = param[idx + 6];

                                lastControl[0]  = currentPoint[0];
                                lastControl[1]  = currentPoint[1];
                            }

                            break;

                        case "A":
                            param = param.replace(/,/g, " ");
                            param = param.replace(/-/g, " -");
                            param = param.trim().split(" ");
                            param = SVGToShape._$adjParam(param);

                            for (let idx = 0; idx < param.length; idx += 7) {

                                param[idx    ] = +param[idx    ];
                                param[idx + 1] = +param[idx + 1];
                                param[idx + 2] = +param[idx + 2];
                                param[idx + 3] = +param[idx + 3];
                                param[idx + 4] = +param[idx + 4];
                                param[idx + 5] = +param[idx + 5];
                                param[idx + 6] = +param[idx + 6];

                                const curves = SVGToShape._$arcToCurve(
                                    currentPoint[0], currentPoint[1],
                                    param[idx + 5], param[idx + 6],
                                    param[idx + 3], param[idx + 4],
                                    param[idx    ], param[idx + 1],
                                    param[idx + 2]
                                );

                                for (let idx = 0; idx < curves.length; ++idx) {
                                    const curve = curves[idx];
                                    graphics.cubicCurveTo(
                                        curve[0], curve[1],
                                        curve[2], curve[3],
                                        curve[4], curve[5]
                                    );
                                }

                                currentPoint[0] = param[idx + 5];
                                currentPoint[1] = param[idx + 6];

                                lastControl[0]  = currentPoint[0];
                                lastControl[1]  = currentPoint[1];
                            }
                            break;

                        case "z":
                        case "Z":
                            if (graphics._$fills) {
                                graphics._$fills.push(Graphics.CLOSE_PATH);
                            }
                            if (graphics._$lines) {
                                graphics._$lines.push(Graphics.CLOSE_PATH);
                            }

                            currentPoint[0] = startX;
                            currentPoint[1] = startY;
                            lastControl[0]  = currentPoint[0];
                            lastControl[1]  = currentPoint[1];
                            start = false;
                            break;

                        default:
                            console.log("TODO: ", type, param);
                            break;

                    }
                }
            }
            graphics.endLine();
            graphics.endFill();

            if (graphics._$recode) {
                shape._$recodes = graphics._$recode.slice();
            }

            shape._$bounds = {
                "xMin": graphics._$xMin,
                "xMax": graphics._$xMax,
                "yMin": graphics._$yMin,
                "yMax": graphics._$yMax
            };
        }
    }

    /**
     * @param  {array} param
     * @return {array}
     * @private
     */
    static _$adjParam (param)
    {
        for (;;) {
            let count = 0;
            for (let idx = 0; idx < param.length; ++idx) {

                const value = param[idx];
                if (!isNaN(value)) {
                    count++;
                    continue;
                }

                const values = value.split(".");
                param.splice(idx + 1, 0, `0.${values.pop()}`);
                param[idx] = values.join(".");
            }

            if (param.length === count) {
                break;
            }
        }
        return param;
    }

    /**
     * @param {next2d.display.Graphics} graphics
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {number} start_ang
     * @param {number} end_ang
     * @private
     * @static
     */
    static _$arc (graphics, x, y, radius, start_ang, end_ang)
    {
        let num = Math.min(Math.ceil(radius * 2 + 1), 1024);
        if (num < 1) {
            return;
        }

        start_ang = start_ang === undefined
            ? 0
            : start_ang;

        end_ang = end_ang === undefined
            ? Math.PI * 2
            : end_ang;

        const delta = (end_ang - start_ang) / num;
        for (let idx = 0; idx <= num; idx++) {
            const f = start_ang + idx * delta;
            graphics.lineTo(x + Math.cos(f) * radius, y + Math.sin(f) * radius);
        }
    }

    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} fa
     * @param {number} fs
     * @param {number} rx
     * @param {number} ry
     * @param {number} phi
     * @private
     * @static
     */
    static _$arcToCurve (x1, y1, x2, y2, fa, fs, rx, ry, phi)
    {
        const TAU = Math.PI * 2;
        const sin_phi = Math.sin(phi * TAU / 360);
        const cos_phi = Math.cos(phi * TAU / 360);

        const x1p = cos_phi  * (x1 - x2) / 2 + sin_phi * (y1 - y2) / 2;
        const y1p = -sin_phi * (x1 - x2) / 2 + cos_phi * (y1 - y2) / 2;

        if (x1p === 0 && y1p === 0 || rx === 0 || ry === 0) {
            return [];
        }

        rx = Math.abs(rx);
        ry = Math.abs(ry);

        const lambda = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry);
        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        const cc = SVGToShape._$getArcCenter(
            x1, y1, x2, y2, fa, fs,
            rx, ry, sin_phi, cos_phi
        );

        const result = [];
        let theta1 = cc[2];
        let delta_theta = cc[3];

        const segments = Math.max(Math.ceil(Math.abs(delta_theta) / (TAU / 4)), 1);
        delta_theta /= segments;

        for (let idx = 0; idx < segments; idx++) {
            result.push(SVGToShape._$approximateUnitArc(theta1, delta_theta));
            theta1 += delta_theta;
        }

        return result.map((curve) =>
        {
            for (let idx = 0; idx < curve.length; idx += 2) {

                let x = curve[idx    ];
                let y = curve[idx + 1];

                // scale
                x *= rx;
                y *= ry;

                // rotate
                const xp = cos_phi * x - sin_phi * y;
                const yp = sin_phi * x + cos_phi * y;

                // translate
                curve[idx    ] = xp + cc[0];
                curve[idx + 1] = yp + cc[1];
            }

            curve.shift();
            curve.shift();

            return curve;
        });
    }

    /**
     * @param {number} theta1
     * @param {number} delta_theta
     * @return {array}
     * @private
     * @static
     */
    static _$approximateUnitArc (theta1, delta_theta)
    {
        const alpha = 4 / 3 * Math.tan(delta_theta / 4);

        const x1 = Math.cos(theta1);
        const y1 = Math.sin(theta1);
        const x2 = Math.cos(theta1 + delta_theta);
        const y2 = Math.sin(theta1 + delta_theta);

        return [
            x1, y1,
            x1 - y1 * alpha,
            y1 + x1 * alpha,
            x2 + y2 * alpha,
            y2 - x2 * alpha,
            x2, y2
        ];
    }

    /**
     *
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} fa
     * @param {number} fs
     * @param {number} rx
     * @param {number} ry
     * @param {number} sin_phi
     * @param {number} cos_phi
     * @return {array}
     * @private
     * @static
     */
    static _$getArcCenter (x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi)
    {
        const TAU = Math.PI * 2;

        const x1p = cos_phi  * (x1 - x2) / 2 + sin_phi * (y1 - y2) / 2;
        const y1p = -sin_phi * (x1 - x2) / 2 + cos_phi * (y1 - y2) / 2;

        const rx_sq  = rx * rx;
        const ry_sq  = ry * ry;
        const x1p_sq = x1p * x1p;
        const y1p_sq = y1p * y1p;

        let radicant = rx_sq * ry_sq - rx_sq * y1p_sq - ry_sq * x1p_sq;

        if (radicant < 0) {
            radicant = 0;
        }

        radicant /= rx_sq * y1p_sq + ry_sq * x1p_sq;
        radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);

        const cxp = radicant *  rx / ry * y1p;
        const cyp = radicant * -ry / rx * x1p;

        const cx = cos_phi * cxp - sin_phi * cyp + (x1 + x2) / 2;
        const cy = sin_phi * cxp + cos_phi * cyp + (y1 + y2) / 2;

        const v1x = (x1p - cxp)  / rx;
        const v1y = (y1p - cyp)  / ry;
        const v2x = (-x1p - cxp) / rx;
        const v2y = (-y1p - cyp) / ry;

        const theta1 = SVGToShape._$unitVectorAngle(1, 0, v1x, v1y);
        let delta_theta = SVGToShape._$unitVectorAngle(v1x, v1y, v2x, v2y);

        if (fs === 0 && delta_theta > 0) {
            delta_theta -= TAU;
        }
        if (fs === 1 && delta_theta < 0) {
            delta_theta += TAU;
        }

        return [cx, cy, theta1, delta_theta];
    }

    /**
     * @param  {number} ux
     * @param  {number} uy
     * @param  {number} vx
     * @param  {number} vy
     * @return {number}
     * @static
     * @private
     */
    static _$unitVectorAngle (ux, uy, vx, vy)
    {
        const sign = ux * vy - uy * vx < 0 ? -1 : 1;
        let dot = ux * vx + uy * vy;

        if (dot > 1.0) {
            dot = 1.0;
        }

        if (dot < -1.0) {
            dot = -1.0;
        }

        return sign * Math.acos(dot);
    }
}
