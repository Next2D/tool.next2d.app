/**
 * @class
 * @extends {BaseController}
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
        const filterId = this._$currentTarget.dataset.filterId | 0;
        if (!this._$filters.has(filterId)) {
            return ;
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
        const filterId = this._$currentTarget.dataset.filterId | 0;
        if (!this._$filters.has(filterId)) {
            return ;
        }

        value = Util.$clamp(
            +value,
            FilterController.MIN_ALPHA,
            FilterController.MAX_ALPHA
        );

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
     * @param  {HTMLDivElement} element
     * @param  {GradientBevelFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addGradientBevelFilter (element, filter = null, reload = true)
    {

        const id = this.createFilter(GradientBevelFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = this.getFilterHeaderHTML(id, "GradientBevel") + `

        <div class="filter-view-area-right">

            <div class="filter-container">
                <div class="filter-text">BlurX</div>
                <div><input type="text" id="blurX-${id}" value="${filter.blurX}" data-name="blurX" data-filter-id="${id}" data-detail="水平方向にぼかす"></div>
                                
                <div class="filter-text">Strength</div>
                <div><input type="text" id="strength-${id}" value="${filter.strength}" data-filter-id="${id}" data-name="strength" data-detail="フィルター強度"></div>
            </div>

            <div class="filter-container">
                <div class="filter-text">BlurY</div>
                <div><input type="text" id="blurY-${id}" value="${filter.blurY}" data-name="blurY" data-filter-id="${id}" data-detail="{{垂直方向にぼかす}}"></div>
                
                <div class="filter-text">Angle</div>
                <div><input type="text" id="angle-${id}" value="${filter.angle}" data-filter-id="${id}" data-name="angle" data-detail="{{フィルター角度}}"></div>
            </div>
            
            <div class="filter-container">
                <div class="filter-text">Distance</div>
                <div><input type="text" id="distance-${id}" value="${filter.distance}" data-filter-id="${id}" data-name="distance" data-detail="{{フィルター距離}}"></div>
            </div>
            
            <div class="filter-container">
                <div id="gradient-color-palette-${id}" class="gradient-color-palette">
                    <div id="color-palette-${id}" class="color-palette">
                        <canvas id="gradient-canvas-${id}"></canvas>
                    </div>
                    <div id="color-pointer-list-${id}" data-filter-id="${id}" class="color-pointer-list" data-detail="{{カラーポインターを追加}}"></div>
                </div>
            </div>
            
            <div class="filter-container">
                <div class="filter-text">Color</div>
                <div><input type="color" id="gradientColor-${id}" value="#000000" data-detail="{{グラデーションカラー}}"></div>
                
                <div class="filter-text">Alpha</div>
                <div><input type="text" id="gradientAlpha-${id}" value="100" data-name="gradientAlpha" data-detail="{{グラデーションのアルファ}}"></div>
            </div>
            
            <div class="filter-container">
                <div><input type="checkbox" id="knockout-${id}" data-name="knockout" data-filter-id="${id}"></div>
                <div class="filter-text-long">
                    <label for="knockout-${id}">Knockout</label>
                </div>
            </div>

            <div class="filter-container">
                <div class="filter-text-long">Type</div>
                <div>
                    <select id="type-${id}" data-name="type" data-filter-id="${id}">
                        <option value="inner">Inner</option>
                        <option value="outer">Outer</option>
                        <option value="full">Full</option>
                    </select>
                </div>
    
                <div class="filter-text-long">Quality</div>
                <div>
                    <select id="quality-${id}" data-name="quality" data-filter-id="${id}">
                        <option value="1">Low</option>
                        <option value="2">Middel</option>
                        <option value="3">High</option>
                    </select>
                </div>
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

        canvas.style.transform          = `scale(${1 / window.devicePixelRatio}, ${1 / window.devicePixelRatio})`;
        canvas.style.backfaceVisibility = "hidden";
        canvas.style.transformOrigin    = "0 0";

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
