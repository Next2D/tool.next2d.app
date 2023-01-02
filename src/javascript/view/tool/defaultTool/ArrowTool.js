/**
 * @class
 * @extends {BaseTool}
 * @memberOf view.tool.default
 */
class ArrowTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("arrow");

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$saved = false;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$activeElement = "";

        /**
         * @type {array}
         * @default {array}
         * @private
         */
        this._$activeElements = [];

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$xReverse = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$yReverse = false;
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
        this.addEventListener(EventType.MOUSE_OVER, (event) =>
        {
            const target  = event.currentTarget;
            const layerId = target.dataset.layerId | 0;

            const lockElement = document
                .getElementById(`layer-lock-icon-${layerId}`);

            if (!lockElement
                || lockElement.classList.contains("icon-active")
            ) {
                return ;
            }

            Util.$setCursor("move");
        });

        this.addEventListener(EventType.MOUSE_OUT, () =>
        {
            Util.$setCursor("auto");
        });

        // コントローラーのプルダウンでライブラリの入れ替えを行った際のイベント
        this.addEventListener(EventType.CHANGE, (event) =>
        {
            this.changeCharacter(event);
        });

        // カーソルがスクリーンエリアから外れた時は非アクティブに
        this.addEventListener(EventType.MOUSE_LEAVE, () =>
        {
            this.active = false;
        });

        // 各種シーンによってのマウスダウンイベント
        this.addEventListener(EventType.MOUSE_DOWN, (event) =>
        {
            this.active = false;
            switch (true) {

                case event.displayObject:
                    this.active = true;
                    this._$activeElement = ArrowTool.DISPLAY_OBJECT;
                    Util.$endMenu();
                    this.activateElement(event);
                    break;

                case event.screen:
                    this.active = true;
                    this._$activeElement = ArrowTool.SCREEN;
                    Util.$endMenu();
                    this.clear();
                    this.startRect(event);
                    break;

                case event.transform:
                    this.active = true;
                    this._$activeElement = ArrowTool.TRANSFORM;
                    Util.$endMenu();
                    this.startPosition(event);
                    this.setReverse();
                    break;

                case event.grid:
                    this.active = true;
                    this._$activeElement = ArrowTool.GRID;
                    Util.$endMenu();
                    this.startPosition(event);
                    break;

                default:
                    this._$activeElement = "";
                    break;

            }
        });

        // アクティブなエレメントに合わせたマウスムーブイベント
        this.addEventListener(EventType.MOUSE_MOVE, (event) =>
        {
            if (!this.active) {
                return ;
            }

            // 親のイベントを中止する
            event.stopPropagation();
            event.preventDefault();

            switch (this._$activeElement) {

                case ArrowTool.DISPLAY_OBJECT:
                    this.moveDisplayObject(event);
                    break;

                case ArrowTool.SCREEN:
                    this.moveRect(event);
                    break;

                case ArrowTool.TRANSFORM:
                    this.moveTransform(event);
                    break;

                case ArrowTool.GRID:
                    this.moveGrid(event);
                    break;

                default:
                    break;

            }

        });

        this.addEventListener(EventType.MOUSE_UP, (event) =>
        {
            if (!this._$activeElement) {
                return ;
            }

            switch (this._$activeElement) {

                case ArrowTool.SCREEN:
                    // 親のイベントを中止する
                    event.stopPropagation();
                    this.endRect();
                    break;

                case ArrowTool.DISPLAY_OBJECT:
                case ArrowTool.TRANSFORM:
                case ArrowTool.GRID:
                    break;

                default:
                    break;

            }

            // アクティブ判定を初期化
            this._$activeElement = "";

            // 連続セーブ防止フラグを初期化
            this._$saved = false;
        });

        // 開始イベント
        this.addEventListener(EventType.START, () =>
        {
            Util.$setCursor(this._$cursor);
            this.changeNodeEvent();

            // 選択中のDisplayObjectがあればアクティブ化
            Util.$timelineLayer.activeCharacter();

            const element = document.getElementById("target-rect");
            if (element) {
                element.setAttribute("class", "arrow");
            }
        });

        // ツール終了時に初期化
        this.addEventListener(EventType.END, () =>
        {
            // 配列を初期化
            this.clearActiveElement();

            // スクリーンエリアの変形Elementを非表示に
            Util.$transformController.hide();
            Util.$gridController.hide();
            Util.$tweenController.clearPointer();

            // コントローラーエリアを初期化
            Util.$controller.default();
        });

        // シーン移動
        this.addEventListener(EventType.DBL_CLICK, (event) =>
        {
            if (event.screen && !this._$activeElements.length) {
                this.moveScene();
            }
        });

        // アクティブツールとして登録
        this.dispatchEvent(EventType.START);
        Util.$tools.activeTool = this;
    }

    /**
     * @description スクリーンで選択したElementの配列
     *
     * @return {array}
     * @readonly
     * @public
     */
    get activeElements ()
    {
        return this._$activeElements;
    }

    /**
     * @return {string}
     * @const
     * @static
     */
    static get SCREEN ()
    {
        return "screen";
    }

    /**
     * @return {string}
     * @const
     * @static
     */
    static get TRANSFORM ()
    {
        return "transform";
    }

    /**
     * @return {string}
     * @const
     * @static
     */
    static get DISPLAY_OBJECT ()
    {
        return "displayObject";
    }

    /**
     * @return {string}
     * @const
     * @static
     */
    static get GRID ()
    {
        return "grid";
    }

    /**
     * @description スクリーン、タイムライン、コントローラー全ての値を初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        // 配列を初期化
        this.clearActiveElement();

        // Shapeのポインターを初期化
        Util.$clearShapePointer();

        // スクリーンエリアの変形Elementを非表示に
        Util.$transformController.hide();
        Util.$gridController.hide();
        Util.$tweenController.clearPointer();

        // コントローラーエリアを初期化
        Util.$controller.default();

        // タイムラインエリアを初期化
        Util.$timelineLayer.clear();

        // 中心点を初期化
        Util.$referenceController.resetPointer();
    }

    /**
     * @description プロパティーの更新がある時はundo用にデータを内部保管する
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        if (!this._$saved) {
            this._$saved = true;

            Util
                .$currentWorkSpace()
                .temporarilySaved();
        }
    }

    /**
     * @description 選択中のDisplayObjectを非アクティブ化
     *
     * @return {void}
     * @method
     * @public
     */
    clearActiveElement ()
    {
        this._$activeElements.length = 0;
    }

    /**
     * @description 選択してるDisplayObjectをスクリーンから削除
     *
     * @return {void}
     * @method
     * @public
     */
    deleteDisplayObject ()
    {
        // 選択してるDisplayObjectがなければ終了
        const activeElements = this.activeElements;
        if (!activeElements.length) {
            return ;
        }

        this.save();

        const frame  = Util.$timelineFrame.currentFrame;
        const layers = new Map();
        const scene  = Util.$currentWorkSpace().scene;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            if (!layer) {
                continue;
            }

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            if (!character) {
                continue;
            }

            if (!layers.has(layer.id)) {
                layers.set(layer.id, {
                    "layer": layer,
                    "range": character.getRange(frame)
                });
            }

            character.remove(layer);
        }

        // 選択していたDisplayObjectをリセット
        this.clearActiveElement();

        // タイムラインを再構成
        for (const object of layers.values()) {

            const layer = object.layer;
            const range = object.range;

            const characters = layer.getActiveCharacter(range.startFrame);
            if (characters.length) {

                // 深度順に並び替え
                layer.sort(characters, frame);

                for (let idx = 0; idx < characters.length; ++idx) {
                    characters[idx].getPlace(frame).depth = idx;
                }

            } else {

                layer.addEmptyCharacter(
                    new EmptyCharacter({
                        "startFrame": range.startFrame,
                        "endFrame": range.endFrame
                    })
                );

            }

            layer.reloadStyle();
        }

        // 再描画
        this.reloadScreen();

        // 初期化
        this._$saved = false;
    }

    /**
     * @description 選択したDisplayObjectを配列に格納
     *              もし配列内に指定済みのDisplayObjectがあれば何もしない
     *
     * @param  {HTMLDivElement} element
     * @param  {boolean} [hit=false]
     * @return {boolean}
     * @method
     * @public
     */
    addElement (element, hit = false)
    {
        for (let idx = 0; idx < this._$activeElements.length; ++idx) {

            const target = this._$activeElements[idx];
            if (target.dataset.characterId === element.dataset.characterId) {

                if (Util.$shiftKey) {

                    Util
                        .$tweenController
                        .clearPointer();

                    // 服選択時は二度目の押下は対象外にする
                    this._$activeElements.splice(idx, 1);

                    // 複数選択ポインターを初期化
                    Util.$referenceController.pointer = null;

                } else {

                    this._$activeElements.splice(idx, 1, element);

                }

                return false;
            }
        }

        // 複数選択でなければ配列は初期化する
        if (!hit && !Util.$shiftKey) {
            // 配列を初期化
            this.clearActiveElement();
        } else {
            // 複数選択ポインターを初期化
            Util.$referenceController.pointer = null;
        }

        this._$activeElements.push(element);

        // tweenの設定があればポインターを配置
        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(
            element.dataset.layerId | 0
        );

        const character = layer.getCharacter(
            element.dataset.characterId | 0
        );

        const range = character.getRange(
            Util.$timelineFrame.currentFrame
        );

        if (character.hasTween(range.startFrame)) {
            Util
                .$tweenController
                .clearPointer()
                .relocationPointer();
        }

        return true;
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    activateElement (event)
    {
        let target = this.target;

        const layerId = target.dataset.layerId | 0;

        const workSpace = Util.$currentWorkSpace();

        const scene = workSpace.scene;
        const layer = scene.getLayer(layerId);

        // タイムラインでロック中のDisplayObjectは何もしない
        if (layer.lock) {
            return ;
        }

        // 現在の座標をセット
        this.pageX = event.pageX;
        this.pageY = event.pageY;

        // タイムラインのアクティブなElementを初期化
        Util.$timelineLayer.clear();

        const character = layer.getCharacter(
            target.dataset.characterId | 0
        );

        // 現在のフレーム
        const frame = Util.$timelineFrame.currentFrame;

        // 指定のDisplayObjectをクローンしてスクリーンに配置
        const place = character.getPlace(frame);
        if (Util.$altKey && !place.tweenFrame) {

            const clone = character.clone();

            // クローンしたDisplayObjectを最前面にセット
            for (const [keyFrame, place] of clone._$places) {

                let depth = 0;
                const characters = layer.getActiveCharacter(keyFrame);
                for (let idx = 0; idx < characters.length; ++idx) {
                    depth = Math.max(characters[idx].getPlace(keyFrame).depth, depth);
                }

                place.depth = depth + 1;
            }

            // レイヤーにセット
            layer.addCharacter(clone);

            // スクリーンに配置
            Util
                .$screen
                .appendCharacter(clone, frame, layer.id);

            target = document
                .getElementById(`character-${clone.id}`);

        }

        // アクティブ登録
        this.addElement(target);

        // コントローラーエリアの情報を更新
        this.updateControllerProperty();

        // Shapeは描画反映の判定で毎回ヒット判定を行う
        if (this._$activeElements.length === 1) {
            character.showShapeColor(event);
        }

        // 拡大縮小回転のElementのポイントを表示して再計算
        Util
            .$transformController
            .show()
            .relocation();

        // 9sliceのElementのポイントを表示して再計算
        Util
            .$gridController
            .show()
            .relocation();

        // 選択されたDisplayObjectが配置されてるタイムラインをアクティブに
        this.activeTimeline();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    activeTimeline ()
    {
        // 初期化
        Util.$timelineLayer.clear();

        const frame = Util.$timelineFrame.currentFrame;

        // 複数選択可能にするため、擬似的にctrlキーをOnにする
        const cacheValue = Util.$ctrlKey;
        Util.$ctrlKey = this._$activeElements.length > 1;

        const scene = Util.$currentWorkSpace().scene;
        for (let idx = 0; idx < this._$activeElements.length; ++idx) {

            const element = this._$activeElements[idx];

            const layerId = element.dataset.layerId | 0;

            const layerElement = document
                .getElementById(`layer-id-${layerId}`);

            if (!Util.$timelineLayer.targetLayers.has(layerElement.id)) {
                Util.$timelineLayer.targetLayer = layerElement;
            }

            const layer = scene.getLayer(layerId);

            Util
                .$timelineLayer
                .addTargetFrame(layer, frame);
        }
        Util.$ctrlKey = cacheValue;
    }

    /**
     * @description コントローラーのプルダウン変更時のイベント関数
     *              指定されたライブラリ内のオブジェクトと切り替える
     *
     * @return {void}
     * @method
     * @public
     */
    changeCharacter (event)
    {
        if (this._$activeElements.length !== 1) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;

        const target = this._$activeElements[0];

        const layerId = target.dataset.layerId | 0;
        const layer   = scene.getLayer(layerId);

        const characterId = target.dataset.characterId | 0;
        const character   = layer.getCharacter(characterId);
        character.dispose();

        // update
        const range = character.getRange(Util.$timelineFrame.currentFrame);
        const splitCharacter = character.split(
            layer, range.startFrame, range.endFrame
        );
        layer.addCharacter(splitCharacter);

        splitCharacter._$libraryId = event.target.value | 0;
        splitCharacter.dispose();

        const instance = workSpace
            .getLibrary(splitCharacter._$libraryId);

        if (instance.type === InstanceType.MOVIE_CLIP) {
            for (const place of splitCharacter._$places.values()) {
                place.loop = Util.$getDefaultLoopConfig();
            }
        }

        const icon = document
            .getElementById("instance-type-name")
            .getElementsByTagName("i")[0];

        icon.setAttribute("class", `library-type-${instance.type}`);

        // 選択中のDisplayObjectをアクティブ化
        Util.$timelineLayer.activeCharacter();

        // tweenの場合は座標を再計算
        if (splitCharacter.hasTween(range.startFrame)) {
            Util
                .$tweenController
                .clearPointer()
                .relocationPointer();
        }

        // スクリーンエリアのDisplayObjectを再描画
        this.reloadScreen();

        // アクティブなDisplayObjectの変形Elementを再計算
        Util
            .$transformController
            .show()
            .relocation();
    }

    /**
     * @description スクリーン上でマウスで選択した範囲のDisplayObjectを選択する起動関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    startRect (event)
    {
        this.pageX = event.pageX;
        this.pageY = event.pageY;

        const element = document.getElementById("stage-rect");
        element.style.left    = `${event.pageX}px`;
        element.style.top     = `${event.pageY}px`;
        element.style.width   = "0px";
        element.style.height  = "0px";
        element.style.display = "";
    }

    /**
     * @description スクリーン上でマウスで選択する範囲調整関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveRect (event)
    {
        const x = event.pageX;
        const y = event.pageY;

        const element = document.getElementById("stage-rect");

        if (this.pageX > x) {
            element.style.left = `${x}px`;
        }

        if (this.pageY > y) {
            element.style.top = `${y}px`;
        }

        element.style.width  = `${Math.abs(x - this.pageX)}px`;
        element.style.height = `${Math.abs(y - this.pageY)}px`;
    }

    /**
     * @description スクリーン上でマウスで選択する範囲の最終位置
     *
     * @return {void}
     * @method
     * @public
     */
    endRect ()
    {
        const element = document.getElementById("stage-rect");
        element.style.display = "none";

        const width   = parseFloat(element.style.width);
        const height  = parseFloat(element.style.height);
        if (!width || !height) {
            return ;
        }

        const left    = parseFloat(element.style.left);
        const top     = parseFloat(element.style.top);
        const right   = left + width;
        const bottom  = top  + height;

        const children = document
            .getElementById("stage-area")
            .children;

        for (let idx = 0; idx < children.length; ++idx) {

            const node = children[idx];
            switch (true) {

                case !node.dataset.child:
                case node.dataset.child === "tween":
                case node.dataset.preview === "true":
                case node.classList.contains("standard-point"):
                    continue;

                default:
                    break;

            }

            const rect = node.getBoundingClientRect();
            switch (true) {

                case rect.bottom < top:
                case rect.top    > bottom:
                case rect.right  < left:
                case rect.left   > right:
                    continue;

                default:
                    break;

            }

            const layerId = node.dataset.layerId | 0;

            const lockElement = document
                .getElementById(`layer-lock-icon-${layerId}`);

            if (lockElement.classList.contains("icon-active")) {
                continue;
            }

            this.addElement(node, true);
        }

        if (this._$activeElements.length) {
            this.updateControllerProperty();

            Util
                .$transformController
                .show()
                .relocation();

            this.activeTimeline();
        }
    }

    /**
     * @description スケールのマイナス補正をセット
     *
     * @return {void}
     * @method
     * @public
     */
    setReverse ()
    {
        const scaleX = +document
            .getElementById("transform-scale-x")
            .value;

        const scaleY = document
            .getElementById("transform-scale-y")
            .value;

        this._$xReverse = 0 > scaleX;
        this._$yReverse = 0 > scaleY;
    }

    /**
     * @description マウスダウンした時の座標を保存
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    startPosition (event)
    {
        this.pageX = event.pageX;
        this.pageY = event.pageY;
    }

    /**
     * @description スクリーンエリアでの拡大縮小回転の分岐処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveGrid (event)
    {
        Util.$setCursor("move");

        event.preventDefault();

        const dx = (event.pageX - this.pageX) / Util.$zoomScale;
        const dy = (event.pageY - this.pageY) / Util.$zoomScale;

        let x = +document
            .getElementById("nine-slice-setting-x")
            .value;

        let y = +document
            .getElementById("nine-slice-setting-y")
            .value;

        let w = +document
            .getElementById("nine-slice-setting-w")
            .value;

        let h = +document
            .getElementById("nine-slice-setting-h")
            .value;

        switch (this.target.id) {

            case "grid-top-left":
                x += dx;
                w -= dx;
                y += dy;
                h -= dy;
                break;

            case "grid-top-right":
                w += dx;
                y += dy;
                break;

            case "grid-bottom-left":
                x += dx;
                w -= dx;
                h += dy;
                break;

            case "grid-bottom-right":
                w += dx;
                h += dy;
                break;

        }

        document
            .getElementById("nine-slice-setting-x")
            .value = `${x}`;

        document
            .getElementById("nine-slice-setting-y")
            .value = `${y}`;

        document
            .getElementById("nine-slice-setting-w")
            .value = `${w}`;

        document
            .getElementById("nine-slice-setting-h")
            .value = `${h}`;

        this.startPosition(event);

        Util
            .$gridController
            .updateShapeGrid(x, y, w, h);

        this.reloadScreen();
    }

    /**
     * @description スクリーンエリアでの拡大縮小回転の分岐処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveTransform (event)
    {
        Util.$setCursor("move");

        event.preventDefault();

        this.save();

        let reload = false;
        switch (this.target.id) {

            case "scale-top-left": // 左上
                {
                    const resultX = this.updateLeftScaleX(event);
                    const resultY = this.updateTopScaleY(event);
                    if (resultX || resultY) {
                        reload = true;
                        if (Util.$shiftKey) {
                            this.adjustmentScale(resultX, resultY);
                        }
                    }
                }
                break;

            case "scale-center-left": // 左中央
                if (this.updateLeftScaleX(event)) {
                    reload = true;
                }
                break;

            case "scale-bottom-left": // 左下
                {
                    const resultX = this.updateLeftScaleX(event);
                    const resultY = this.updateBottomScaleY(event);
                    if (resultX || resultY) {
                        reload = true;
                        if (Util.$shiftKey) {
                            this.adjustmentScale(resultX, resultY);
                        }
                    }
                }
                break;

            case "scale-center-bottom": // 中央下
                if (this.updateBottomScaleY(event)) {
                    reload = true;
                }
                break;

            case "scale-bottom-right": // 右下
                {
                    const resultX = this.updateRightScaleX(event);
                    const resultY = this.updateBottomScaleY(event);
                    if (resultX || resultY) {
                        reload = true;
                        if (Util.$shiftKey) {
                            this.adjustmentScale(resultX, resultY);
                        }
                    }
                }
                break;

            case "scale-center-right": // 中央右
                if (this.updateRightScaleX(event)) {
                    reload = true;
                }
                break;

            case "scale-top-right": // 右上
                {
                    const resultX = this.updateRightScaleX(event);
                    const resultY = this.updateTopScaleY(event);
                    if (resultX || resultY) {
                        reload = true;
                        if (Util.$shiftKey) {
                            this.adjustmentScale(resultX, resultY);
                        }
                    }
                }
                break;

            case "scale-center-top": // 中央上
                if (this.updateTopScaleY(event)) {
                    reload = true;
                }
                break;

            case "target-rotation": // 回転
                if (this.updateRotate(event)) {
                    reload = true;
                }
                break;

            case "reference-point": // 中心点
                this.updateReferencePoint(event);
                break;

            default:
                return ;

        }

        this.startPosition(event);
        if (reload) {
            this.reloadScreen();
        }

    }

    /**
     * @description マウスでの拡大縮小回転の時にShiftを押下してる時はロック時と同じく対比を固定
     *
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    adjustmentScale (x = 0, y = 0)
    {
        if (x !== y) {

            if (x) {

                const yScale = +document
                    .getElementById("transform-scale-y")
                    .value;

                Util
                    .$transformController
                    .updateScaleY((yScale + x) / 100);

            }

            if (y) {

                const xScale = +document
                    .getElementById("transform-scale-x")
                    .value;

                Util
                    .$transformController
                    .updateScaleX((xScale + y) / 100);

            }

        }
    }

    /**
     * @description マウスでの拡大縮小時の上部のx座標計算
     *              マウスが下に移動したら縮小、上に移動したら拡大
     *
     * @param  {MouseEvent} event
     * @return {number}
     * @method
     * @public
     */
    updateTopScaleY (event)
    {
        let updateScaleY = this.pageY - event.pageY;
        if (!updateScaleY) {
            return 0;
        }

        if (this._$yReverse) {
            updateScaleY *= -1;
        }

        const yScale = +document
            .getElementById("transform-scale-y")
            .value;

        Util
            .$transformController
            .updateScaleY((yScale + updateScaleY) / 100);

        return updateScaleY;
    }

    /**
     * @description 回転処理、右に移動したら右回転、左に移動したら左回転
     *
     * @param  {MouseEvent} event
     * @return {number}
     * @method
     * @public
     */
    updateRotate (event)
    {
        const updateRotate = event.pageX - this.pageX;
        if (!updateRotate) {
            return 0;
        }

        const rotate = +document
            .getElementById("transform-rotate")
            .value;

        let value = rotate + updateRotate;
        value = Util.$clamp(
            (value | 0) % 360,
            TransformController.MIN_ROTATE,
            TransformController.MAX_ROTATE
        );

        Util
            .$transformController
            .updateRotate(value);

        return 1;
    }

    /**
     * @description 中心点を移動
     *
     * @param  {MouseEvent} event
     * @return {number}
     * @method
     * @public
     */
    updateReferencePoint (event)
    {
        const mouseX = (event.pageX - this.pageX) / Util.$zoomScale;
        const mouseY = (event.pageY - this.pageY) / Util.$zoomScale;

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;

        const element = document.getElementById("reference-point");
        if (activeElements.length > 1) {

            const point = Util
                .$referenceController
                .pointer;

            point.x += mouseX;
            point.y += mouseY;

            Util
                .$referenceController
                .setInputValue(point.x, point.y);

            element.style.left = `${element.offsetLeft + mouseX}px`;
            element.style.top  = `${element.offsetTop  + mouseY}px`;

        } else {

            const target  = activeElements[0];
            const layerId = target.dataset.layerId | 0;
            const scene   = Util.$currentWorkSpace().scene;
            const layer   = scene.getLayer(layerId);

            // 座標を更新
            const character = layer
                .getCharacter(target.dataset.characterId | 0);

            const frame = Util.$timelineFrame.currentFrame;

            const range = character.getRange(frame);
            const place = character.getPlace(range.startFrame);
            if (!place.point) {
                const bounds = character.getBounds();

                place.point = {
                    "x": place.matrix[4] + Math.abs(bounds.xMax - bounds.xMin) / 2,
                    "y": place.matrix[5] + Math.abs(bounds.yMax - bounds.yMin) / 2
                };
            }

            place.point.x += mouseX;
            place.point.y += mouseY;

            Util
                .$referenceController
                .setInputValue(place.point.x, place.point.y);

            const left = Util.$offsetLeft + place.point.x * Util.$zoomScale - element.offsetWidth  / 2;
            const top  = Util.$offsetTop  + place.point.y * Util.$zoomScale - element.offsetHeight / 2;

            element
                .setAttribute("style", `left: ${left}px; top: ${top}px;`);

            Util
                .$tweenController
                .relocationPlace(character, range.startFrame);
        }
    }

    /**
     * @description マウスでの拡大縮小時の上部のy座標計算
     *              マウスが右に移動したら縮小、左に移動したら拡大
     *
     * @param  {MouseEvent} event
     * @return {number}
     * @method
     * @public
     */
    updateLeftScaleX (event)
    {
        let updateScaleX = this.pageX - event.pageX;
        if (!updateScaleX) {
            return 0;
        }

        if (this._$xReverse) {
            updateScaleX *= -1;
        }

        const xScale = +document
            .getElementById("transform-scale-x")
            .value;

        Util
            .$transformController
            .updateScaleX((xScale + updateScaleX) / 100);

        return updateScaleX;
    }

    /**
     * @description マウスでの拡大縮小時の下部のy座標計算
     *              マウスが下に移動したら拡大、上に移動したら縮小なので、反転して計算する
     *
     * @param  {MouseEvent} event
     * @return {number}
     * @method
     * @public
     */
    updateBottomScaleY (event)
    {
        let updateScaleY = event.pageY - this.pageY;
        if (!updateScaleY) {
            return 0;
        }

        if (this._$yReverse) {
            updateScaleY *= -1;
        }

        const yScale = +document
            .getElementById("transform-scale-y")
            .value;

        Util
            .$transformController
            .updateScaleY((yScale + updateScaleY) / 100);

        return updateScaleY;
    }

    /**
     * @description マウスでの拡大縮小時の下部のx座標計算
     *              マウスが右に移動したら拡大、左に移動したら縮小なので、反転して計算する
     *
     * @param  {MouseEvent} event
     * @return {number}
     * @method
     * @public
     */
    updateRightScaleX (event)
    {
        let updateScaleX = event.pageX - this.pageX;
        if (!updateScaleX) {
            return 0;
        }

        if (this._$xReverse) {
            updateScaleX *= -1;
        }

        const xScale = +document
            .getElementById("transform-scale-x")
            .value;

        Util
            .$transformController
            .updateScaleX((xScale + updateScaleX) / 100);

        return updateScaleX;
    }

    /**
     * @description DisplayObjectのマウス移動処理関数
     *
     * @param  {MouseEvent} [event=null]
     * @return {void}
     * @method
     * @public
     */
    moveDisplayObject (event = null)
    {
        this.save();

        const scene = Util.$currentWorkSpace().scene;
        const frame = Util.$timelineFrame.currentFrame;

        const dx = event ? event.pageX - this.pageX : this.pageX;
        const dy = event ? event.pageY - this.pageY : this.pageY;

        const parentMatrix = Util.$sceneChange.concatenatedMatrix;

        const { Matrix } = next2d.geom;

        const matrix = new Matrix(
            parentMatrix[0], parentMatrix[1], parentMatrix[2],
            parentMatrix[3], parentMatrix[4], parentMatrix[5]
        );
        matrix.invert();

        let xMin = Number.MAX_VALUE;
        let yMin = Number.MAX_VALUE;
        for (let idx = 0; idx < this._$activeElements.length; ++idx) {

            const object  = this._$activeElements[idx];
            const element = document.getElementById(object.id);

            // ロックしている場合など、スクリーンにElementが存在しない場合はスキップ
            if (!element) {
                continue;
            }

            const layerId = element.dataset.layerId | 0;

            const layer = scene.getLayer(layerId);

            const character = layer
                .getCharacter(element.dataset.characterId | 0);

            // fixed logic
            this.initPlace(character, layerId, frame);

            const place  = character.getPlace(frame);
            const pointX = dx * matrix.a + dy * matrix.c;
            const pointY = dx * matrix.b + dy * matrix.d;

            place.matrix[4] += pointX / Util.$zoomScale;
            place.matrix[5] += pointY / Util.$zoomScale;

            // 中心点を更新
            const bounds = character.getBounds(parentMatrix);
            if (!place.point) {
                place.point = {
                    "x": Util.$sceneChange.offsetX + bounds.xMin + Math.abs(bounds.xMax - bounds.xMin) / 2,
                    "y": Util.$sceneChange.offsetY + bounds.yMin + Math.abs(bounds.yMax - bounds.yMin) / 2
                };
            } else {
                place.point.x += dx / Util.$zoomScale;
                place.point.y += dy / Util.$zoomScale;
            }

            let rectMatrix = null;
            if (Util.$sceneChange.length) {
                rectMatrix = Util.$multiplicationMatrix(
                    parentMatrix,
                    place.matrix
                );
            }

            const rectBounds = character.getBounds(rectMatrix);
            character.screenX = rectBounds.xMin;
            character.screenY = rectBounds.yMin;

            let divStyle = "position: absolute;";
            divStyle += `pointer-events: ${element.dataset.pointer};`;

            if (layer.maskId !== null) {
                const maskLayer = scene.getLayer(layer.maskId);
                if (maskLayer.lock && maskLayer._$characters.length) {

                    const matrix = Util.$sceneChange.concatenatedMatrix;

                    const maskCharacter = maskLayer._$characters[0];
                    maskCharacter.dispose();

                    const maskImage     = maskCharacter.draw(Util.$getCanvas());
                    const maskBounds    = maskCharacter.getBounds(matrix);

                    const maskSrc    = maskImage.toDataURL();
                    const maskWidth  = maskImage._$width  * Util.$zoomScale;
                    const maskHeight = maskImage._$height * Util.$zoomScale;

                    const x = (maskBounds.xMin - bounds.xMin) * Util.$zoomScale;
                    const y = (maskBounds.yMin - bounds.yMin) * Util.$zoomScale;

                    divStyle += `mask: url(${maskSrc}), none;`;
                    divStyle += `-webkit-mask: url(${maskSrc}), none;`;
                    divStyle += `mask-size: ${maskWidth}px ${maskHeight}px;`;
                    divStyle += `-webkit-mask-size: ${maskWidth}px ${maskHeight}px;`;
                    divStyle += "mask-repeat: no-repeat;";
                    divStyle += "-webkit-mask-repeat: no-repeat;";
                    divStyle += `mask-position: ${x}px ${y}px;`;
                    divStyle += `-webkit-mask-position: ${x}px ${y}px;`;

                    const image = character.draw(Util.$getCanvas());
                    divStyle += `mix-blend-mode: ${image.style.mixBlendMode};`;
                    divStyle += `filter: ${image.style.filter};`;

                }
            }

            const left = Util.$offsetLeft + (Util.$sceneChange.offsetX + bounds.xMin) * Util.$zoomScale;
            const top  = Util.$offsetTop  + (Util.$sceneChange.offsetY + bounds.yMin) * Util.$zoomScale;

            divStyle += `left: ${left}px;`;
            divStyle += `top: ${top}px;`;
            element.setAttribute("style", divStyle);

            // move resize rect
            xMin = Math.min(xMin, character.x);
            yMin = Math.min(yMin, character.y);

            // tweenの座標を再計算してポインターを再配置
            character.relocationTween(frame);
        }

        // 移動位置を更新
        if (event) {
            this.pageX = event.pageX;
            this.pageY = event.pageY;
        }

        document.getElementById("object-x").value = +xMin.toFixed(2);
        document.getElementById("object-y").value = +yMin.toFixed(2);

        // 複数選択している場合のポインターを更新
        if (this._$activeElements.length > 1) {
            const pointer = Util.$referenceController.pointer;
            pointer.x += dx;
            pointer.y += dy;
        }

        Util
            .$transformController
            .show()
            .relocation();

        Util
            .$gridController
            .show()
            .relocation();

        const element = document
            .getElementById("timeline-onion-skin");

        if (element && element.classList.contains("onion-skin-active")) {
            this.reloadScreen();
        }
    }

    /**
     * @description DisplayObjectのPlaceObjectがない時の処理関数
     *
     * @param  {Character} character
     * @param  {number} layer_id
     * @param  {number} frame
     * @return {void}
     * @public
     */
    initPlace (character, layer_id, frame)
    {
        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(layer_id);

        let prevFrame = frame;
        while (prevFrame > 0) {

            const frameElement = layer.getChildren(prevFrame);
            if (frameElement
                && frameElement.dataset.frameState === "key-frame"
            ) {

                if (!character._$places.has(prevFrame)) {
                    character.setPlace(prevFrame,
                        character.getClonePlace(prevFrame)
                    );
                }

                break;
            }

            prevFrame--;
        }
    }

    /**
     * @description コントローラーの変形にあるInputの値を再計算して更新
     * @return {void}
     * @method
     * @public
     */
    updateControllerProperty ()
    {
        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;
        let character   = null;

        // 拡大縮小回転の範囲とポインターの情報を再取得
        let tx   = Number.MAX_VALUE;
        let ty   = Number.MAX_VALUE;
        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;
        for (let idx = 0; idx < this._$activeElements.length; ++idx) {

            const moveTarget = this._$activeElements[idx];

            const layerId = moveTarget.dataset.layerId | 0;
            const layer   = scene.getLayer(layerId);

            character = layer.getCharacter(
                moveTarget.dataset.characterId | 0
            );

            tx = Math.min(tx, character.x);
            ty = Math.min(ty, character.y);

            const bounds = character.getBounds();
            xMin = Math.min(xMin, bounds.xMin);
            xMax = Math.max(xMax, bounds.xMax);
            yMin = Math.min(yMin, bounds.yMin);
            yMax = Math.max(yMax, bounds.yMax);
        }

        const width  = Math.abs(xMax - xMin);
        const height = Math.abs(yMax - yMin);
        document.getElementById("object-width").value  = `${+width.toFixed(2)}`;
        document.getElementById("object-height").value = `${+height.toFixed(2)}`;
        document.getElementById("object-x").value = `${+tx.toFixed(2)}`;
        document.getElementById("object-y").value = `${+ty.toFixed(2)}`;

        // オブジェクト設定を表示して、Stage情報は非表示にする
        Util.$controller.showObjectSetting([
            "object-area"
        ]);
        Util.$controller.hideObjectSetting([
            "stage-setting",
            "fill-color-setting"
        ]);

        if (this._$activeElements.length > 1) {

            // 複数選択時は変形以外のコントローラーを非表示にする
            Util.$controller.hideObjectSetting([
                "object-setting",
                "color-setting",
                "blend-setting",
                "loop-setting",
                "filter-setting",
                "video-setting",
                "instance-setting",
                "text-setting",
                "nine-slice-setting",
                "sound-setting",
                "ease-setting"
            ]);

            // 複数選択時には選択中心位置に移動
            if (!Util.$referenceController.pointer) {
                Util.$referenceController.resetPointer();
            }

            document
                .getElementById("transform-scale-x")
                .value = 100;

            document
                .getElementById("transform-scale-y")
                .value = 100;

            document
                .getElementById("transform-rotate")
                .value = 0;

        } else {
            character.showController();
        }
    }

    /**
     * @description 親のMovieClipへシーン移動
     *
     * @return {void}
     * @method
     * @public
     */
    moveScene ()
    {
        const node = document
            .getElementById("scene-name-menu-list")
            .lastElementChild;

        if (node) {

            Util.$sceneChange.offsetX = +node.dataset.offsetX;
            Util.$sceneChange.offsetY = +node.dataset.offsetY;

            // アクティブな情報を削除
            Util.$activeCharacterIds.pop();
            Util.$sceneChange.matrix.pop();
            Util.$sceneChange.length--;

            // シーン移動
            Util.$sceneChange.execute(
                node.dataset.libraryId | 0
            );

            // リストから削除
            node.remove();
        }
    }
}
