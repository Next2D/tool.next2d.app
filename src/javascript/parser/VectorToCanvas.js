/**
 * @class
 * @memberOf parser
 */
class VectorToCanvas
{
    /**
     * @param   {object} src
     * @returns {object}
     * @public
     */
    clone (src)
    {
        const execute = function (src, obj)
        {
            const keys   = Object.keys(src);
            const length = keys.length | 0;
            for (let idx = 0; idx < length; ++idx) {

                const prop  = keys[idx];
                const value = src[prop];

                switch (true) {

                    case Util.$isArray(value):
                        obj[prop] = [];
                        execute(value, obj[prop]);
                        break;

                    case typeof value === "object":
                        obj[prop] = {};
                        execute(value, obj[prop]);
                        break;

                    default:
                        obj[prop] = value;
                        break;

                }
            }
        };

        const obj = {};
        execute(src, obj);

        return obj;
    }

    /**
     * @param   {object}  shapes
     * @param   {boolean} [is_morph=false]
     * @returns {array}
     * @public
     */
    convert (shapes, is_morph = false)
    {
        let lineStyles = shapes.lineStyles;
        let fillStyles = shapes.fillStyles;
        let idx        = 0;
        let obj        = {};
        let cache      = [];
        let AnchorX    = 0;
        let AnchorY    = 0;
        let MoveX      = 0;
        let MoveY      = 0;
        let LineX      = 0;
        let LineY      = 0;
        let FillStyle0 = 0;
        let FillStyle1 = 0;
        let LineStyle  = 0;
        let fills0     = [];
        let fills1     = [];
        let lines      = [];
        let stack      = [];
        let depth      = 0;

        // setup
        const shapeData = shapes.ShapeData;
        const records   = shapeData.records;
        const newStyles = shapeData.styles;

        let i = 0;
        let s = 0;
        for (;;) {

            const state = records[i++];

            // end
            if (state === -1) {
                stack = this.setStack(stack, this.fillMerge(fills0, fills1, is_morph));
                stack = this.setStack(stack, lines);
                break;
            }

            // data change
            if (state) {

                ++depth;

                // StateNewStyles
                if (records[i++]) {

                    //  build data
                    stack   = this.setStack(stack, this.fillMerge(fills0, fills1, is_morph));
                    stack   = this.setStack(stack, lines);

                    // reset
                    AnchorX = 0;
                    AnchorY = 0;
                    fills0  = [];
                    fills1  = [];
                    lines   = [];

                    const styles = newStyles[s++];
                    if (records[i++]) {
                        fillStyles = styles.FillStyles;
                    }

                    if (records[i++]) {
                        lineStyles = styles.LineStyles;
                    }

                }

                // default
                MoveX = AnchorX;
                MoveY = AnchorY;

                // override
                if (records[i++]) {
                    MoveX = AnchorX = records[i++] / 20;
                    MoveY = AnchorX = records[i++] / 20;
                }

                LineX = MoveX;
                LineY = MoveY;

                // StateFillStyle0
                if (records[i++]) {
                    FillStyle0 = records[i++];
                }

                // StateFillStyle1
                if (records[i++]) {
                    FillStyle1 = records[i++];
                }

                // StateLineStyle
                if (records[i++]) {
                    LineStyle = records[i++];
                }

                continue;
            }

            const isCurved = records[i++];
            const ControlX = isCurved ? records[i++] / 20 : 0;
            const ControlY = isCurved ? records[i++] / 20 : 0;
            AnchorX        = records[i++] / 20;
            AnchorY        = records[i++] / 20;

            const record = {
                "isCurved": isCurved,
                "ControlX": ControlX,
                "ControlY": ControlY,
                "AnchorX":  AnchorX,
                "AnchorY":  AnchorY
            };

            // fill0
            if (FillStyle0) {

                idx = FillStyle0 - 1 | 0;
                if (!(idx in fills0)) {
                    fills0[idx] = [];
                }

                if (!(depth in fills0[idx])) {
                    fills0[idx][depth] = {
                        "obj":    fillStyles ? fillStyles[idx] : null,
                        "startX": MoveX,
                        "startY": MoveY,
                        "endX":   0,
                        "endY":   0,
                        "cache":  []
                    };
                }

                obj   = fills0[idx][depth];
                cache = obj.cache;
                cache[cache.length] = this.clone(record);

                obj.endX = AnchorX;
                obj.endY = AnchorY;
            }

            // fill1
            if (FillStyle1) {

                idx = FillStyle1 - 1 | 0;
                if (!(idx in fills1)) {
                    fills1[idx] = [];
                }

                if (!(depth in fills1[idx])) {
                    fills1[idx][depth] = {
                        "obj":    fillStyles ? fillStyles[idx] : null,
                        "startX": MoveX,
                        "startY": MoveY,
                        "endX":   0,
                        "endY":   0,
                        "cache":  []
                    };
                }

                obj   = fills1[idx][depth];
                cache = obj.cache;
                cache[cache.length] = this.clone(record);

                obj.endX = AnchorX;
                obj.endY = AnchorY;
            }

            // lines
            if (LineStyle) {

                idx = LineStyle - 1 | 0;
                if (!(idx in lines)) {
                    lines[idx] = {
                        "obj":   lineStyles ? lineStyles[idx] : null,
                        "cache": []
                    };
                }

                obj   = lines[idx];
                cache = obj.cache;
                cache[cache.length] = [0, LineX, LineY];

                let code = [2, AnchorX, AnchorY];
                if (isCurved) {
                    code = [1, ControlX, ControlY, AnchorX, AnchorY];
                }

                cache[cache.length] = code;
            }

            LineX = AnchorX;
            LineY = AnchorY;
        }

        return this.toGraphicPath(stack);
    }

