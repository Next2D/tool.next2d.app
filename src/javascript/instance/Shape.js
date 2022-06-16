/**
 * @class
 * @extends {Instance}
 */
class Shape extends Instance
{
    /**
     * @param {object} object
     * @constructor
     */
    constructor (object = null)
    {
        super(object);

        this._$bitmapId = 0;
        this._$bounds   = null;
        this._$grid     = null;
        this._$inBitmap = false;
        this._$recodes  = [];

        if (object.inBitmap) {
            this.inBitmap = object.inBitmap;
        }

        if (object.recodes) {
            this.recodes = object.recodes;
        }

        if (object.bounds) {
            this.bounds = object.bounds;
        }

        if (object.bitmapId) {
            this.bitmapId = object.bitmapId;
        }

        if (object.grid) {
            this.grid = object.grid;
        }
    }

    /**
     * @param  {object} place
     * @param  {string} [name=""]
     * @return {void}
     * @method
     * @public
     */
    showController(place, name = "")
    {
        super.showController(place, name);

        // 9スライスの値を初期化
        document
            .getElementById("nine-slice-setting-x")
            .value = "0";

        document
            .getElementById("nine-slice-setting-y")
            .value = "0";

        document
            .getElementById("nine-slice-setting-w")
            .value = "0";

        document
            .getElementById("nine-slice-setting-h")
            .value = "0";

        // Shapeに必要なコントローラーを表示する
        Util.$controller.showObjectSetting([
            "fill-color-setting",
            "nine-slice-setting"
        ]);

        // Shapeに不要なコントローラーを非表示にする
        Util.$controller.hideObjectSetting([
            "text-setting",
            "loop-setting",
            "video-setting"
        ]);
    }

    /**
     * @param {object} place
     * @param {MouseEvent} [event=null]
     * @public
     */
    showShapeColor (place, event)
    {
        // マウスのタッチポイントがShapeの描画範囲か判定する
        this.setHitColor(event.offsetX, event.offsetY, place.matrix);

        // 9スライスの設定があれば値をセット
        const grid = this._$grid;
        if (grid && grid.x && grid.y) {

            document
                .getElementById("nine-slice-setting-x")
                .value = `${grid.x}`;

            document
                .getElementById("nine-slice-setting-y")
                .value = `${grid.y}`;

            document
                .getElementById("nine-slice-setting-w")
                .value = `${grid.w}`;

            document
                .getElementById("nine-slice-setting-h")
                .value = `${grid.h}`;

            Util
                .$gridController
                .show()
                .relocation();
        }

        // マウスポイントがShapeの描画範囲にヒットしていれば
        // 必要なコントローラーを表示して値をセットする
        if (Util.$hitColor) {
            Util.$controller.showObjectSetting([
                "fill-color-setting",
                "nine-slice-setting"
            ]);
        }
    }

    /**
     * @return {object}
     * @public
     */
    getBounds ()
    {
        return this._$bounds;
    }

    /**
     * @return {boolean}
     * @public
     */
    get inBitmap ()
    {
        return this._$inBitmap;
    }

    /**
     * @param  {boolean} in_bitmap
     * @return {void}
     * @public
     */
    set inBitmap (in_bitmap)
    {
        this._$inBitmap = !!in_bitmap;
    }

    /**
     * @return {number}
     * @public
     */
    get width ()
    {
        return Math.abs(this._$bounds.xMax - this._$bounds.xMin);
    }

    /**
     * @return {number}
     * @public
     */
    get height ()
    {
        return Math.abs(this._$bounds.yMax - this._$bounds.yMin);
    }

    /**
     * @return {string}
     * @public
     */
    get defaultSymbol ()
    {
        return window.next2d.display.Shape.namespace;
    }

    /**
     * @return {array}
     * @public
     */
    get recodes ()
    {
        if (!this._$inBitmap) {
            return this._$recodes;
        }

        const recodes = [];
        const { BitmapData } = window.next2d.display;
        for (let idx = 0; this._$recodes.length > idx; ++idx) {

            const value = this._$recodes[idx];
            recodes[idx] = value;

            if (typeof value !== "object") {
                continue;
            }

            if (value.namespace !== BitmapData.namespace) {
                continue;
            }

            recodes[idx] = {
                "buffer": Array.from(value._$buffer),
                "width": value.width,
                "height": value.height
            };
        }

        return recodes;
    }

