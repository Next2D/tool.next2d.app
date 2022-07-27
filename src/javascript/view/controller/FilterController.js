/**
 * @class
 * @extends {GradientFilterController}
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
     * @return {number}
     * @const
     * @static
     */
    static get MIN_BLUR ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_BLUR ()
    {
        return 255;
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
    static get MIN_STRENGTH ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_STRENGTH ()
    {
        return 255;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_ROTATE ()
    {
        return -360;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_ROTATE ()
    {
        return 360;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_DISTANCE ()
    {
        return -255;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_DISTANCE ()
    {
        return 255;
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
        return 0xffffff;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_QUALITY ()
    {
        return 0;
    }

    /**
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
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    lock (event)
    {
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
     * @description フィルターの表示・非表示の処理
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

        if (element.style.display === "none") {

            element.style.display = "";
            document
                .getElementById(`filter-title-arrow-${filterId}`)
                .setAttribute("class", "arrow active");

        } else {

            element.style.display = "none";
            document
                .getElementById(`filter-title-arrow-${filterId}`)
                .setAttribute("class", "arrow disable");

        }
    }

    /**
     * @description フィルターの有効・無効の処理
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

        document
            .getElementById(`filter-state-${filterId}`)
            .setAttribute("class", object.filter.state
                ? "filter-active"
                : "filter-disable"
            );

        this.disposeCharacterImage();
    }

    /**
     * @description フィルターの削除の処理
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

        const target  = activeElements[0];

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

        document
            .getElementById(`filter-id-${filterId}`)
            .remove();

        super.focusOut();

        // 再描画用にキャッシュを削除
        character._$image = null;
    }

    /**
     * @description InputElementにフォーカスした際の処理関数
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
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    setLockElement (event)
    {
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
                this._$lockTarget = document
                    .getElementById(`blurY-${filterId}`);
                break;

            case "blurY":
                this._$lockTarget = document
                    .getElementById(`blurX-${filterId}`);
                break;

            default:
                break;

        }
    }

    /**
     * @description blueXの変更値を更新
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
     * @description blueYの変更値を更新
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
     * @description strengthの変更値を更新
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
     * @description filterの透明度を更新
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
     * @description filterのシャドーの透明度を更新
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
     * @description filterのハイライトの透明度を更新
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
     * @description filterの回転の値を更新
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
     * @description filterのdistanceの値を更新
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
     * @description filterの指定カラーの値を更新
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
     * @description filterの指定シャドーカラーの値を更新
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
     * @description filterの指定ハイライトカラーの値を更新
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
     * @description filterの指定カラーの値を更新
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
     * @description filterのタイプの値を更新
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
     * @description Knockoutの変更値を更新
     *
     * @return {void}
     * @method
     * @public
     */
    changeKnockout ()
    {
        this.updateProperty("knockout", this._$currentTarget.checked);
    }

    /**
     * @description innerの変更値を更新
     *
     * @return {void}
     * @method
     * @public
     */
    changeInner ()
    {
        this.updateProperty("inner", this._$currentTarget.checked);
    }

    /**
     * @description hideObjectの変更値を更新
     *
     * @return {void}
     * @method
     * @public
     */
    changeHideObject ()
    {
        this.updateProperty("hideObject", this._$currentTarget.checked);
    }

    /**
     * @description filterのプロパティーを更新
     *
     * @param  {string} name
     * @param  {*} value
     * @return {void}
     * @method
     * @public
     */
    updateProperty (name, value)
    {
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
        character._$image = null;
    }

    /**
     * @description フィルターの共有イベント処理
     *              (ロック・表示/非表示・有効/無効・削除)
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
     * @description フィルターの表示・非表示イベント
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
     *
     * @return {void}
     * @method
     * @public
     */
    addFilter ()
    {
        document
            .querySelectorAll(".filter-none")[0]
            .style.display = "none";

        const select = document.getElementById("filter-select");
        this[`add${select.value}`](
            document.getElementById("filter-setting-list")
        );
    }

    /**
     * @description フィルター表示を初期化
     *
     * @return {void}
     * @methodq
     * @public
     */
    clearFilters ()
    {
        this._$filterId = 0;
        this._$filters.clear();

        const element = document
            .getElementById("filter-setting-list");

        // テキストのElementは消えてもいいようにここで変数に格納しておく
        const textElement = document
            .querySelectorAll(".filter-none")[0];

        while (element.children.length) {
            element.children[0].remove();
        }

        // 表示してDOMに追加
        textElement.style.display = "";
        element.appendChild(textElement);
    }

    /**
     * @param  {function} filterClass
     * @param  {DropShadowFilter|BlurFilter|GlowFilter|BevelFilter|GradientGlowFilter|GradientBevelFilter} [filter=null]
     * @return {number}
     */
    createFilter (filterClass, filter = null)
    {
        const id = this._$filterId++;

        if (!filter) {

            filter = new filterClass();

            /**
             * @type {ArrowTool}
             */
            const tool = Util.$tools.getDefaultTool("arrow");
            const activeElements = tool.activeElements;
            if (!activeElements.length) {
                return ;
            }

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
            }

            place.filter.push(filter);

            // tweenの情報を更新
            character.updateTweenFilter(frame);
        }

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
     * @description フィルター表示で共有化しているマークアップを返す
     *
     * @param  {number} id
     * @param  {string} name
     * @return {string}
     * @method
     * @public
     */
    getFilterHeaderHTML (id, name)
    {
        return `
<div id="filter-id-${id}" class="filter-border">

    <div class="filter-title">
        <i id="filter-title-arrow-${id}" class="arrow active"></i>
        <span id="filter-name-${id}" data-filter-id="${id}">${name}</span>
        <i class="filter-active" id="filter-state-${id}" data-filter-id="${id}" data-detail="{{フィルターを表示・非表示する}}"></i>
        <i class="trash" id="trash-${id}" data-filter-id="${id}" data-detail="{{フィルターを削除}}"></i>
    </div>
    
    <div id="filter-view-area-${id}" class="filter-view-area">
    
        <div class="filter-view-area-left">
        
            <div id="filter-${id}-lock" data-filter-id="${id}" class="filter-lock">
                ┌
                <div class="disable" data-detail="{{比率を固定}}"></div>
                └
            </div>
        
        </div>
`;
    }

    /**
     * @description DropShadowFilterを追加
     *
     * @param  {HTMLDivElement} element
     * @param  {DropShadowFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addDropShadowFilter (element, filter = null, reload = true)
    {

        const id = this.createFilter(DropShadowFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = this.getFilterHeaderHTML(id, "DropShadow") + `

        <div class="filter-view-area-right">
        
            <div class="filter-container">
                <div class="filter-text">BlurX</div>
                <div><input type="text" id="blurX-${id}" value="${filter.blurX}" data-name="blurX" data-filter-id="${id}" data-detail="{{水平方向にぼかす}}"></div>
                
                <div class="filter-text">Strength</div>
                <div><input type="text" id="strength-${id}" value="${filter.strength}" data-filter-id="${id}" data-name="strength" data-detail="{{フィルター強度}}"></div>
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
                <div class="filter-text">Shadow</div>
                <div><input type="color" id="color-${id}" value="#${filter.color.toString(16).padStart(6, "0")}" data-filter-id="${id}" data-name="color" data-detail="{{シャドウのカラー}}"></div>
                
                <div class="filter-text">Alpha</div>
                <div><input type="text" id="alpha-${id}" value="${filter.alpha}" data-filter-id="${id}" data-name="alpha" data-detail="{{シャドウのアルファ}}"></div>
            </div>
            
            <div class="filter-container">
                <div><input type="checkbox" id="knockout-${id}" data-name="knockout" data-filter-id="${id}"></div>
                <div class="filter-text-long">
                    <label for="knockout-${id}">Knockout</label>
                </div>
            </div>

            <div class="filter-container">
                <div><input type="checkbox" id="inner-${id}" data-name="inner" data-filter-id="${id}"></div>
                <div class="filter-text-long">
                    <label for="inner-${id}">Inner Shadow</label>
                </div>
            </div>
    
            <div class="filter-container">
                <div><input type="checkbox" id="hideObject-${id}" data-name="hideObject" data-filter-id="${id}"></div>
                <div class="filter-text-long">
                    <label for="hideObject-${id}">Hide Object</label>
                </div>
            </div>

            <div class="filter-container">
                <div class="filter-text-long">Quality</div>
                <div>
                    <select id="quality-${id}" data-name="quality" data-filter-id="${id}">
                        <option value="1">Low</option>
                        <option value="2">Middle</option>
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
     * @param  {HTMLDivElement} element
     * @param  {BlurFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addBlurFilter (element, filter = null, reload = true)
    {

        const id = this.createFilter(BlurFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = this.getFilterHeaderHTML(id, "Blur") + `
    
        <div class="filter-view-area-right">
        
            <div class="filter-container">
                <div class="filter-text">BlurX</div>
                <div><input type="text" id="blurX-${id}" value="${filter.blurX}" data-name="blurX" data-filter-id="${id}" data-detail="{{水平方向にぼかす}}"></div>
            </div>
        
            <div class="filter-container">
                <div class="filter-text">BlurY</div>
                <div><input type="text" id="blurY-${id}" value="${filter.blurY}" data-name="blurY" data-filter-id="${id}" data-detail="{{垂直方向にぼかす}}"></div>
            </div>
        
            <div class="filter-container">
                <div class="filter-text-long">Quality</div>
                <div>
                    <select id="quality-${id}" data-name="quality" data-filter-id="${id}">
                        <option value="1">Low</option>
                        <option value="2">Middle</option>
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
     * @param  {HTMLDivElement} element
     * @param  {GlowFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addGlowFilter (element, filter = null, reload = true)
    {

        const id = this.createFilter(GlowFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = this.getFilterHeaderHTML(id, "Glow") + `

        <div class="filter-view-area-right">

            <div class="filter-container">
                <div class="filter-text">BlurX</div>
                <div><input type="text" id="blurX-${id}" value="${filter.blurX}" data-name="blurX" data-filter-id="${id}" data-detail="{{水平方向にぼかす}}"></div>
                
                <div class="filter-text">Strength</div>
                <div><input type="text" id="strength-${id}" value="${filter.strength}" data-filter-id="${id}" data-name="strength" data-detail="{{フィルター強度}}"></div>
            </div>
            
            <div class="filter-container">
                <div class="filter-text">BlurY</div>
                <div><input type="text" id="blurY-${id}" value="${filter.blurY}" data-name="blurY" data-filter-id="${id}" data-detail="{{垂直方向にぼかす}}"></div>
            </div>

            <div class="filter-container">
                <div class="filter-text">Color</div>
                <div><input type="color" id="color-${id}" value="#${filter.color.toString(16).padStart(6, "0")}" data-filter-id="${id}" data-name="color" data-detail="{{シャドウのカラー}}"></div>
                
                <div class="filter-text">Alpha</div>
                <div><input type="text" id="alpha-${id}" value="${filter.alpha}" data-filter-id="${id}" data-name="alpha" data-detail="{{シャドウのアルファ}}"></div>
            </div>
            
            <div class="filter-container">
                <div><input type="checkbox" id="inner-${id}" data-name="inner" data-filter-id="${id}"></div>
                <div class="filter-text-long">
                    <label for="inner-${id}">Inner Glow</label>
                </div>
            </div>
            
            <div class="filter-container">
                <div><input type="checkbox" id="knockout-${id}" data-name="knockout" data-filter-id="${id}"></div>
                <div class="filter-text-long">
                    <label for="knockout-${id}">Knockout</label>
                </div>
            </div>

            <div class="filter-container">
                <div class="filter-text-long">Quality</div>
                <div>
                    <select id="quality-${id}" data-name="quality" data-filter-id="${id}">
                        <option value="1">Low</option>
                        <option value="2">Middle</option>
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
     * @param  {HTMLDivElement} element
     * @param  {BevelFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addBevelFilter (element, filter = null, reload = true)
    {

        const id = this.createFilter(BevelFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = this.getFilterHeaderHTML(id, "Bevel") + `

        <div class="filter-view-area-right">

            <div class="filter-container">
                <div class="filter-text">BlurX</div>
                <div><input type="text" id="blurX-${id}" value="${filter.blurX}" data-name="blurX" data-filter-id="${id}" data-detail="{{水平方向にぼかす}}"></div>
                 
                <div class="filter-text">Strength</div>
                <div><input type="text" id="strength-${id}" value="${filter.strength}" data-filter-id="${id}" data-name="strength" data-detail="{{フィルター強度}}"></div>
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
                <div class="filter-text">Shadow<br>Color</div>
                <div><input type="color" id="shadowColor-${id}" value="#${filter.shadowColor.toString(16).padStart(6, "0")}" data-filter-id="${id}" data-name="shadowColor" data-detail="{{シャドウのカラー}}"></div>
                
                <div class="filter-text">Shadow<br>Alpha</div>
                <div><input type="text" id="shadowAlpha-${id}" value="${filter.shadowAlpha}" data-filter-id="${id}" data-name="shadowAlpha" data-detail="{{シャドウのアルファ}}"></div>
            </div>
            
            <div class="filter-container">
                <div class="filter-text">Highlight<br>Color</div>
                <div><input type="color" id="highlightColor-${id}" value="#${filter.highlightColor.toString(16).padStart(6, "0")}" data-filter-id="${id}" data-name="highlightColor" data-detail="{{ハイライトのカラー}}"></div>
                
                <div class="filter-text">Highlight<br>Alpha</div>
                <div><input type="text" id="highlightAlpha-${id}" value="${filter.highlightAlpha}" data-filter-id="${id}" data-name="highlightAlpha" data-detail="{{ハイライトのアルファ}}"></div>
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
                        <option value="2">Middle</option>
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

    /**
     * @param  {HTMLDivElement} element
     * @param  {GradientGlowFilter} [filter=null]
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    addGradientGlowFilter (element, filter = null, reload = true)
    {

        const id = this.createFilter(GradientGlowFilter, filter);
        if (!filter) {
            filter = this._$filters.get(id).filter;
        }

        const htmlTag = this.getFilterHeaderHTML(id, "GradientGlow") + `

        <div class="filter-view-area-right">

            <div class="filter-container">
                <div class="filter-text">BlurX</div>
                <div><input type="text" id="blurX-${id}" value="${filter.blurX}" data-name="blurX" data-filter-id="${id}" data-detail="{{水平方向にぼかす}}"></div>
                          
                <div class="filter-text">Strength</div>
                <div><input type="text" id="strength-${id}" value="${filter.strength}" data-filter-id="${id}" data-name="strength" data-detail="{{フィルター強度}}"></div>
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
                <div><input type="text" id="gradientAlpha-${id}" value="100" data-detail="{{グラデーションのアルファ}}"></div>
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
                        <option value="2">Middle</option>
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

        // グラデーションコントロール用のcanvas
        const canvas  = document.getElementById(`gradient-canvas-${id}`);
        canvas.width  = FilterController.GRADIENT_CANVAS_WIDTH  * window.devicePixelRatio;
        canvas.height = FilterController.GRADIENT_CANVAS_HEIGHT * window.devicePixelRatio;

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
}

Util.$filterController = new FilterController();