    /**
     * @param  {array} stack
     * @return {array}
     * @public
     */
    toGraphicPath (stack)
    {
        const {
            Graphics,
            GradientType,
            InterpolationMethod,
            SpreadMethod,
            CapsStyle,
            JointStyle
        } = window.next2d.display;

        let inBitmap = false;
        const recodes = [];
        for (let idx = 0; idx < stack.length; ++idx) {

            const data = stack[idx];

            recodes.push(Graphics.BEGIN_PATH);

            for (let idx = 0; idx < data.recode.length; ++idx) {
                recodes.push.apply(recodes, data.recode[idx]);
            }

            const isStroke = "Width" in data.object;
            let lineWidth  = 0;
            let capsStyle  = CapsStyle.NONE;
            let miterLimit = 0;
            let jointStyle = JointStyle.ROUND;
            if (isStroke) {

                lineWidth = data.object.Width;

                switch (data.object.StartCapStyle) {

                    case 0:
                        capsStyle = CapsStyle.ROUND;
                        break;

                    case 1:
                        capsStyle = CapsStyle.NONE;
                        break;

                    case 2:
                        capsStyle = CapsStyle.SQUARE;
                        break;

                }

                switch (data.object.JoinStyle) {

                    case 0:
                        jointStyle = JointStyle.ROUND;
                        break;

                    case 1:
                        jointStyle = JointStyle.BEVEL;
                        break;

                    case 2:
                        jointStyle = JointStyle.MITER;
                        miterLimit = data.object.MiterLimitFactor;
                        break;

                }
            }

            const styleObject = data.object.HasFillFlag
                ? data.object.FillType
                : data.object;

            switch (styleObject.fillStyleType) {

                case 0x00: // solid fill

                    if (isStroke) {

                        recodes.push(
                            Graphics.STROKE_STYLE,
                            lineWidth,
                            capsStyle,
                            jointStyle,
                            miterLimit,
                            styleObject.Color.R,
                            styleObject.Color.G,
                            styleObject.Color.B,
                            styleObject.Color.A * 255,
                            Graphics.END_STROKE
                        );

                    } else {

                        recodes.push(
                            Graphics.FILL_STYLE,
                            styleObject.Color.R,
                            styleObject.Color.G,
                            styleObject.Color.B,
                            styleObject.Color.A * 255,
                            Graphics.END_FILL
                        );

                    }

                    break;

                case 0x10: // linear gradient fill
                case 0x12: // radial gradient fill
                case 0x13: // radial gradient fill
                    {
                        const gradient = styleObject.gradient;

                        const colorStops = [];
                        const gradientRecords = gradient.GradientRecords;
                        for (let idx = 0; idx < gradientRecords.length; ++idx) {
                            const recode = gradientRecords[idx];
                            colorStops.push({
                                "ratio": recode.Ratio,
                                "R": recode.Color.R,
                                "G": recode.Color.G,
                                "B": recode.Color.B,
                                "A": recode.Color.A * 255
                            });
                        }

                        const interpolationMode = gradient.InterpolationMode === 0
                            ? InterpolationMethod.RGB
                            : InterpolationMethod.LINEAR_RGB;

                        let spreadMode = SpreadMethod.PAD;
                        switch (gradient.SpreadMode) {

                            case 0:
                                spreadMode = SpreadMethod.PAD;
                                break;

                            case 1:
                                spreadMode = SpreadMethod.REFLECT;
                                break;

                            case 2:
                                spreadMode = SpreadMethod.REPEAT;
                                break;

                        }

                        if (isStroke) {

                            recodes.push(
                                Graphics.GRADIENT_STROKE,
                                lineWidth,
                                capsStyle,
                                jointStyle,
                                miterLimit,
                                styleObject.fillStyleType === 0x10
                                    ? GradientType.LINEAR
                                    : GradientType.RADIAL,
                                colorStops,
                                styleObject.gradientMatrix,
                                spreadMode,
                                interpolationMode,
                                gradient.FocalPoint
                            );

                        } else {

                            recodes.push(
                                Graphics.GRADIENT_FILL,
                                styleObject.fillStyleType === 0x10
                                    ? GradientType.LINEAR
                                    : GradientType.RADIAL,
                                colorStops,
                                styleObject.gradientMatrix,
                                spreadMode,
                                interpolationMode,
                                gradient.FocalPoint
                            );

                        }
                    }
                    break;

                case 0x40: // repeating bitmap fill
                case 0x41: // clipped bitmap fill
                case 0x42: // non-smoothed repeating bitmap fill
                case 0x43: // non-smoothed clipped bitmap fill
                    {
                        inBitmap = true;
                        const bitmap = Util
                            .$currentWorkSpace()
                            .getLibrary(
                                Util.$characters.get(styleObject.bitmapId)
                            );

                        // eslint-disable-next-line no-loop-func
                        const wait = function (recodes, style_object)
                        {
                            if (!this._$buffer) {
                                return requestAnimationFrame(wait);
                            }

                            const smooth =
                                style_object.fillStyleType === 0x40
                                || style_object.fillStyleType === 0x41;

                            const repeat =
                                style_object.fillStyleType === 0x40
                                || style_object.fillStyleType === 0x42;

                            const matrix = Util.$multiplicationMatrix(
                                style_object.bitmapMatrix,
                                [0.05, 0, 0, 0.05, 0, 0]
                            );

                            const { BitmapData } = window.next2d.display;
                            const bitmapData = new BitmapData(
                                this.width, this.height, true, 0
                            );
                            bitmapData._$buffer = this._$buffer;

                            recodes.push(
                                Graphics.BITMAP_FILL,
                                bitmapData,
                                Array.from(matrix),
                                repeat ? "repeat" : "no-repeat",
                                smooth
                            );

                        }.bind(bitmap, recodes, styleObject);
                        wait();
                    }
                    break;

                default:
                    break;

            }
        }

        recodes.push(inBitmap);
        return recodes;
    }