    /**
     * @param {array} recodes
     * @public
     */
    set recodes (recodes)
    {
        this._$recodes = recodes;
        if (this._$inBitmap) {

            const { BitmapData } = window.next2d.display;
            for (let idx = 0; this._$recodes.length > idx; ++idx) {

                const value = this._$recodes[idx];

                if (typeof value !== "object") {
                    continue;
                }

                if (value.namespace === BitmapData.namespace) {
                    continue;
                }

                if (!value.buffer) {
                    continue;
                }

                const bitmapData = new BitmapData(
                    value.width, value.height, true, 0
                );
                bitmapData._$buffer = new Uint8Array(value.buffer);

                this._$recodes[idx] = bitmapData;
            }
        }
    }

    /**
     * @return {object|null}
     * @public
     */
    get bounds ()
    {
        return this._$bounds;
    }

    /**
     * @param {object} [bounds=null]
     * @public
     */
    set bounds (bounds)
    {
        this._$bounds = bounds;
    }

    /**
     * @return {object}
     * @public
     */
    get offset ()
    {
        return this._$offset;
    }

    /**
     * @param  {object} offset
     * @return {void}
     * @public
     */
    set offset (offset)
    {
        this._$offset = offset;
    }

    /**
     * @return {number}
     * @public
     */
    get bitmapId ()
    {
        return this._$bitmapId;
    }

    /**
     * @param  {number} bitmap_id
     * @return {void}
     * @public
     */
    set bitmapId (bitmap_id)
    {
        this._$bitmapId = bitmap_id | 0;
    }

    /**
     * @return {object|null}
     * @public
     */
    get grid ()
    {
        return this._$grid;
    }

    /**
     * @param {object} [grid=null]
     * @public
     */
    set grid (grid)
    {
        this._$grid = grid;
    }

    /**
     * @param  {array}  matrix
     * @param  {number} layer_id
     * @param  {number} character_id
     * @return {void}
     * @public
     */
    createPointer (matrix, layer_id, character_id)
    {
        Util.$clearShapePointer();

        const element = document.getElementById("stage-area");

        let syncId = 2;
        const { Graphics } = window.next2d.display;
        for (let idx = 0; idx < this._$recodes.length; ) {

            switch (this._$recodes[idx++]) {

                case Graphics.MOVE_TO:
                    syncId = idx;
                    idx += 2;
                    break;

                case Graphics.LINE_TO:

                    this.addPointer(
                        layer_id,
                        character_id,
                        idx,
                        this._$recodes[idx++],
                        this._$recodes[idx++],
                        matrix,
                        Graphics.LINE_TO
                    );

                    this.adjustmentPointer(idx, matrix, layer_id, character_id, syncId);

                    break;

                case Graphics.CUBIC:

                    for (let jdx = 0; 2 > jdx; ++jdx) {
                        this.addPointer(
                            layer_id,
                            character_id,
                            idx,
                            this._$recodes[idx++],
                            this._$recodes[idx++],
                            matrix,
                            Graphics.CUBIC,
                            true
                        );
                    }

                    this.addPointer(
                        layer_id,
                        character_id,
                        idx,
                        this._$recodes[idx++],
                        this._$recodes[idx++],
                        matrix,
                        Graphics.CUBIC,
                        false
                    );

                    this.adjustmentPointer(idx, matrix, layer_id, character_id, syncId);

                    break;

                case Graphics.CURVE_TO:

                    this.addPointer(
                        layer_id,
                        character_id,
                        idx,
                        this._$recodes[idx++],
                        this._$recodes[idx++],
                        matrix,
                        Graphics.CURVE_TO,
                        true
                    );

                    this.addPointer(
                        layer_id,
                        character_id,
                        idx,
                        this._$recodes[idx++],
                        this._$recodes[idx++],
                        matrix,
                        Graphics.CURVE_TO
                    );

                    this.adjustmentPointer(idx, matrix, layer_id, character_id, syncId);

                    break;

                case Graphics.FILL_STYLE:
                    idx += 4;
                    break;

                case Graphics.STROKE_STYLE:
                    idx += 8;
                    break;

                case Graphics.GRADIENT_FILL:
                    idx += 6;
                    break;

                case Graphics.GRADIENT_STROKE:
                    idx += 10;
                    break;

                case Graphics.BEGIN_PATH:
                case Graphics.END_FILL:
                case Graphics.END_STROKE:
                    break;

                default:
                    break;

            }

        }

        Util.$addModalEvent(element);
    }

