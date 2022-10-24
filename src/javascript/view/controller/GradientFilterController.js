/**
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class GradientFilterController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor (name)
    {
        super(name);

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

        // 内部描画用のcontext
        const canvas  = document.createElement("canvas");
        canvas.width  = GradientFilterController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio;
        canvas.height = GradientFilterController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio;
        this._$drawGradientContext = canvas.getContext("2d");
    }

    /**
     * @description filterの指定グラデーションカラーの値を更新
     *
     * @param  {string} value
     * @return {string}
     * @method
     * @public
     */
    changeGradientColor (value)
    {
        if (!this._$currentTarget) {
            return value;
        }

        const filterId = this._$currentTarget.dataset.filterId | 0;
        if (!this._$filters.has(filterId)) {
            return value;
        }

        if (this._$currentPointer) {

            const filter = this._$filters.get(filterId).filter;
            const index  = this._$currentPointer.dataset.index | 0;
            filter._$colors[index] = `0x${value.slice(1)}` | 0;

            this._$currentPointer.dataset.color = value;
            this
                ._$currentPointer
                .getElementsByTagName("i")[0]
                .style.backgroundColor = value;

            this.updateFilterGradientCanvas(filter);

            this.disposeCharacterImage();

            this.reloadScreen();
        }

        return value;
    }

    /**
     * @description filterのグラデーション透明度を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeGradientAlpha (value)
    {
        value = Util.$clamp(
            +value,
            FilterController.MIN_ALPHA,
            FilterController.MAX_ALPHA
        );

        if (!this._$currentTarget) {
            return value;
        }

        const filterId = this._$currentTarget.dataset.filterId | 0;
        if (!this._$filters.has(filterId)) {
            return value;
        }

        if (this._$currentPointer) {
            const filter = this._$filters.get(filterId).filter;
            const index  = this._$currentPointer.dataset.index | 0;
            filter._$alphas[index] = value;

            this._$currentPointer.dataset.alpha = value;

            this.updateFilterGradientCanvas(filter);

            this.disposeCharacterImage();

            this.reloadScreen();
        }

        return value;
    }

    /**
     * @description GradientGlowFilterの設定項目をコントローラーに追加
     *              Added GradientGlowFilter configuration item to controller
     *
     * @param  {GradientGlowFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addGradientGlowFilter (filter = null, reload = true)
    {
        const element = document.getElementById("filter-setting-list");
        if (!element) {
            return ;
        }

        const id = this.createFilter(GradientGlowFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = `
${FilterHTML.createHeaderHTML(id, "GradientGlow")}

        <div class="filter-view-area-right">

            <div class="filter-container">
                ${FilterHTML.createBlurX(id, filter.blurX)}
                ${FilterHTML.createStrength(id, filter.strength)}
            </div>

            <div class="filter-container">
                ${FilterHTML.createBlurY(id, filter.blurY)}
                ${FilterHTML.createAngle(id, filter.angle)}
            </div>

            <div class="filter-container">
                ${FilterHTML.createDistance(id, filter.distance)}
            </div>

            <div class="filter-container">
                ${FilterHTML.createGradientColorPalette(id)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createGradientColor(id)}
                ${FilterHTML.createGradientAlpha(id)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createKnockout(id)}
            </div>

            <div class="filter-container">
                ${FilterHTML.createBevelType(id)}
                ${FilterHTML.createQuality(id)}
            </div>
            
        </div>
    </div>
</div>
`;

        // added element
        element.insertAdjacentHTML("beforeend", htmlTag);

        // グラデーションコントロール用のcanvas
        const canvas  = document.getElementById(`gradient-canvas-${id}`);
        canvas.width  = FilterController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio;
        canvas.height = FilterController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio;

        canvas.style.width  = `${FilterController.GRADIENT_CANVAS_WIDTH}px`;
        canvas.style.height = `${FilterController.GRADIENT_CANVAS_HEIGHT}px`;

        filter.context = canvas.getContext("2d");

        // 共有イベント処理
        this.setCommonEvent(id);

        // 保存データの場合はcheckboxの値を更新
        if (filter.knockout) {
            document
                .getElementById(`knockout-${id}`)
                .checked = true;
        }

        const inputIds = [
            `blurX-${id}`,
            `blurY-${id}`,
            `strength-${id}`,
            `angle-${id}`,
            `gradientAlpha-${id}`,
            `distance-${id}`
        ];

        for (let idx = 0; idx < inputIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(inputIds[idx])
            );
        }

        const clickIds = [
            `knockout-${id}`
        ];

        for (let idx = 0; idx < clickIds.length; ++idx) {
            this.setClickEvent(
                document.getElementById(clickIds[idx])
            );
        }

        const changeIds = [
            `gradientColor-${id}`,
            `type-${id}`,
            `quality-${id}`
        ];

        for (let idx = 0; idx < changeIds.length; ++idx) {
            this.setChangeEvent(
                document.getElementById(changeIds[idx])
            );
        }

        // ポインターを追加
        for (let idx = 0; idx < filter.ratios.length; ++idx) {

            const ratio = filter.ratios[idx];
            const color = `#${filter.colors[idx].toString(16).padStart(6, "0")}`;
            const alpha = filter.alphas[idx];

            this.addFilterGradientColorPointer(id, idx, ratio, color, alpha);

        }

        // ポインター追加イベント
        this.setCreateGradientColorPointerEvent(id);

        // canvasを更新
        this.updateFilterGradientCanvas(filter);

        // 内部キャッシュを削除
        if (reload) {
            this.disposeCharacterImage();
        }

        Util.$addModalEvent(
            document.getElementById(`filter-id-${id}`)
        );
    }

    /**
     * @description GradientBevelFilterの設定項目をコントローラーに追加
     *              Added GradientBevelFilter configuration item to controller
     *
     * @param  {GradientBevelFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addGradientBevelFilter (filter = null, reload = true)
    {
        const element = document.getElementById("filter-setting-list");
        if (!element) {
            return ;
        }

        const id = this.createFilter(GradientBevelFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = `
${FilterHTML.createHeaderHTML(id, "GradientBevel")}

        <div class="filter-view-area-right">

            <div class="filter-container">
                ${FilterHTML.createBlurX(id, filter.blurX)}
                ${FilterHTML.createStrength(id, filter.strength)}
            </div>

            <div class="filter-container">
                ${FilterHTML.createBlurY(id, filter.blurY)}
                ${FilterHTML.createAngle(id, filter.angle)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createDistance(id, filter.distance)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createGradientColorPalette(id)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createGradientColor(id)}
                ${FilterHTML.createGradientAlpha(id)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createKnockout(id)}
            </div>

            <div class="filter-container">                
                ${FilterHTML.createBevelType(id)}
                ${FilterHTML.createQuality(id)}
            </div>
            
        </div>
    </div>
</div>
`;

        // added element
        element.insertAdjacentHTML("beforeend", htmlTag);

        const canvas  = document.getElementById(`gradient-canvas-${id}`);
        canvas.width  = GradientFilterController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio;
        canvas.height = GradientFilterController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio;

        canvas.style.width  = `${GradientFilterController.GRADIENT_CANVAS_WIDTH}px`;
        canvas.style.height = `${GradientFilterController.GRADIENT_CANVAS_HEIGHT}px`;

        filter.context = canvas.getContext("2d");

        // 共有イベント処理
        this.setCommonEvent(id);

        // 保存データの場合はcheckboxの値を更新
        if (filter.knockout) {
            document
                .getElementById(`knockout-${id}`)
                .checked = true;
        }

        const inputIds = [
            `blurX-${id}`,
            `blurY-${id}`,
            `strength-${id}`,
            `angle-${id}`,
            `gradientAlpha-${id}`,
            `distance-${id}`
        ];

        for (let idx = 0; idx < inputIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(inputIds[idx])
            );
        }

        const clickIds = [
            `knockout-${id}`
        ];

        for (let idx = 0; idx < clickIds.length; ++idx) {
            this.setClickEvent(
                document.getElementById(clickIds[idx])
            );
        }

        const changeIds = [
            `gradientColor-${id}`,
            `type-${id}`,
            `quality-${id}`
        ];

        for (let idx = 0; idx < changeIds.length; ++idx) {
            this.setChangeEvent(
                document.getElementById(changeIds[idx])
            );
        }

        // ポインターを追加
        for (let idx = 0; idx < filter.ratios.length; ++idx) {

            const ratio = filter.ratios[idx];
            const color = `#${filter.colors[idx].toString(16).padStart(6, "0")}`;
            const alpha = filter.alphas[idx];

            this.addFilterGradientColorPointer(id, idx, ratio, color, alpha);

        }

        // ポインター追加イベント
        this.setCreateGradientColorPointerEvent(id);

        // canvasを更新
        this.updateFilterGradientCanvas(filter);

        // 内部キャッシュを削除
        if (reload) {
            this.disposeCharacterImage();
        }

        Util.$addModalEvent(
            document.getElementById(`filter-id-${id}`)
        );
    }

    /**
     * @description グラデーションのポインターを追加
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    addGradientColorPointer (event)
    {
        const filterId = event.target.dataset.filterId | 0;
        if (!this._$filters.has(filterId)) {
            return ;
        }

        const filter = this._$filters.get(filterId).filter;

        const index = filter.ratios.length;
        const ratio = event.offsetX;
        const color = document.getElementById(`gradientColor-${filterId}`).value;
        const alpha = document.getElementById(`gradientAlpha-${filterId}`).value | 0;

        filter.ratios.push(ratio);
        filter.colors.push(`0x${color.slice(1)}` | 0);
        filter.alphas.push(alpha);

        this.addFilterGradientColorPointer(
            filterId, index, ratio, color, alpha
        );

        // グラデーションレビューの更新
        this.updateFilterGradientCanvas(filter);

        // 再描画用に画像のキャッシュを削除
        this.disposeCharacterImage();

        // 再描画
        this.reloadScreen();
    }

    /**
     * @description グラデーションのポインター追加イベンち
     *
     * @param  {number} id
     * @return {void}
     * @method
     * @public
     */
    setCreateGradientColorPointerEvent (id)
    {
        const element = document
            .getElementById(`color-pointer-list-${id}`);

        if (!element) {
            return ;
        }

        element.addEventListener("mousedown", (event) =>
        {
            this.addGradientColorPointer(event);
        });
    }

    /**
     * @description グラデーションのcanvasを更新
     *
     * @param  {GradientBevelFilter|GradientGlowFilter} filter
     * @return {void}
     * @method
     * @public
     */
    updateFilterGradientCanvas (filter)
    {
        const context = this._$drawGradientContext;

        // clear
        context.clearRect(0, 0,
            GradientFilterController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio,
            GradientFilterController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio
        );

        const object = filter.adjustment();

        context.beginPath();

        const length = object.ratios.length;
        const x1 = Math.ceil(object.ratios[length - 1] * 255 * window.devicePixelRatio);
        const gradient = context.createLinearGradient(0, 0, x1, 0);

        for (let idx = 0; idx < length; ++idx) {
            const obj = Util.$intToRGB(object.colors[idx]);
            gradient.addColorStop(
                object.ratios[idx],
                `rgba(${obj.R}, ${obj.G}, ${obj.B}, ${object.alphas[idx]})`
            );
        }

        context.fillStyle = gradient;
        context.rect(0, 0,
            GradientFilterController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio,
            GradientFilterController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio
        );

        context.fill();

        filter.context.clearRect(0, 0,
            GradientFilterController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio,
            GradientFilterController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio
        );
        filter.context.drawImage(context.canvas, 0, 0);
    }

    /**
     * @description グラデーションのポインターを追加
     *
     * @param  {number} id
     * @param  {number} index
     * @param  {number} ratio
     * @param  {string} color
     * @param  {number} alpha
     * @return {void}
     * @method
     * @public
     */
    addFilterGradientColorPointer (id, index, ratio, color, alpha)
    {
        const element = document
            .getElementById(`color-pointer-list-${id}`);

        const htmlTag = `
<div class="color-pointer" style="left: ${ratio - 4}px;" data-filter-id="${id}" data-index="${index}" data-color="${color}" data-alpha="${alpha}">
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

        if (index) {
            pointer.addEventListener("dblclick", (event) =>
            {
                this.removeGradientColorPointer(event);
            });
        }

        // 初期値は最後に生成されたポインターのElement
        this._$currentPointer = pointer;
    }

    /**
     * @description グラデーションのカラーポインターを削除
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    removeGradientColorPointer (event)
    {
        const filterId = event.target.dataset.filterId | 0;
        if (!this._$filters.has(filterId)) {
            return ;
        }

        const element = document
            .getElementById(`color-pointer-list-${filterId}`);

        if (2 >= element.children.length ) {
            return ;
        }

        const index  = event.target.dataset.index | 0;
        const filter = this._$filters.get(filterId).filter;

        filter.ratios.splice(index, 1);
        filter.colors.splice(index, 1);
        filter.alphas.splice(index, 1);

        // remove
        event.target.remove();

        // 削除したindexの差分の補完
        for (let idx = index; idx < element.children.length; ++idx) {

            const child = element.children[idx];
            const index = (child.dataset.index | 0) - 1;

            child.dataset.index = `${index}`;
        }

        super.focusOut();

        // グラデーションプレビューを更新
        this.updateFilterGradientCanvas(filter);

        // 再描画用に画像のキャッシュを削除
        this.disposeCharacterImage();

        // 再描画
        this.reloadScreen();
    }

    /**
     * @description グラデーションのカラーポインターを起動
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
        this._$currentTarget  = event.target;
        this._$currentPointer = event.target;

        const filterId = event.target.dataset.filterId;

        document
            .getElementById(`gradientColor-${filterId}`)
            .value = event.target.dataset.color;

        document
            .getElementById(`gradientAlpha-${filterId}`)
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
        const element = this._$currentTarget;
        if (!element) {
            return ;
        }

        const index = element.dataset.index | 0;
        if (index) {
            window.requestAnimationFrame(() =>
            {
                event.preventDefault();

                const filterId = element.dataset.filterId | 0;
                if (!this._$filters.has(filterId)) {
                    return ;
                }

                const currentPoint = parseFloat(
                    element.style.left
                );

                const value = Util.$clamp(
                    currentPoint + (event.screenX - this._$pointX) + 4,
                    GradientFilterController.MIN_GRADIENT_POINTER,
                    GradientFilterController.MAX_GRADIENT_POINTER
                );

                element.style.left = `${value - 4}px`;

                const filter = this._$filters.get(filterId).filter;
                filter._$ratios[index] = value;

                if (this._$pointX) {
                    this._$pointX = event.screenX;
                }

                // グラデーションプレビューを更新
                this.updateFilterGradientCanvas(filter);

                // 再描画用にキャッシュをクリア
                this.disposeCharacterImage();

                // 再描画
                this.reloadScreen();
            });
        }
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