    /**
     * @param   {array}   fills0
     * @param   {array}   fills1
     * @param   {boolean} is_morph
     * @returns {array}
     * @public
     */
    fillMerge (fills0, fills1, is_morph)
    {
        fills0 = this.fillReverse(fills0);

        if (fills0.length) {

            const keys   = Object.keys(fills0);
            const length = keys.length | 0;
            for (let key = 0; key < length; ++key) {

                const idx   = keys[key];
                const fills = fills0[idx];

                if (idx in fills1) {

                    const fill1 = fills1[idx];
                    const fKeys = Object.keys(fills);
                    const kLen  = fKeys.length | 0;
                    for (let kIdx = 0; kIdx < kLen; ++kIdx) {
                        fill1[fill1.length] = fills[fKeys[kIdx]];
                    }

                } else {

                    fills1[idx] = fills;

                }
            }
        }

        return this.coordinateAdjustment(fills1, is_morph);
    }

    /**
     * @param   {array} fills0
     * @returns {array}
     * @public
     */
    fillReverse (fills0)
    {
        if (!fills0.length) {
            return fills0;
        }

        const f0Keys = Object.keys(fills0);
        const f0Len  = f0Keys.length | 0;
        for (let f0Idx = 0; f0Idx < f0Len; ++f0Idx) {

            const i     = f0Keys[f0Idx];
            const fills = fills0[i];
            const fKeys = Object.keys(fills);
            const fLen  = fKeys.length | 0;
            for (let fIdx = 0; fIdx < fLen; ++fIdx) {

                const depth   = fKeys[fIdx];

                let AnchorX = 0;
                let AnchorY = 0;
                const obj   = fills[depth];
                let cacheX  = obj.startX;
                let cacheY  = obj.startY;
                const cache = obj.cache;
                let length  = cache.length | 0;
                if (length) {

                    const cKeys = Object.keys(cache);
                    const cLen  = cKeys.length | 0;
                    for (let cIdx = 0; cIdx < cLen; ++cIdx) {
                        const idx      = cKeys[cIdx];
                        const recode   = cache[idx];
                        AnchorX        = recode.AnchorX;
                        AnchorY        = recode.AnchorY;
                        recode.AnchorX = cacheX;
                        recode.AnchorY = cacheY;
                        cacheX         = AnchorX;
                        cacheY         = AnchorY;
                    }

                    const array = [];
                    if (length > 0) {

                        while (length) {

                            --length;

                            array[array.length] = cache[length];

                        }

                    }

                    obj.cache = array;

                }

                // set
                cacheX     = obj.startX;
                cacheY     = obj.startY;
                obj.startX = obj.endX;
                obj.startY = obj.endY;
                obj.endX   = cacheX;
                obj.endY   = cacheY;
            }
        }

        return fills0;
    }