    /**
     * @param  {number} index
     * @param  {array}  matrix
     * @param  {number} layer_id
     * @param  {number} character_id
     * @param  {number} sync_id
     * @return {void}
     * @public
     */
    adjustmentPointer (index, matrix, layer_id, character_id, sync_id)
    {
        const { Graphics } = window.next2d.display;
        switch (this._$recodes[index]) {

            case Graphics.MOVE_TO:
            case Graphics.FILL_STYLE:
            case Graphics.GRADIENT_FILL:
                {
                    const children = document
                        .getElementById("stage-area")
                        .children;

                    const node = children[children.length - 1];
                    node.dataset.syncId = `${sync_id}`;
                }
                break;

            case Graphics.STROKE_STYLE:
            case Graphics.GRADIENT_STROKE:
                this.addPointer(
                    layer_id,
                    character_id,
                    5,
                    this._$recodes[5],
                    this._$recodes[6],
                    matrix,
                    Graphics.MOVE_TO
                );
                break;

            default:
                break;

        }
    }

    /**
     * @param  {number}  layer_id
     * @param  {number}  character_id
     * @param  {number}  index
     * @param  {number}  x
     * @param  {number}  y
     * @param  {array}   matrix
     * @param  {number}  type
     * @param  {boolean} [curve=false]
     * @return {void}
     * @public
     */
    addPointer (
        layer_id, character_id, index, x, y, matrix, type, curve = false
    ) {

        const stageArea = document
            .getElementById("stage-area");

        const div = document.createElement("div");

        div.classList.add("transform");

        // dataset
        div.dataset.shapePointer = "true";
        div.dataset.layerId      = `${layer_id}`;
        div.dataset.characterId  = `${character_id}`;
        div.dataset.index        = `${index}`;
        div.dataset.libraryId    = `${this.id}`;
        div.dataset.curve        = `${curve}`;
        div.dataset.type         = `${type}`;
        div.dataset.position     = `${stageArea.children.length}`;

        // css
        const tx = x * matrix[0] + y * matrix[2] + matrix[4];
        const ty = x * matrix[1] + y * matrix[3] + matrix[5];

        div.style.left = `${tx * Util.$zoomScale + Util.$offsetLeft - 3}px`;
        div.style.top  = `${ty * Util.$zoomScale + Util.$offsetTop  - 3}px`;

        if (curve) {
            div.style.borderRadius = "5px";
        } else {
            div.dataset.detail = "{{ダブルクリックでカーブポイントが追加されます}}";
        }

        div.addEventListener("mousedown", (event) =>
        {
            if (event.button) {
                return ;
            }

            // 親のイベントを中止する
            event.stopPropagation();

            const activeTool = Util.$tools.activeTool;
            if (activeTool) {
                event.shapePointer = true;
                activeTool.dispatchEvent(
                    EventType.MOUSE_DOWN,
                    event
                );
            }
        });

        div.addEventListener("dblclick", (event) =>
        {
            // 親のイベントを中止する
            event.stopPropagation();

            const activeTool = Util.$tools.activeTool;
            if (activeTool) {
                event.shapePointer = true;
                event.matrix       = matrix;
                activeTool.dispatchEvent(
                    EventType.DBL_CLICK,
                    event
                );
            }
        });

        stageArea.appendChild(div);
    }

    /**
     * @return {object}
     * @public
     */
    reloadBounds (stroke = 0)
    {
        const { Graphics, Shape } = window.next2d.display;
        const shape = new Shape();

        if (stroke) {
            shape
                .graphics
                .lineStyle(stroke);
        } else {
            shape
                .graphics
                .beginFill();
        }

        for (let idx = 0; idx < this._$recodes.length; ) {

            switch (this._$recodes[idx++]) {

                case Graphics.MOVE_TO:
                    shape
                        .graphics
                        .moveTo(
                            this._$recodes[idx++],
                            this._$recodes[idx++]
                        );
                    break;

                case Graphics.LINE_TO:
                    shape
                        .graphics
                        .lineTo(
                            this._$recodes[idx++],
                            this._$recodes[idx++]
                        );
                    break;

                case Graphics.CUBIC:
                    shape
                        .graphics
                        .cubicCurveTo(
                            this._$recodes[idx++],
                            this._$recodes[idx++],
                            this._$recodes[idx++],
                            this._$recodes[idx++],
                            this._$recodes[idx++],
                            this._$recodes[idx++]
                        );
                    break;

                case Graphics.CURVE_TO:
                    shape
                        .graphics
                        .curveTo(
                            this._$recodes[idx++],
                            this._$recodes[idx++],
                            this._$recodes[idx++],
                            this._$recodes[idx++]
                        );
                    break;

                case Graphics.FILL_STYLE:
                    idx += 4;
                    break;

                case Graphics.STROKE_STYLE:
                    idx += 8;
                    break;

                case Graphics.GRADIENT_FILL:
                    {
                        const { Matrix } = window.next2d.geom;
                        const matrix = new Matrix();
                        const xScale = this.width  / 2 / 819.2;
                        const yScale = this.height / 2 / 819.2;
                        matrix.scale(xScale, yScale);
                        matrix.translate(
                            this.width  / 2 + shape.graphics._$xMin,
                            this.height / 2 + shape.graphics._$yMin
                        );

                        this._$recodes[idx + 2] = Array.from(matrix._$matrix);
                        idx += 6;
                    }
                    break;

                case Graphics.GRADIENT_STROKE:
                    {
                        const { Matrix } = window.next2d.geom;
                        const matrix = new Matrix();
                        const xScale = this.width  / 2 / 819.2;
                        const yScale = this.height / 2 / 819.2;
                        matrix.scale(xScale, yScale);
                        matrix.translate(
                            this.width  / 2 + shape.graphics._$xMin,
                            this.height / 2 + shape.graphics._$yMin
                        );

                        this._$recodes[idx + 6] = Array.from(matrix._$matrix);
                        idx += 10;
                    }
                    break;

                case Graphics.BEGIN_PATH:
                case Graphics.END_FILL:
                case Graphics.END_STROKE:
                    break;

                default:
                    break;

            }

        }

        return {
            "xMin": shape.graphics._$xMin,
            "xMax": shape.graphics._$xMax,
            "yMin": shape.graphics._$yMin,
            "yMax": shape.graphics._$yMax
        };
    }

