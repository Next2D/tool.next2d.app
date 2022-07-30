/**
 * @class
 * @extends {BaseController}
 */
class ShapeController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("fill-color");

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$currentPointer = null;

        /**
         * @type {CanvasRenderingContext2D}
         * @default null
         * @private
         */
        this._$viewGradientContext = null;

        /**
         * @type {CanvasRenderingContext2D}
         * @default null
         * @private
         */
        this._$drawGradientContext = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseMoveGradientColorPointer = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseUpGradientColorPointer = null;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get GRADIENT_CANVAS_WIDTH ()
    {
        return 255;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get GRADIENT_CANVAS_HEIGHT ()
    {
        return 30;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_COLOR ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_COLOR ()
    {
        return 100;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_ALPHA ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_ALPHA ()
    {
        return 100;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_STROKE ()
    {
        return 1;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_STROKE ()
    {
        return 255;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_GRADIENT_POINTER ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_GRADIENT_POINTER ()
    {
        return 255;
    }

    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();

        const canvas = document.getElementById("gradient-canvas");
        if (canvas) {

            canvas.style.transform          = `scale(${1 / window.devicePixelRatio}, ${1 / window.devicePixelRatio})`;
            canvas.style.backfaceVisibility = "hidden";
            canvas.style.transformOrigin    = "0 0";

            const width  = ShapeController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio;
            const height = ShapeController.GRADIENT_CANVAS_HEIGHT  * window.devicePixelRatio;

            canvas.width  = width;
            canvas.height = height;
            this._$viewGradientContext = canvas.getContext("2d");

            const drawCanvas  = document.createElement("canvas");
            drawCanvas.width  = width;
            drawCanvas.height = height;
            this._$drawGradientContext = drawCanvas.getContext("2d");
        }

        const inputIds = [
            "fill-alpha-value",
            "fill-stroke-width-value"
        ];
        for (let idx = 0; idx < inputIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(inputIds[idx])
            );
        }

        const selectIds = [
            "fill-color-type-select",
            "fill-color-value",
            "fill-bitmap-select"
        ];

        for (let idx = 0; idx < selectIds.length; ++idx) {
            this.setChangeEvent(
                document.getElementById(selectIds[idx])
            );
        }

        const element = document
            .getElementById("color-pointer-list");

        if (element) {
            element.addEventListener("mousedown", (event) =>
            {
                this.setGradientColorPointerEvent(event);
            });
        }
    }

    /**
     * @description グラデーションのポインターを削除
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    removeGradientColorPointer (event)
    {
        const element = document
            .getElementById("color-pointer-list");

        if (element.children.length > 2 && Util.$hitColor) {

            const index = event.target.dataset.index | 0;

            Util.$hitColor.ratios.splice(index, 1);

            // remove
            event.target.remove();

            // adj
            for (let idx = index; idx < element.children.length; ++idx) {

                const child = element.children[idx];
                const index = (child.dataset.index | 0) - 1;

                child.dataset.index = `${index}`;
            }

            // グラデーションレビューを再描画
            this.updateGradientCanvas();

            // 再描画ようにキャッシュを削除
            Util.$hitColor.shape.cacheClear();

            // 再描画
            this.reloadScreen();
        }
    }

    /**
     * @description グラデーションのポインター追加イベント
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    setGradientColorPointerEvent (event)
    {
        if (!this._$currentPointer || !Util.$hitColor) {
            return ;
        }

        const color  = document.getElementById("fill-color-value").value;
        const alpha  = document.getElementById("fill-alpha-value").value | 0;
        const object = Util.$intToRGB(`0x${color.slice(1)}` | 0);

        const stopObject = {
            "R": object.R,
            "G": object.G,
            "B": object.B,
            "A": alpha / 100 * 255,
            "ratio": event.offsetX / 255
        };

        Util.$hitColor.ratios.push(stopObject);

        Util.$hitColor.ratios.sort((a, b) =>
        {
            switch (true) {

                case a.ratio > b.ratio:
                    return 1;

                case a.ratio < b.ratio:
                    return -1;

                default:
                    return 0;

            }
        });

        // グラデーションレビューを再描画
        this.initializeGradient();

        // 再描画ようにキャッシュを削除
        Util.$hitColor.shape.cacheClear();

        // 再描画
        this.reloadScreen();

        // 新しいポインターElementをセット
        this._$currentPointer = event.target.children[
            Util.$hitColor.ratios.indexOf(stopObject)
        ];
    }

    /**
     * @description 塗りの透明度
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeFillAlphaValue (value)
    {
        value = Util.$clamp(
            value | 0,
            ShapeController.MIN_ALPHA,
            ShapeController.MAX_ALPHA
        );

        if (Util.$hitColor) {

            const { GradientType } = window.next2d.display;
            switch (Util.$hitColor.type) {

                case GradientType.LINEAR:
                case GradientType.RADIAL:
                    if (this._$currentPointer) {
                        this._$currentPointer.dataset.alpha = value;
                        Util.$hitColor.shape.changeColor(
                            this._$currentPointer.dataset.index | 0
                        );
                        this.updateGradientCanvas();
                    }
                    break;

                default:
                    Util.$hitColor.shape.changeColor();
                    break;

            }

        }

        return value;
    }

    /**
     * @description 線の幅
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeFillStrokeWidthValue (value)
    {
        value = Util.$clamp(
            value | 0,
            ShapeController.MIN_STROKE,
            ShapeController.MAX_STROKE
        );

        if (this._$currentValue !== value && Util.$hitColor) {

            Util.$hitColor.shape.changeColor();

            const { GradientType } = window.next2d.display;
            switch (Util.$hitColor.type) {

                case GradientType.LINEAR:
                case GradientType.RADIAL:
                    this.updateGradientCanvas();
                    break;

                default:
                    break;

            }

        }

        return value;
    }

    /**
     * @description 塗りのカラータイプの設定
     *
     * @param  {string} [value=""]
     * @return {void}
     * @method
     * @public
     */
    changeFillColorTypeSelect (value = "")
    {
        const gradientElement = document
            .getElementById("fill-color-gradient-container");

        const bitmapElement = document
            .getElementById("fill-color-bitmap-container");

        const colorElement = document
            .getElementById("fill-color-rgba-container");

        const widthElement = document
            .getElementById("fill-stroke-color-rgba-container");

        // reset
        if (value) {
            Util.$hitColor.shape.bitmapId = 0;
        }

        // 表示切り替え
        switch (document.getElementById("fill-color-type-select").value) {

            case "rgba":
                gradientElement.style.display = "none";
                bitmapElement.style.display   = "none";
                colorElement.style.display    = "";
                widthElement.style.display    = Util.$hitColor.width ? "" : "none";
                break;

            case "bitmap":
                gradientElement.style.display = "none";
                bitmapElement.style.display   = "";
                colorElement.style.display    = "none";
                widthElement.style.display    = Util.$hitColor.width ? "" : "none";
                this.createBitmapList();
                break;

            default:
                gradientElement.style.display = "";
                bitmapElement.style.display   = "none";
                colorElement.style.display    = "";
                widthElement.style.display    = Util.$hitColor.width ? "" : "none";
                if (!value) {
                    this.initializeGradient();
                }
                break;

        }

        if (value) {
            Util.$hitColor.shape.changeStyle(value);
        }
    }

    /**
     * @description 塗りのカラー設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFillColorValue (value)
    {
        if (Util.$hitColor) {

            if (this._$currentPointer) {

                const pointerColor = this
                    ._$currentPointer
                    .getElementsByTagName("i")[0];

                this._$currentPointer.dataset.color = value;
                pointerColor.style.backgroundColor  = value;

                Util.$hitColor.shape.changeColor(
                    this._$currentPointer.dataset.index | 0
                );

                this.updateGradientCanvas();

            } else {

                Util.$hitColor.shape.changeColor();

            }
        }
    }

    /**
     * @description 塗りの画像設定
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeFillBitmapSelect (value)
    {
        if (!Util.$hitColor) {
            return ;
        }

        const instance = Util
            .$currentWorkSpace()
            .getLibrary(
                value | 0
            );

        Util.$hitColor.shape.bitmapId = instance.id;
        Util.$hitColor.shape.cacheClear();
    }

    /**
     * @description 画像のSelectを生成
     *
     * @return {void}
     * @method
     * @public
     */
    createBitmapList ()
    {
        const element = document
            .getElementById("fill-bitmap-select");

        const children = element.children;
        while (children.length) {
            children[0].remove();
        }

        const option = document.createElement("option");
        option.innerHTML       = "Image Selection";
        option.defaultSelected = true;
        option.disabled        = true;
        element.appendChild(option);

        const bitmapId = Util.$hitColor.shape.bitmapId;

        const workSpace = Util.$currentWorkSpace();
        for (const instance of workSpace._$libraries.values()) {

            if (instance.type !== "bitmap") {
                continue;
            }

            const option = document.createElement("option");

            option.value     = instance.id;
            option.innerHTML = instance.name;

            if (bitmapId && bitmapId === instance.id) {
                option.selected = true;
            }

            element.appendChild(option);
        }
    }

    /**
     * @description グラデーション初期化
     *
     * @return {void}
     * @method
     * @public
     */
    initializeGradient ()
    {
        if (!Util.$hitColor) {
            return ;
        }

        const children = document
            .getElementById("color-pointer-list")
            .children;

        while (children.length) {
            children[0].remove();
        }

        const length = Util.$hitColor.ratios.length;
        for (let idx = 0; idx < length; ++idx) {

            const color = Util.$hitColor.ratios[idx];
            const R = color.R.toString(16).padStart(2, "0");
            const G = color.G.toString(16).padStart(2, "0");
            const B = color.B.toString(16).padStart(2, "0");

            this.addGradientColorPointer(
                idx, color.ratio * 255, `#${R}${G}${B}`, color.A / 255 * 100
            );

            if (idx + 1 === length) {
                document
                    .getElementById("fill-color-value")
                    .value = `#${R}${G}${B}`;

                document
                    .getElementById("fill-alpha-value")
                    .value = color.A / 255 * 100;
            }
        }

        this.updateGradientCanvas();
    }

    /**
     * @description グラデーションのポインターを追加
     *
     * @param  {number} index
     * @param  {number} ratio
     * @param  {string} color
     * @param  {number} alpha
     * @return {void}
     * @method
     * @public
     */
    addGradientColorPointer (index, ratio, color, alpha)
    {
        const element = document
            .getElementById("color-pointer-list");

        const htmlTag = `
<div class="color-pointer" style="left: ${ratio - 4}px;" data-index="${index}" data-color="${color}" data-alpha="${alpha}">
    <div class="color-pointer-triangle"></div>
    <div class="color-pointer-rect">
        <i class="pointer-color" style="background-color: ${color}"></i>
    </div>
</div>
`;

        element.insertAdjacentHTML("beforeend", htmlTag);

        const pointer = element.lastElementChild;

        pointer.addEventListener("mousedown", (event) =>
        {
            this.mouseDownGradientColorPointer(event);
        });

        pointer.addEventListener("dblclick", (event) =>
        {
            this.removeGradientColorPointer(event);
        });

        // 初期値は最後に生成されたポインターのElement
        this._$currentPointer = pointer;
    }

    /**
     * @description グラデーションプレビューの再描画
     *
     * @return {void}
     * @method
     * @public
     */
    updateGradientCanvas ()
    {
        const drawContext = this._$drawGradientContext;

        // clear
        drawContext.clearRect(0, 0,
            ShapeController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio,
            ShapeController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio
        );

        drawContext.beginPath();

        const ratios = Util.$hitColor.ratios;

        const length = ratios.length;
        const x1 = Math.ceil(ratios[length - 1].ratio * 255 * window.devicePixelRatio);

        const gradient = drawContext.createLinearGradient(0, 0, x1, 0);
        for (let idx = 0; idx < length; ++idx) {

            const object = ratios[idx];

            gradient.addColorStop(
                object.ratio,
                `rgba(${object.R}, ${object.G}, ${object.B}, ${object.A / 255})`
            );

        }

        drawContext.fillStyle = gradient;
        drawContext.rect(0, 0,
            ShapeController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio,
            ShapeController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio
        );

        drawContext.fill();

        const viewContext = this._$viewGradientContext;
        viewContext.clearRect(0, 0,
            ShapeController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio,
            ShapeController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio
        );
        viewContext.drawImage(drawContext.canvas, 0, 0);
    }

    /**
     * @description ポインターのマウスダウンで移動イベントを起動する
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDownGradientColorPointer (event)
    {
        // 親のイベントを中止
        event.stopPropagation();

        // 初期化
        this._$saved          = false;
        this._$pointX         = event.screenX;
        this._$currentPointer = event.target;

        document
            .getElementById("fill-color-value")
            .value = event.target.dataset.color;

        document
            .getElementById("fill-alpha-value")
            .value = event.target.dataset.alpha;

        if (!this._$mouseMoveGradientColorPointer) {
            this._$mouseMoveGradientColorPointer =
                this.mouseMoveGradientColorPointer.bind(this);
        }

        if (!this._$mouseUpGradientColorPointer) {
            this._$mouseUpGradientColorPointer =
                this.mouseUpGradientColorPointer.bind(this);
        }

        // イベントを登録
        window.addEventListener("mousemove", this._$mouseMoveGradientColorPointer);
        window.addEventListener("mouseup", this._$mouseUpGradientColorPointer);
    }

    /**
     * @description グラデーションのカラーポインターの移動処理
     *
     * @return {void}
     * @method
     * @public
     */
    mouseMoveGradientColorPointer (event)
    {
        const element = this._$currentPointer;
        if (!element) {
            return ;
        }

        window.requestAnimationFrame(() =>
        {
            if (!Util.$hitColor) {
                return ;
            }

            this.save();

            event.preventDefault();

            const currentPoint = parseFloat(
                element.style.left
            );

            const value = Util.$clamp(
                currentPoint + (event.screenX - this._$pointX) + 4,
                ShapeController.MIN_GRADIENT_POINTER,
                ShapeController.MAX_GRADIENT_POINTER
            );

            element.style.left = `${value - 4}px`;

            Util.$hitColor.ratios[element.dataset.index].ratio = value / 255;

            if (this._$pointX) {
                this._$pointX = event.screenX;
            }

            // グラデーションプレビューを更新
            this.updateGradientCanvas();

            // 再描画ようにキャッシュを削除
            Util.$hitColor.shape.cacheClear();

            // 再描画
            this.reloadScreen();
        });
    }

    /**
     * @description グラデーションのカラーポインターの移動を終了、イベントも削除
     *
     * @return {void}
     * @method
     * @public
     */
    mouseUpGradientColorPointer ()
    {
        // イベントを削除
        window.removeEventListener("mousemove", this._$mouseMoveGradientColorPointer);
        window.removeEventListener("mouseup", this._$mouseUpGradientColorPointer);
        Util.$setCursor("auto");

        // 設定を初期化
        super.focusOut();
    }
}

Util.$shapeController = new ShapeController();
