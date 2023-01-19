/**
 * フィルター機能のコントローラークラス、グラデーションは親クラスで管理
 * Controller class for filter functions, gradients managed by parent class
 *
 * @class
 * @extends {GradientFilterController}
 * @memberOf view.controller
 */
class FilterController extends GradientFilterController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("filter");

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$filterId = 0;

        /**
         * @type {Map}
         * @private
         */
        this._$filters = new Map();
    }

    /**
     * @description ブラーの最小値
     *              Minimum value of blur
     *
     * @return {number}
     * @const
     * @static
     */
    static get MIN_BLUR ()
    {
        return 0;
    }

    /**
     * @description ブラーの最大値
     *              Maximum value of blur
     *
     * @return {number}
     * @const
     * @static
     */
    static get MAX_BLUR ()
    {
        return 255;
    }

    /**
     * @description 透明度の最小値
     *              Minimum value of alpha
     *
     * @return {number}
     * @const
     * @static
     */
    static get MIN_ALPHA ()
    {
        return 0;
    }

    /**
     * @description 透明度の最大値
     *              Maximum value of alpha
     *
     * @return {number}
     * @const
     * @static
     */
    static get MAX_ALPHA ()
    {
        return 100;
    }

    /**
     * @description 塗りの強さの最小値
     *              Minimum value of strength
     *
     * @return {number}
     * @const
     * @static
     */
    static get MIN_STRENGTH ()
    {
        return 0;
    }

    /**
     * @description 塗りの強さの最大値
     *              Maximum value of strength
     *
     * @return {number}
     * @const
     * @static
     */
    static get MAX_STRENGTH ()
    {
        return 255;
    }

    /**
     * @description 回転の最小値
     *              Minimum value of rotate
     *
     * @return {number}
     * @const
     * @static
     */
    static get MIN_ROTATE ()
    {
        return -360;
    }

    /**
     * @description 回転の最大値
     *              Maximum value of rotate
     *
     * @return {number}
     * @const
     * @static
     */
    static get MAX_ROTATE ()
    {
        return 360;
    }

    /**
     * @description 距離の最小値
     *              Minimum value of distance
     *
     * @return {number}
     * @const
     * @static
     */
    static get MIN_DISTANCE ()
    {
        return -255;
    }

    /**
     * @description 距離の最大値
     *              Maximum value of distance
     *
     * @return {number}
     * @const
     * @static
     */
    static get MAX_DISTANCE ()
    {
        return 255;
    }

    /**
     * @description カラーの最小値
     *              Minimum value of color
     *
     * @return {number}
     * @const
     * @static
     */
    static get MIN_COLOR ()
    {
        return 0;
    }

    /**
     * @description カラーの最大値
     *              Maximum value of color
     *
     * @return {number}
     * @const
     * @static
     */
    static get MAX_COLOR ()
    {
        return 0xffffff;
    }

    /**
     * @description クオリティーの最小値
     *              Minimum value of quality
     *
     * @return {number}
     * @const
     * @static
     */
    static get MIN_QUALITY ()
    {
        return 0;
    }

    /**
     * @description クオリティーの最大値
     *              Maximum value of quality
     *
     * @return {number}
     * @const
     * @static
     */
    static get MAX_QUALITY ()
    {
        return 16;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();

        const element = document.getElementById("filter-add");
        if (element) {
            element
                .addEventListener("mousedown", () =>
                {
                    this.addFilter();
                    this.disposeCharacterImage();
                    this.reloadScreen();
                });
        }
    }

    /**
     * @description 幅高さの変更のロックのOn/Off関数
     *              On/Off function for locking width-height changes.
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    lock (event)
    {
        // 全てのイベントを中止
        event.preventDefault();
        event.stopPropagation();

        // ロックのOn/Off
        const filterId = event.currentTarget.dataset.filterId | 0;
        if (!this._$filters.has(filterId)) {
            return ;
        }

        const object = this._$filters.get(filterId);
        object.lock  = !object.lock;

        // 初期化
        this._$currentValue = null;

        event
            .currentTarget
            .childNodes[1]
            .setAttribute("class", object.lock
                ? "active"
                : "disable"
            );
    }

    /**
     * @description フィルターのコントローラー枠を表示・非表示にする
     *              Show/hide the controller frame of the filter
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    clickNodeTitle (event)
    {
        const filterId = event.target.dataset.filterId | 0;

        const element = document
            .getElementById(`filter-view-area-${filterId}`);

        if (!element) {
            return ;
        }

        if (element.style.display === "none") {

            element.setAttribute("style", "");
            document
                .getElementById(`filter-title-arrow-${filterId}`)
                .setAttribute("class", "arrow active");

        } else {

            element.setAttribute("style", "display: none;");
            document
                .getElementById(`filter-title-arrow-${filterId}`)
                .setAttribute("class", "arrow disable");

        }
    }

    /**
     * @description フィルターの有効・無効の処理
     *              Enabling and disabling filters
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    changeState (event)
    {
        const filterId = event.target.dataset.filterId | 0;

        if (!this._$filters.has(filterId)) {
            return ;
        }

        const object = this._$filters.get(filterId);

        // 値を更新
        object.filter.state = !object.filter.state;

        const element = document
            .getElementById(`filter-state-${filterId}`);

        if (element) {
            element.setAttribute("class", object.filter.state
                ? "filter-active"
                : "filter-disable"
            );
        }

        this.disposeCharacterImage();
    }

    /**
     * @description フィルターのコントローラーブロックの削除
     *              Delete the controller block of the filter
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    removeFilter (event)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const filterId = event.target.dataset.filterId | 0;

        const target = activeElements[0];

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                target.dataset.layerId | 0
            );

        const character = layer.getCharacter(
            target.dataset.characterId | 0
        );

        const frame = Util.$timelineFrame.currentFrame;

        let place = character.getPlace(frame);
        if (place.tweenFrame) {

            if (character.endFrame - 1 > frame && !character.hasTween(frame)) {

                Util
                    .$timelineTool
                    .executeTimelineKeyAdd();

                place = character.getPlace(frame);
            }

            place = character.getPlace(place.tweenFrame);
        }

        const object = this._$filters.get(filterId);
        const index  = place.filter.indexOf(object.filter);
        place.filter.splice(index, 1);

        // tween情報があれば更新
        character.updateTweenFilter(frame);

        // remove
        this._$filters.delete(filterId);
        if (!this._$filters.size) {
            document
                .querySelectorAll(".filter-none")[0]
                .style.display = "";
        }

        const element = document
            .getElementById(`filter-id-${filterId}`);

        if (element) {
            element.remove();
        }

        super.focusOut();

        // 再描画用にキャッシュを削除
        character.dispose();
    }

    /**
     * @description InputElementにフォーカスした際の処理関数
     *              Processing function when InputElement is focused
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    focusIn (event)
    {
        super.focusIn(event);
        this.setLockElement(event);
    }

    /**
     * @description InputElement上でマウスを押下した際の処理関数
     *              Processing function when the mouse is pressed on an InputElement
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDown (event)
    {
        super.mouseDown(event);
        this.setLockElement(event);
    }

    /**
     * @description ロックが有効の際に対象となるElementを変数にセット
     *              Set a variable to the target Element when locking is enabled
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    setLockElement (event)
    {
        // 初期化
        this._$lockTarget = null;

        if (this._$focus) {
            return ;
        }

        const filterId = event.target.dataset.filterId | 0;
        if (!this._$filters.has(filterId)) {
            return ;
        }

        const object = this._$filters.get(filterId);
        if (!object.lock) {
            return ;
        }

        switch (this._$currentTarget.dataset.name) {

            case "blurX":
                this._$lockTarget = document.getElementById(`blurY-${filterId}`);
                break;

            case "blurY":
                this._$lockTarget = document.getElementById(`blurX-${filterId}`);
                break;

            default:
                // 他のInput変更時もこの処理が行われるので、対象以外はスキップ
                break;

        }
    }

    /**
     * @description blurXの値を更新
     *              Update blurX values
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeBlurX (value)
    {
        value = Util.$clamp(
            +value,
            FilterController.MIN_BLUR,
            FilterController.MAX_BLUR
        );

        this.updateProperty("blurX", value);

        return value;
    }

    /**
     * @description blurYの値を更新
     *              Update blurY values
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeBlurY (value)
    {
        value = Util.$clamp(
            +value,
            FilterController.MIN_BLUR,
            FilterController.MAX_BLUR
        );

        this.updateProperty("blurY", value);

        return value;
    }

    /**
     * @description strengthの値を更新
     *              Update strength values
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeStrength (value)
    {
        value = Util.$clamp(
            +value,
            FilterController.MIN_STRENGTH,
            FilterController.MAX_STRENGTH
        );

        this.updateProperty("strength", value);

        return value;
    }

    /**
     * @description 透明度の値を更新
     *              Update alpha values
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeAlpha (value)
    {
        value = Util.$clamp(
            +value,
            FilterController.MIN_ALPHA,
            FilterController.MAX_ALPHA
        );

        this.updateProperty("alpha", value);

        return value;
    }

    /**
     * @description 影の透明度を更新
     *              Update shadow transparency
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeShadowAlpha (value)
    {
        value = Util.$clamp(
            +value,
            FilterController.MIN_ALPHA,
            FilterController.MAX_ALPHA
        );

        this.updateProperty("shadowAlpha", value);

        return value;
    }

    /**
     * @description ハイライトの透明度を更新
     *              Update highlight transparency
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeHighlightAlpha (value)
    {
        value = Util.$clamp(
            +value,
            FilterController.MIN_ALPHA,
            FilterController.MAX_ALPHA
        );

        this.updateProperty("highlightAlpha", value);

        return value;
    }

    /**
     * @description 回転の値を更新
     *              Update rotation values
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeAngle (value)
    {
        value = Util.$clamp(
            (value | 0) % 360,
            FilterController.MIN_ROTATE,
            FilterController.MAX_ROTATE
        );
        if (0 > value) {
            value += 360;
        }

        this.updateProperty("angle", value);

        return value;
    }

    /**
     * @description 距離の値を更新
     *              Update distance values
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeDistance (value)
    {
        value = Util.$clamp(
            +value,
            FilterController.MIN_DISTANCE,
            FilterController.MAX_DISTANCE
        );

        this.updateProperty("distance", value);

        return value;
    }

    /**
     * @description カラーの値を更新
     *              Update color values
     *
     * @param  {string} value
     * @return {string}
     * @method
     * @public
     */
    changeColor (value)
    {
        this.updateProperty("color", Util.$clamp(
            `0x${value.slice(1)}` | 0,
            FilterController.MIN_COLOR,
            FilterController.MAX_COLOR
        ));

        return value;
    }

    /**
     * @description 影の色の値を更新
     *              Update shadow color values
     *
     * @param  {string} value
     * @return {string}
     * @method
     * @public
     */
    changeShadowColor (value)
    {
        this.updateProperty("shadowColor", Util.$clamp(
            `0x${value.slice(1)}` | 0,
            FilterController.MIN_COLOR,
            FilterController.MAX_COLOR
        ));
        return value;
    }

    /**
     * @description ハイライトカラーの値を更新
     *              Update highlight color values
     *
     * @param  {string} value
     * @return {string}
     * @method
     * @public
     */
    changeHighlightColor (value)
    {
        this.updateProperty("highlightColor", Util.$clamp(
            `0x${value.slice(1)}` | 0,
            FilterController.MIN_COLOR,
            FilterController.MAX_COLOR
        ));
        return value;
    }

    /**
     * @description 品質の値を更新
     *              Update quality values
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeQuality (value)
    {
        value = Util.$clamp(
            value | 0,
            FilterController.MIN_QUALITY,
            FilterController.MAX_QUALITY
        );
        this.updateProperty("quality", value);
    }

    /**
     * @description タイプの値を更新
     *              Update type values
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeType (value)
    {
        switch (value) {

            case "inner":
            case "outer":
            case "full":
                this.updateProperty("type", value);
                break;

            default:
                break;

        }
    }

    /**
     * @description Knockoutの値を更新
     *              Update knockout values
     *
     * @return {void}
     * @method
     * @public
     */
    changeKnockout ()
    {
        this.updateProperty("knockout", !!this._$currentTarget.checked);
    }

    /**
     * @description innerの値を更新
     *              Update INNER value
     *
     * @return {void}
     * @method
     * @public
     */
    changeInner ()
    {
        this.updateProperty("inner", !!this._$currentTarget.checked);
    }

    /**
     * @description hideObjectの変更値を更新
     *              Update HideObject value
     *
     * @return {void}
     * @method
     * @public
     */
    changeHideObject ()
    {
        this.updateProperty("hideObject", !!this._$currentTarget.checked);
    }

    /**
     * @description 指定プロパティーの値を更新
     *              Update the value of the specified property
     *
     * @param  {string} name
     * @param  {*} value
     * @return {void}
     * @method
     * @public
     */
    updateProperty (name, value)
    {
        if (!this._$currentTarget) {
            return ;
        }

        const filterId = this._$currentTarget.dataset.filterId | 0;
        if (!this._$filters.has(filterId)) {
            return ;
        }

        const object = this._$filters.get(filterId);
        if (object.filter[name] === value) {
            return ;
        }

        object.filter[name] = value;
        this.disposeCharacterImage();
    }

    /**
     * @description 更新したDisplayObjectを再描画する為、内部キャッシュを削除する
     *              Delete internal cache to redraw updated DisplayObjects
     *
     * @return {void}
     * @method
     * @public
     */
    disposeCharacterImage ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const element = activeElements[0];

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                element.dataset.layerId | 0
            );

        const character = layer.getCharacter(
            element.dataset.characterId | 0
        );

        // tween情報があれば更新
        character.relocationTween(
            Util.$timelineFrame.currentFrame
        );

        // 再描画用にキャッシュを削除
        character.dispose();
    }

    /**
     * @description フィルターの共有イベント処理(ロック・表示/非表示・有効/無効・削除)
     *              Filter share event handling (lock, show/hide, enable/disable, delete)
     *
     * @param  {number} id
     * @return {void}
     * @method
     * @public
     */
    setCommonEvent (id)
    {
        this.setLockEvent(
            document.getElementById(`filter-${id}-lock`)
        );
        this.setTitleEvent(
            document.getElementById(`filter-name-${id}`)
        );
        this.setStateEvent(
            document.getElementById(`filter-state-${id}`)
        );
        this.setTrashEvent(
            document.getElementById(`trash-${id}`)
        );
    }

    /**
     * @description blurのロックイベントを登録
     *              Register blur lock event
     *
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    setLockEvent (element)
    {
        if (!element) {
            return ;
        }

        element.addEventListener("mousedown", (event) =>
        {
            this.lock(event);
        });
    }

    /**
     * @description フィルターのコントローラーブロックの表示・非表示イベント
     *              Show/Hide events for the controller block of the filter
     *
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    setTitleEvent (element)
    {
        if (!element) {
            return ;
        }

        element.addEventListener("mousedown", (event) =>
        {
            this.clickNodeTitle(event);
        });
    }

    /**
     * @description フィルターの有効・無効イベント
     *              Filter enable/disable events
     *
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    setStateEvent (element)
    {
        if (!element) {
            return ;
        }

        const filterId = element.dataset.filterId | 0;
        if (this._$filters.has(filterId)) {
            const object = this._$filters.get(filterId);
            element
                .setAttribute("class", object.filter.state
                    ? "filter-active"
                    : "filter-disable"
                );
        }

        element.addEventListener("mousedown", (event) =>
        {
            this.save();

            this.changeState(event);

            this.reloadScreen();

            this._$saved = false;
        });
    }

    /**
     * @description フィルターの削除イベント
     *              Delete Filter Event
     *
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    setTrashEvent (element)
    {
        if (!element) {
            return ;
        }

        element.addEventListener("click", (event) =>
        {
            this.removeFilter(event);
            this.reloadScreen();
        });
    }

    /**
     * @description フィルターの追加処理関数
     *              Additional processing functions for filters
     *
     * @return {void}
     * @method
     * @public
     */
    addFilter ()
    {
        const element = document
            .querySelectorAll(".filter-none")[0];

        if (element) {
            element.setAttribute("style", "display: none;");
        }

        const select = document.getElementById("filter-select");
        if (select) {
            this[`add${select.value}`]();
        }
    }

    /**
     * @description フィルター表示を初期化
     *              Initialize filter display
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        this._$filterId = 0;
        this._$filters.clear();

        const element = document
            .getElementById("filter-setting-list");

        if (!element) {
            return ;
        }

        // fixed logic
        // テキストのElementは消えてもいいようにここで変数に格納しておく
        const textElement = document
            .querySelectorAll(".filter-none")[0];

        while (element.firstChild) {
            element.firstChild.remove();
        }

        // 表示してDOMに追加
        textElement.setAttribute("style", "");
        element.appendChild(textElement);
    }

    /**
     * @description フィルターのオブジェクトを生成してマッピングに登録
     *              Generate filter objects and register them in the mapping
     *
     * @param  {function} filterClass
     * @param  {DropShadowFilter|BlurFilter|GlowFilter|BevelFilter|GradientGlowFilter|GradientBevelFilter} [filter=null]
     * @return {number}
     * @method
     * @public
     */
    createFilter (filterClass, filter = null)
    {
        if (!filter) {

            /**
             * @type {ArrowTool}
             */
            const tool = Util.$tools.getDefaultTool("arrow");
            const activeElements = tool.activeElements;
            if (!activeElements.length) {
                return -1;
            }

            filter = new filterClass();

            const target = activeElements[0];
            const scene  = Util.$currentWorkSpace().scene;
            const layer  = scene.getLayer(
                target.dataset.layerId | 0
            );

            const character = layer.getCharacter(
                target.dataset.characterId | 0
            );

            const frame = Util.$timelineFrame.currentFrame;

            let place = character.getPlace(frame);
            if (place.tweenFrame) {

                if (character.endFrame - 1 > frame && !character.hasTween(frame)) {

                    Util
                        .$timelineTool
                        .executeTimelineKeyAdd();

                    place = character.getPlace(frame);
                }

                place = character.getPlace(place.tweenFrame);

                // tweenの情報を更新
                character.updateTweenFilter(frame);
            }

            place.filter.push(filter);
        }

        const id = this._$filterId++;

        // 複数のフィルターを管理するので、Mapで状態管理を行う
        this._$filters.set(id, {
            "id": id,
            "lock": false,
            "filter": filter,
            "context": null
        });

        return id;
    }

    /**
     * @description DropShadowFilterの設定項目をコントローラーに追加
     *              Added DropShadowFilter configuration item to controller
     *
     * @param  {DropShadowFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addDropShadowFilter (filter = null, reload = true)
    {
        const element = document.getElementById("filter-setting-list");
        if (!element) {
            return ;
        }

        const id = this.createFilter(DropShadowFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = `
${FilterHTML.createHeaderHTML(id, "DropShadow")}

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
                ${FilterHTML.createColor(id, filter.color)}
                ${FilterHTML.createAlpha(id, filter.alpha)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createKnockout(id)}
            </div>

            <div class="filter-container">
                ${FilterHTML.createInnerShadow(id)}
            </div>
    
            <div class="filter-container">
                ${FilterHTML.createHideObject(id)}
            </div>

            <div class="filter-container">
                ${FilterHTML.createQuality(id)}
            </div> 
            
        </div>
    </div>
</div>
`;

        // added element
        element.insertAdjacentHTML("beforeend", htmlTag);

        // 共有イベント処理
        this.setCommonEvent(id);

        // 保存データの場合はcheckboxの値を更新
        if (filter.knockout) {
            document
                .getElementById(`knockout-${id}`)
                .checked = true;
        }
        if (filter.inner) {
            document
                .getElementById(`inner-${id}`)
                .checked = true;
        }
        if (filter.hideObject) {
            document
                .getElementById(`hideObject-${id}`)
                .checked = true;
        }

        const inputIds = [
            `blurX-${id}`,
            `blurY-${id}`,
            `strength-${id}`,
            `angle-${id}`,
            `alpha-${id}`,
            `distance-${id}`
        ];

        for (let idx = 0; idx < inputIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(inputIds[idx])
            );
        }

        const clickIds = [
            `knockout-${id}`,
            `inner-${id}`,
            `hideObject-${id}`
        ];

        for (let idx = 0; idx < clickIds.length; ++idx) {
            this.setClickEvent(
                document.getElementById(clickIds[idx])
            );
        }

        const changeIds = [
            `color-${id}`,
            `quality-${id}`
        ];

        for (let idx = 0; idx < changeIds.length; ++idx) {
            this.setChangeEvent(
                document.getElementById(changeIds[idx])
            );
        }

        // 内部キャッシュを削除
        if (reload) {
            this.disposeCharacterImage();
        }

        Util.$addModalEvent(
            document.getElementById(`filter-id-${id}`)
        );
    }

    /**
     * @description BlurFilterの設定項目をコントローラーに追加
     *              Added BlurFilter configuration item to controller
     *
     * @param  {BlurFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addBlurFilter (filter = null, reload = true)
    {
        const element = document.getElementById("filter-setting-list");
        if (!element) {
            return ;
        }

        const id = this.createFilter(BlurFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = `
${FilterHTML.createHeaderHTML(id, "Blur")}
        
        <div class="filter-view-area-right">
        
            <div class="filter-container">
                ${FilterHTML.createBlurX(id, filter.blurX)}
            </div>
        
            <div class="filter-container">
                ${FilterHTML.createBlurY(id, filter.blurY)}
            </div>
        
            <div class="filter-container">
                ${FilterHTML.createQuality(id)}
            </div> 
        
        </div>
    </div>
</div>
`;

        // added element
        element.insertAdjacentHTML("beforeend", htmlTag);

        // 共有イベント処理
        this.setCommonEvent(id);

        const inputIds = [
            `blurX-${id}`,
            `blurY-${id}`
        ];

        for (let idx = 0; idx < inputIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(inputIds[idx])
            );
        }

        const changeIds = [
            `quality-${id}`
        ];

        for (let idx = 0; idx < changeIds.length; ++idx) {
            this.setChangeEvent(
                document.getElementById(changeIds[idx])
            );
        }

        // 内部キャッシュを削除
        if (reload) {
            this.disposeCharacterImage();
        }

        Util.$addModalEvent(
            document.getElementById(`filter-id-${id}`)
        );
    }

    /**
     * @description GlowFilterの設定項目をコントローラーに追加
     *              Added GlowFilter configuration item to controller
     *
     * @param  {GlowFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addGlowFilter (filter = null, reload = true)
    {
        const element = document.getElementById("filter-setting-list");
        if (!element) {
            return ;
        }

        const id = this.createFilter(GlowFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = `
${FilterHTML.createHeaderHTML(id, "Glow")}

        <div class="filter-view-area-right">

            <div class="filter-container">
                ${FilterHTML.createBlurX(id, filter.blurX)}
                ${FilterHTML.createStrength(id, filter.strength)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createBlurY(id, filter.blurY)}
            </div>

            <div class="filter-container">
                ${FilterHTML.createColor(id, filter.color)}
                ${FilterHTML.createAlpha(id, filter.alpha)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createInnerShadow(id)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createKnockout(id)}
            </div>

            <div class="filter-container">
                ${FilterHTML.createQuality(id)}
            </div> 
            
        </div>
    </div>
</div>
`;

        // added element
        element.insertAdjacentHTML("beforeend", htmlTag);

        // 共有イベント処理
        this.setCommonEvent(id);

        // 保存データの場合はcheckboxの値を更新
        if (filter.knockout) {
            document
                .getElementById(`knockout-${id}`)
                .checked = true;
        }
        if (filter.inner) {
            document
                .getElementById(`inner-${id}`)
                .checked = true;
        }

        const inputIds = [
            `blurX-${id}`,
            `blurY-${id}`,
            `strength-${id}`,
            `alpha-${id}`,
            `distance-${id}`
        ];

        for (let idx = 0; idx < inputIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(inputIds[idx])
            );
        }

        const clickIds = [
            `knockout-${id}`,
            `inner-${id}`
        ];

        for (let idx = 0; idx < clickIds.length; ++idx) {
            this.setClickEvent(
                document.getElementById(clickIds[idx])
            );
        }

        const changeIds = [
            `color-${id}`,
            `quality-${id}`
        ];

        for (let idx = 0; idx < changeIds.length; ++idx) {
            this.setChangeEvent(
                document.getElementById(changeIds[idx])
            );
        }

        // 内部キャッシュを削除
        if (reload) {
            this.disposeCharacterImage();
        }

        Util.$addModalEvent(
            document.getElementById(`filter-id-${id}`)
        );
    }

    /**
     * @description BevelFilterの設定項目をコントローラーに追加
     *              Added BevelFilter configuration item to controller
     *
     * @param  {BevelFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addBevelFilter (filter = null, reload = true)
    {
        const element = document.getElementById("filter-setting-list");
        if (!element) {
            return ;
        }

        const id = this.createFilter(BevelFilter, filter);
        if (0 > id) {
            return ;
        }

        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = `
${FilterHTML.createHeaderHTML(id, "Bevel")}
        
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
                ${FilterHTML.createShadowColor(id, filter.shadowColor)}
                ${FilterHTML.createShadowAlpha(id, filter.shadowAlpha)}
            </div>
            
            <div class="filter-container">
                ${FilterHTML.createHighlightColor(id, filter.highlightColor)}
                ${FilterHTML.createHighlightAlpha(id, filter.highlightAlpha)}
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
            `shadowAlpha-${id}`,
            `highlightAlpha-${id}`,
            `distance-${id}`
        ];

        // 各inputのelementにイベントを登録
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
            `shadowColor-${id}`,
            `highlightColor-${id}`,
            `type-${id}`,
            `quality-${id}`
        ];

        for (let idx = 0; idx < changeIds.length; ++idx) {
            this.setChangeEvent(
                document.getElementById(changeIds[idx])
            );
        }

        // 内部キャッシュを削除
        if (reload) {
            this.disposeCharacterImage();
        }

        Util.$addModalEvent(
            document.getElementById(`filter-id-${id}`)
        );
    }
}

Util.$filterController = new FilterController();