    /**
     * @param   {array}   fills1
     * @param   {boolean} is_morph
     * @returns {array}
     * @public
     */
    coordinateAdjustment (fills1, is_morph)
    {
        const f1Keys = Object.keys(fills1);
        const f1Len  = f1Keys.length | 0;
        for (let f1Idx = 0; f1Idx < f1Len; ++f1Idx) {

            // setup
            const i     = f1Keys[f1Idx];
            const array = [];
            const fills = fills1[i];

            const fKeys = Object.keys(fills);
            const fLen  = fKeys.length | 0;
            for (let fIdx = 0; fIdx < fLen; ++fIdx) {
                array[array.length] = fills[fKeys[fIdx]];
            }

            let adjustment = [];
            switch (true) {

                case array.length > 1 && !is_morph:

                    for (;;) {

                        if (!array.length) {
                            break;
                        }

                        const fill = array.shift();
                        if (fill.startX === fill.endX && fill.startY === fill.endY) {
                            adjustment[adjustment.length] = fill;
                            continue;
                        }

                        let isMatch = 0;
                        let length  = array.length | 0;
                        while (length) {

                            --length;

                            const comparison = array[length];
                            if (comparison.startX === fill.endX && comparison.startY === fill.endY) {

                                fill.endX  = comparison.endX;
                                fill.endY  = comparison.endY;

                                const cache0 = fill.cache;
                                const cache1 = comparison.cache;
                                const cLen   = cache1.length | 0;
                                for (let cIdx = 0; cIdx < cLen; ++cIdx) {
                                    cache0[cache0.length] = cache1[cIdx];
                                }

                                array.splice(length, 1);
                                array.unshift(fill);
                                isMatch = 1;

                                break;
                            }
                        }

                        if (!isMatch) {
                            array.unshift(fill);
                        }

                    }

                    break;

                default:
                    adjustment = array;
                    break;

            }

            const aLen  = adjustment.length | 0;
            const cache = [];

            let obj = {};
            for (let idx = 0; idx < aLen; ++idx) {

                const data = adjustment[idx];
                obj        = data.obj;

                const caches = data.cache;
                const cacheLength = caches.length | 0;
                cache[cache.length] = [0, data.startX, data.startY];

                for (let compIdx = 0; compIdx < cacheLength; ++compIdx) {
                    const r = caches[compIdx];
                    cache[cache.length] = r.isCurved
                        ? [1, r.ControlX, r.ControlY, r.AnchorX, r.AnchorY]
                        : [2, r.AnchorX, r.AnchorY];
                }
            }

            fills1[i] = {
                "cache": cache,
                "obj":   obj
            };

        }

        return fills1;
    }

    /**
     * @param   {array} stack
     * @param   {array} array
     * @returns {array}
     * @public
     */
    setStack (stack, array)
    {
        if (array.length) {
            const keys   = Object.keys(array);
            const length = keys.length | 0;
            for (let idx = 0; idx < length; ++idx) {

                const data = array[keys[idx]];

                stack.push({
                    "object": data.obj,
                    "recode": data.cache
                });
            }
        }

        return stack;
    }
}
Util.$vtc = new VectorToCanvas();