    /**
     * @return {Shape}
     * @public
     */
    copyFrom (shape)
    {
        shape._$recodes  = this._$recodes.slice();
        shape._$bounds   = {
            "xMin": this._$bounds.xMin,
            "xMax": this._$bounds.xMax,
            "yMin": this._$bounds.yMin,
            "yMax": this._$bounds.yMax
        };
        shape._$bitmapId = this._$bitmapId;

        return shape;
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "bitmapId": this.bitmapId,
            "grid":     this.grid,
            "inBitmap": this.inBitmap,
            "recodes":  this.recodes,
            "bounds":   this.bounds
        };
    }

    /**
     * @return {object}
     * @public
     */
    toPublish ()
    {
        if (this._$bitmapId) {
            Util.$useIds.set(this._$bitmapId, true);
        }

        return {
            "symbol":   this.symbol,
            "extends":  this.defaultSymbol,
            "bitmapId": this.bitmapId,
            "grid":     this.grid,
            "inBitmap": this.inBitmap,
            "recodes":  this.recodes,
            "bounds": {
                "xMin": this._$bounds.xMin,
                "xMax": this._$bounds.xMax,
                "yMin": this._$bounds.yMin,
                "yMax": this._$bounds.yMax
            }
        };
    }

    /**
     * @param {string} style
     * @return {void}
     * @public
     */
    changeStyle (style)
    {
        const { Graphics, GradientType } = window.next2d.display;

        const index = Util.$hitColor.index;
        const currentStyle = Util.$hitColor.style;
        switch (currentStyle) {

            case Graphics.BITMAP_FILL:
            case Graphics.FILL_STYLE:
                {
                    const element = document
                        .getElementById("fill-color-type-select");

                    switch (element.value) {

                        case GradientType.LINEAR:
                        case GradientType.RADIAL:
                            {
                                const colorValue = document
                                    .getElementById("fill-color-value")
                                    .value;

                                const color = Util.$intToRGB(
                                    `0x${colorValue.slice(1)}` | 0
                                );

                                const alpha = (document
                                    .getElementById("fill-alpha-value")
                                    .value | 0) / 100 * 255;

                                this.changeGradient(
                                    index, style, Graphics.GRADIENT_FILL,
                                    6, color, alpha
                                );
                            }
                            break;

                        default:
                            break;

                    }
                }
                break;

            case Graphics.GRADIENT_FILL:
                {
                    const element = document
                        .getElementById("fill-color-type-select");

                    const stops = this._$recodes[index + 1];
                    const color = stops.pop();
                    switch (element.value) {

                        case "bitmap":
                        case "rgba":
                            this._$recodes.splice(index - 1, 12,
                                Graphics.FILL_STYLE,
                                color.R, color.G,
                                color.B, color.A,
                                Graphics.END_FILL
                            );

                            Util.$hitColor = {
                                "index": index,
                                "style": Graphics.FILL_STYLE,
                                "shape": this
                            };
                            break;

                        default:
                            this.changeGradient(
                                index, style, Graphics.GRADIENT_FILL,
                                12, color, color.A
                            );
                            break;

                    }
                }
                break;

            case Graphics.STROKE_STYLE:
                {
                    const element = document
                        .getElementById("fill-color-type-select");

                    switch (element.value) {

                        case GradientType.LINEAR:
                        case GradientType.RADIAL:
                            {
                                const colorValue = document
                                    .getElementById("fill-color-value")
                                    .value;

                                const color = Util.$intToRGB(
                                    `0x${colorValue.slice(1)}` | 0
                                );

                                const alpha = (document
                                    .getElementById("fill-alpha-value")
                                    .value | 0) / 100 * 255;

                                this.changeGradient(
                                    index, style, Graphics.GRADIENT_STROKE,
                                    5, color, alpha
                                );
                            }
                            break;

                        default:
                            break;

                    }
                }
                break;

            case Graphics.GRADIENT_STROKE:
                {
                    const element = document
                        .getElementById("fill-color-type-select");

                    const stops      = this._$recodes[index + 5];
                    const color      = stops.pop();
                    const width      = this._$recodes[index];
                    const caps       = this._$recodes[index + 1];
                    const joints     = this._$recodes[index + 2];
                    const miterLimit = this._$recodes[index + 3];
                    switch (element.value) {

                        case "bitmap":
                        case "rgba":
                            this._$recodes.splice(index - 1, 11,
                                Graphics.STROKE_STYLE,
                                width, caps,
                                joints, miterLimit,
                                color.R, color.G,
                                color.B, color.A,
                                Graphics.END_STROKE
                            );

                            Util.$hitColor = {
                                "index": index,
                                "width": width,
                                "style": Graphics.STROKE_STYLE,
                                "shape": this
                            };
                            break;

                        default:
                            this.changeGradient(
                                index, style, Graphics.GRADIENT_STROKE,
                                6, color, color.A
                            );
                            break;

                    }
                }
                break;

        }

        this.cacheClear();

        const frame = Util.$timelineFrame.currentFrame;

        Util.$currentWorkSpace().scene.changeFrame(frame);
    }

    /**
     * @param  {number} index
     * @param  {string} style
     * @param  {number} graphics_type
     * @param  {number} delete_number
     * @param  {object} color
     * @param  {number} alpha
     * @return {void}
     * @public
     */
    changeGradient (index, style, graphics_type, delete_number, color, alpha)
    {
        const { Graphics, SpreadMethod, InterpolationMethod } = window.next2d.display;
        const { Matrix } = window.next2d.geom;

        const matrix = new Matrix();
        const xScale = this.width  / 2 / 819.2;
        const yScale = this.height / 2 / 819.2;
        matrix.scale(xScale, yScale);
        matrix.translate(
            this.width  / 2 + this._$bounds.xMin,
            this.height / 2 + this._$bounds.yMin
        );

        const ratios = [{
            "ratio": 0,
            "R": 255,
            "G": 255,
            "B": 255,
            "A": 255
        }, {
            "ratio": 1,
            "R": color.R,
            "G": color.G,
            "B": color.B,
            "A": alpha
        }];

        Util.$hitColor = {
            "index"  : index,
            "style"  : graphics_type,
            "type"   : style,
            "ratios" : ratios,
            "shape"  : this
        };

        if (Graphics.GRADIENT_STROKE === graphics_type) {

            this._$recodes[index - 1] = Graphics.GRADIENT_STROKE;

            this._$recodes.splice(index + 4, delete_number,
                style, ratios,
                Array.from(matrix._$matrix),
                SpreadMethod.PAD,
                InterpolationMethod.RGB,
                0
            );

            Util.$hitColor.width = this._$recodes[index];

        } else {

            this._$recodes.splice(index - 1, delete_number,
                graphics_type, style, ratios,
                Array.from(matrix._$matrix),
                SpreadMethod.PAD,
                InterpolationMethod.RGB,
                0
            );

        }

        Util
            .$shapeController
            .initializeGradient();

    }

    /**
     * @param  {number} [color_index=-1]
     * @return {void}
     * @method
     * @public
     */
    changeColor (color_index = -1)
    {
        const { Graphics } = window.next2d.display;

        const index = Util.$hitColor.index;
        switch (Util.$hitColor.style) {

            case Graphics.BITMAP_FILL:
                break;

            case Graphics.BITMAP_STROKE:
                {
                    const width = Util.$clamp(document
                        .getElementById("fill-stroke-width-value")
                        .value | 0, 1, 255);

                    if (this._$recodes[index] !== width) {

                        Util.$hitColor.width  = width;
                        this._$recodes[index] = width;

                        const bounds = this.reloadBounds(width);
                        this._$bounds.xMin = bounds.xMin;
                        this._$bounds.xMax = bounds.xMax;
                        this._$bounds.yMin = bounds.yMin;
                        this._$bounds.yMax = bounds.yMax;

                        this.cacheClear();
                    }
                }
                break;

            case Graphics.FILL_STYLE:
                {
                    const colorValue = document
                        .getElementById("fill-color-value")
                        .value;

                    const color = Util.$intToRGB(
                        `0x${colorValue.slice(1)}` | 0
                    );

                    this._$recodes[index    ] = color.R;
                    this._$recodes[index + 1] = color.G;
                    this._$recodes[index + 2] = color.B;
                    this._$recodes[index + 3] = Util.$clamp((document
                        .getElementById("fill-alpha-value")
                        .value | 0) / 100 * 255, 0, 255);
                }
                break;

            case Graphics.GRADIENT_FILL:
                {
                    const colors = this._$recodes[index + 1];

                    const colorIndex = color_index > -1
                        ? color_index
                        : colors.length - 1;

                    const object = colors[colorIndex];

                    const colorValue = document
                        .getElementById("fill-color-value")
                        .value;

                    const color = Util.$intToRGB(
                        `0x${colorValue.slice(1)}` | 0
                    );

                    object.R = color.R;
                    object.G = color.G;
                    object.B = color.B;
                    object.A = Util.$clamp((document
                        .getElementById("fill-alpha-value")
                        .value | 0) / 100 * 255, 0, 255);
                }

                break;

            case Graphics.STROKE_STYLE:
                {
                    const colorValue = document
                        .getElementById("fill-color-value")
                        .value;

                    const color = Util.$intToRGB(
                        `0x${colorValue.slice(1)}` | 0
                    );

                    this._$recodes[index + 4] = color.R;
                    this._$recodes[index + 5] = color.G;
                    this._$recodes[index + 6] = color.B;
                    this._$recodes[index + 7] = Util.$clamp((document
                        .getElementById("fill-alpha-value")
                        .value | 0) / 100 * 255, 0, 255);

                    const width = Util.$clamp(document
                        .getElementById("fill-stroke-width-value")
                        .value | 0, 1, 255);

                    if (this._$recodes[index] !== width) {

                        Util.$hitColor.width  = width;
                        this._$recodes[index] = width;

                        const bounds = this.reloadBounds(width);
                        this._$bounds.xMin = bounds.xMin;
                        this._$bounds.xMax = bounds.xMax;
                        this._$bounds.yMin = bounds.yMin;
                        this._$bounds.yMax = bounds.yMax;

                        this.cacheClear();
                    }

                }
                break;

            case Graphics.GRADIENT_STROKE:
                {
                    const colors = this._$recodes[index + 5];

                    const colorIndex = color_index > -1
                        ? color_index
                        : colors.length - 1;

                    const object = colors[colorIndex];

                    const colorValue = document
                        .getElementById("fill-color-value")
                        .value;

                    const color = Util.$intToRGB(
                        `0x${colorValue.slice(1)}` | 0
                    );

                    object.R = color.R;
                    object.G = color.G;
                    object.B = color.B;
                    object.A = Util.$clamp((document
                        .getElementById("fill-alpha-value")
                        .value | 0) / 100 * 255, 0, 255);

                    const width = Util.$clamp(document
                        .getElementById("fill-stroke-width-value")
                        .value | 0, 1, 255);

                    if (this._$recodes[index] !== width) {

                        Util.$hitColor.width  = width;
                        this._$recodes[index] = width;

                        const bounds = this.reloadBounds(width);
                        this._$bounds.xMin = bounds.xMin;
                        this._$bounds.xMax = bounds.xMax;
                        this._$bounds.yMin = bounds.yMin;
                        this._$bounds.yMax = bounds.yMax;

                        this.cacheClear();
                    }
                }
                break;

        }

        this.cacheClear();
    }

    /**
     * @return {void}
     * @public
     */
    cacheClear ()
    {
        const scene =  Util.$currentWorkSpace().scene;
        for (const layer of scene._$layers.values()) {

            const length = layer._$characters.length;
            for (let idx = 0; idx < length; ++idx) {

                const character = layer._$characters[idx];

                if (character.libraryId !== this.id) {
                    continue;
                }

                character._$image = null;
            }
        }
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {array} place_matrix
     * @return {void}
     * @public
     */
    setHitColor (x, y, place_matrix)
    {
        const { Graphics, GradientType } = window.next2d.display;
        const { Point, Matrix } = window.next2d.geom;

        const matrix = new Matrix();

        const xScale = Math.sqrt(
            place_matrix[0] * place_matrix[0]
            + place_matrix[1] * place_matrix[1]
        ) * Util.$zoomScale;

        const yScale = Math.sqrt(
            place_matrix[2] * place_matrix[2]
            + place_matrix[3] * place_matrix[3]
        ) * Util.$zoomScale;
        matrix.scale(xScale, yScale);

        const radian = Math.atan2(place_matrix[1], place_matrix[0]);
        if (radian) {
            matrix.translate(-this.width / 2, -this.height / 2);
            matrix.rotate(radian);
            matrix.translate(this.width / 2, this.height / 2);
        }

        const topLeft     = matrix.transformPoint(new Point(0, 0));
        const topRight    = matrix.transformPoint(new Point(this.width, 0));
        const bottomLeft  = matrix.transformPoint(new Point(0, this.height));
        const bottomRight = matrix.transformPoint(new Point(this.width, this.height));

        const left = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
        const top  = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
        matrix.translate(-left, -top);

        // reset
        Util.$hitColor = null;

        Util.$hitContext.lineWidth = 0;
        Util.$hitContext.beginPath();
        Util.$hitContext.setTransform(
            matrix._$matrix[0], matrix._$matrix[1],
            matrix._$matrix[2], matrix._$matrix[3],
            -this._$bounds.xMin * xScale + matrix._$matrix[4],
            -this._$bounds.yMin * yScale + matrix._$matrix[5]
        );

        const recode = this._$recodes;
        const length  = recode.length;
        for (let idx = 0; idx < length; ) {
            switch (recode[idx++]) {

                case Graphics.BEGIN_PATH:
                    Util.$hitContext.beginPath();
                    break;

                case Graphics.MOVE_TO:
                    Util.$hitContext.moveTo(recode[idx++], recode[idx++]);
                    break;

                case Graphics.LINE_TO:
                    Util.$hitContext.lineTo(recode[idx++], recode[idx++]);
                    break;

                case Graphics.CURVE_TO:
                    Util.$hitContext.quadraticCurveTo(
                        recode[idx++], recode[idx++],
                        recode[idx++], recode[idx++]
                    );
                    break;

                case Graphics.CUBIC:
                    Util.$hitContext.bezierCurveTo(
                        recode[idx++], recode[idx++],
                        recode[idx++], recode[idx++],
                        recode[idx++], recode[idx++]
                    );
                    break;

                case Graphics.FILL_STYLE:
                    if (Util.$hitContext.isPointInPath(x, y)) {
                        if (this._$bitmapId) {

                            Util.$hitColor = {
                                "index": idx,
                                "style": Graphics.BITMAP_FILL,
                                "shape": this
                            };

                            document
                                .getElementById("fill-color-type-select")[1]
                                .selected = true;

                        } else {

                            Util.$hitColor = {
                                "index": idx,
                                "style": Graphics.FILL_STYLE,
                                "shape": this
                            };

                            const R = recode[idx    ].toString(16).padStart(2, "0");
                            const G = recode[idx + 1].toString(16).padStart(2, "0");
                            const B = recode[idx + 2].toString(16).padStart(2, "0");

                            document
                                .getElementById("fill-color-type-select")[0]
                                .selected = true;

                            document
                                .getElementById("fill-color-value")
                                .value = `#${R}${G}${B}`;

                            document
                                .getElementById("fill-alpha-value")
                                .value = `${recode[idx + 3] / 255 * 100}`;

                        }

                        Util
                            .$shapeController
                            .changeFillColorTypeSelect();

                    }
                    idx += 4;
                    break;

                case Graphics.GRADIENT_FILL:
                    if (Util.$hitContext.isPointInPath(x, y)) {

                        document
                            .getElementById("fill-color-type-select")[
                                recode[idx] === GradientType.LINEAR ? 2 : 3
                            ]
                            .selected = true;

                        Util.$hitColor = {
                            "index"  : idx,
                            "style"  : Graphics.GRADIENT_FILL,
                            "type"   : recode[idx],
                            "ratios" : recode[idx + 1],
                            "shape"  : this
                        };

                        Util
                            .$shapeController
                            .changeFillColorTypeSelect();

                    }
                    idx += 6;
                    break;

                case Graphics.STROKE_STYLE:
                    Util.$hitContext.lineWidth = recode[idx] | 0;
                    if (Util.$hitContext.isPointInStroke(x, y)) {

                        if (this._$bitmapId) {

                            Util.$hitColor = {
                                "index": idx,
                                "width": Util.$hitContext.lineWidth,
                                "style": Graphics.BITMAP_STROKE,
                                "shape": this
                            };

                            document
                                .getElementById("fill-color-type-select")[1]
                                .selected = true;

                        } else {

                            Util.$hitColor = {
                                "index": idx,
                                "width": Util.$hitContext.lineWidth,
                                "style": Graphics.STROKE_STYLE,
                                "shape": this
                            };

                            const R = recode[idx + 4].toString(16).padStart(2, "0");
                            const G = recode[idx + 5].toString(16).padStart(2, "0");
                            const B = recode[idx + 6].toString(16).padStart(2, "0");

                            document
                                .getElementById("fill-color-type-select")[0]
                                .selected = true;

                            document
                                .getElementById("fill-color-value")
                                .value = `#${R}${G}${B}`;

                            document
                                .getElementById("fill-alpha-value")
                                .value = `${recode[idx + 7] / 255 * 100}`;
                        }

                        document
                            .getElementById("fill-stroke-width-value")
                            .value = `${Util.$hitContext.lineWidth}`;

                        Util
                            .$shapeController
                            .changeFillColorTypeSelect();

                    }
                    idx += 8;
                    break;

                case Graphics.GRADIENT_STROKE:
                    Util.$hitContext.lineWidth = recode[idx];
                    if (Util.$hitContext.isPointInStroke(x, y)) {

                        document
                            .getElementById("fill-color-type-select")[
                                recode[idx + 4] === GradientType.LINEAR ? 2 : 3
                            ]
                            .selected = true;

                        Util.$hitColor = {
                            "index"  : idx,
                            "width"  : recode[idx],
                            "style"  : Graphics.GRADIENT_STROKE,
                            "type"   : recode[idx + 4],
                            "ratios" : recode[idx + 5],
                            "shape"  : this
                        };

                        Util
                            .$shapeController
                            .changeFillColorTypeSelect();

                    }
                    idx += 10;
                    break;

                case Graphics.CLOSE_PATH:
                case Graphics.END_STROKE:
                case Graphics.END_FILL:
                    break;

                default:
                    break;

            }
        }
    }

    /**
     * @return {next2d.display.Shape}
     * @public
     */
    createInstance ()
    {
        const { Shape, Graphics } = window.next2d.display;

        const shape = new Shape();

        if (this._$grid) {
            const { Rectangle } = window.next2d.geom;
            shape.scale9Grid = new Rectangle(
                this._$grid.x, this._$grid.y,
                this._$grid.w, this._$grid.h
            );
        }

        const graphics = shape.graphics;

        graphics._$maxAlpha = 1;
        graphics._$canDraw  = true;
        graphics._$xMin     = this._$bounds.xMin;
        graphics._$xMax     = this._$bounds.xMax;
        graphics._$yMin     = this._$bounds.yMin;
        graphics._$yMax     = this._$bounds.yMax;

        if (this._$bitmapId) {

            const { BitmapData } = window.next2d.display;

            const instance = Util
                .$currentWorkSpace()
                .getLibrary(this._$bitmapId);

            if (instance) {

                shape._$bitmapId = this._$bitmapId;

                // setup
                graphics._$recode = [];

                const bitmapData = new BitmapData(
                    instance.width, instance.height, true, 0
                );
                bitmapData._$buffer = instance._$buffer;

                // clone
                const recodes = this._$recodes;
                if (recodes[recodes.length - 1] === Graphics.END_FILL) {

                    const length  = recodes.length - 6;
                    for (let idx = 0; idx < length; ++idx) {
                        graphics._$recode.push(recodes[idx]);
                    }

                    // add Bitmap Fill
                    graphics._$recode.push(
                        Graphics.BITMAP_FILL,
                        bitmapData,
                        null,
                        "repeat",
                        false
                    );

                } else {

                    const width      = this._$recodes[recodes.length - 9];
                    const caps       = this._$recodes[recodes.length - 8];
                    const joints     = this._$recodes[recodes.length - 7];
                    const miterLimit = this._$recodes[recodes.length - 6];

                    const length  = recodes.length - 10;
                    for (let idx = 0; idx < length; ++idx) {
                        graphics._$recode.push(recodes[idx]);
                    }

                    graphics._$recode.push(
                        Graphics.BITMAP_STROKE,
                        width,
                        caps,
                        joints,
                        miterLimit,
                        bitmapData,
                        [1, 0, 0, 1, graphics._$xMin, graphics._$yMin],
                        "repeat",
                        false
                    );

                }

            } else {

                graphics._$recode = this._$recodes.slice(0);

            }

        } else {

            graphics._$recode = this._$recodes.slice(0);

        }

        return shape;
    }
}
