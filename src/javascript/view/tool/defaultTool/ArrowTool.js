/**
 * @class
 * @extends BaseTool
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
         * @type {object}
         * @private
         */
        this._$referencePoint = {
            "x": 0,
            "y": 0
        };

        /**
         * @type {array}
         * @private
         */
        this._$activeElements = [];
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
        // 削除イベント
        this.addEventListener(EventType.DELETE, () =>
        {
            this.deleteCharacter();
        });

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

        this.addEventListener(EventType.KEY_DOWN, (event) =>
        {
            this.keyboardCommand(event);
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
        });

        // ツール終了時に初期化
        this.addEventListener(EventType.END, () =>
        {
            this.clear();
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
     * @description 複数選択時の中心点の
     * @return {object}
     * @readonly
     * @public
     */
    get referencePoint ()
    {
        return this._$referencePoint;
    }

    /**
     * @description スクリーンで選択したElemnetの配列
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
        this._$activeElements.length = 0;

        // スクリーンエリアの変形Elementを非表示に
        Util.$transformController.hide();
        Util.$gridController.hide();
        Util.$screen.clearTweenMarker();

        // コントローラーエリアを初期化
        Util.$filterController.clearFilters();
        Util.$controller.clearActiveController();

        // タイムラインエリアを初期化
        Util.$timelineLayer.clear();
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
     * @description タイムラインのアクティブなレイヤーとフレームのエレメントを指定して初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clearActiveLayerAndFrame (element)
    {
        const layerId = element.dataset.layerId | 0;

        const layerElement = document
            .getElementById(`layer-id-${layerId}`);

        if (!layerElement) {
            return ;
        }

        layerElement
            .classList
            .remove("active");

        const frame = Util.$timelineFrame.currentFrame;

        const frameElement = document
            .getElementById(`${layerId}-${frame}`);

        frameElement
            .classList
            .remove("frame-active");
    }

    /**
     * @description 選択したDisplayObjectを配列に格納
     *              もし配列内に指定済みのDisplayObjectがあれば何もしない
     *
     * @param  {HTMLDivElement} element
     * @param  {number}  [x=0]
     * @param  {number}  [y=0]
     * @param  {boolean} [hit=false]
     * @return {boolean}
     * @method
     * @public
     */
    addElement (element, x = 0, y = 0, hit = false)
    {
        for (let idx = 0; idx < this._$activeElements.length; ++idx) {

            const object = this._$activeElements[idx];
            const target = object.target;

            if (target.dataset.characterId === element.dataset.characterId) {

                if (Util.$shiftKey) {
                    const object = this._$activeElements.splice(idx, 1)[0];
                    // this.clearActiveLayerAndFrame(object.target);
                } else {
                    this._$activeElements.splice(idx, 1, {
                        "target": element,
                        "moveX": x,
                        "moveY": y
                    });
                }

                return false;
            }
        }

        // 複数選択でなければ配列は初期化する
        if (!hit && !Util.$shiftKey) {
            // タイムラインを初期化
            // for (let idx = 0; idx < this._$activeElements.length; ++idx) {
            //     this.clearActiveLayerAndFrame(
            //         this._$activeElements[idx].target
            //     );
            // }

            // 配列も初期化
            this._$activeElements.length = 0;
        }

        this._$activeElements.push({
            "target": element,
            "moveX": x,
            "moveY": y
        });

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
        const target  = this.target;
        const layerId = target.dataset.layerId | 0;

        // タイムラインでロック中のDisplayObjectは何もしない
        const lockElement = document
            .getElementById(`layer-lock-icon-${layerId}`);

        if (lockElement.classList.contains("icon-active")) {
            return ;
        }

        // タイムラインのアクティブなElementを初期化
        Util.$timelineLayer.clear();

        const result = this.addElement(target,
            event.pageX - target.offsetLeft,
            event.pageY - target.offsetTop
        );

        const workSpace = Util.$currentWorkSpace();

        const scene = workSpace.scene;
        const layer = scene.getLayer(layerId);

        const character = layer.getCharacter(
            target.dataset.characterId | 0
        );

        if (result) {
            this.updateControllerProperty();
        }

        // Shapeは描画反映の判定で毎回ヒット判定を行う
        if (this._$activeElements.length === 1) {
            character.showShapeColor(event);
        }

        // 複数選択時の移動座標の調整
        if (this._$activeElements.length > 1) {
            for (let idx = 0; idx < this._$activeElements.length; ++idx) {

                const object  = this._$activeElements[idx];
                const target  = object.target;
                const element = document
                    .getElementById(target.id);

                object.moveX = event.pageX - element.offsetLeft;
                object.moveY = event.pageY - element.offsetTop;

                // Layer Elementのアクティブクラスを除去
                // const layerId = target.dataset.layerId | 0;
                // const layerElement = document
                //     .getElementById(`layer-id-${layerId}`);
                //
                // layerElement
                //     .classList
                //     .remove("active");
            }
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

        // if (Util.$screen._$multiMode) {
        //
        //     if (frameElement.classList.contains("tween-frame")) {
        //         Util.$screen.clearTweenMarker();
        //     }
        //
        // } else {
        //
        //     const workSpace = Util.$currentWorkSpace();
        //
        //     const scene = workSpace.scene;
        //     const layer = scene.getLayer(layerId);
        //
        //     const character = layer.getCharacter(
        //         target.dataset.characterId | 0
        //     );
        //
        //     if (frameElement.classList.contains("tween-frame")) {
        //         Util.$screen.clearTweenMarker();
        //
        //         const tween = character.getTween();
        //         if (tween && tween.method === "custom") {
        //             Util.$controller.showEaseCanvasArea();
        //         }
        //
        //         Util.$screen.executeTween(layer);
        //         Util.$screen.createTweenMarker(false);
        //     }
        // }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    activeTimeline ()
    {
        const frame = Util.$timelineFrame.currentFrame;

        let frameElement = null;
        let layerId = 0;

        const cacheValue = Util.$ctrlKey;
        Util.$ctrlKey = this._$activeElements.length > 1;

        for (let idx = 0; idx < this._$activeElements.length; ++idx) {

            const element = this._$activeElements[idx].target;

            layerId = element.dataset.layerId | 0;

            Util.$timelineLayer.targetLayer = document
                .getElementById(`layer-id-${layerId}`);

            Util
                .$timelineLayer
                .addTargetFrame(
                    layerId,
                    document.getElementById(`${layerId}-${frame}`)
                );
        }
        Util.$ctrlKey = cacheValue;

        Util.$timeline._$targetLayer = null;
        if (this._$activeElements.length === 1) {
            const layerElement = document
                .getElementById(`layer-id-${layerId}`);

            layerElement.classList.add("active");

            Util.$timeline._$targetLayer  = layerElement;
            Util.$timeline._$targetFrame  = frameElement;
            Util.$timeline._$targetFrames = [frameElement];
        }

    }

    /**
     * @description スクリーンで選択したDisplayObjectを削除する
     *
     * @return {void}
     * @method
     * @public
     */
    deleteCharacter ()
    {
        const workSpace = Util.$currentWorkSpace();
        workSpace.temporarilySaved();

        const scene = workSpace.scene;

        const frame = Util.$timelineFrame.currentFrame;

        const moveTargets = this._$activeElements;
        for (let idx = 0; idx < moveTargets.length; ++idx) {

            const object = moveTargets[idx];

            const element = object.target;

            const layerId = element.dataset.layerId | 0;
            const layer   = scene.getLayer(layerId);

            const characterId = element.dataset.characterId | 0;
            const character   = layer.getCharacter(characterId);

            if (!character) {
                continue;
            }

            for (let [frame, place] of character._$places) {

                const depth = place.depth;
                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                    const char = layer._$characters[idx];
                    if (char.id === character.id) {
                        continue;
                    }

                    if (char.hasPlace(frame)) {
                        const place = char.getPlace(frame);
                        if (place.depth > depth) {
                            place.depth--;
                        }
                    }
                }
            }

            let done = false;
            let startFrame = frame;
            for (;;) {

                const frameElement = document
                    .getElementById(`${layerId}-${startFrame}`);

                if (frameElement.dataset.frameState === "key-frame") {
                    done = true;
                }

                if (done) {
                    break;
                }

                startFrame--;
            }

            done = false;
            let endFrame = frame;
            for (;;) {

                const frameElement = document
                    .getElementById(`${layerId}-${++endFrame}`);

                switch (frameElement.dataset.frameState) {

                    case "empty":
                    case "empty-key-frame":
                    case "key-frame":
                        done = true;
                        break;

                    case "key-space-frame-end":
                        done = true;
                        endFrame++;
                        break;

                }

                if (done) {
                    break;
                }

            }

            switch (true) {

                case character.startFrame !== startFrame:

                    if (character.endFrame !== endFrame) {
                        const clone = character.clone();
                        clone.startFrame = endFrame;

                        for (const frame of clone._$places.keys()) {
                            if (endFrame > frame) {
                                clone.deletePlace(frame);
                            }
                        }

                        layer.addCharacter(clone);
                    }

                    character.endFrame = startFrame;
                    for (const frame of character._$places.keys()) {
                        if (frame >= startFrame) {
                            character.deletePlace(frame);
                        }
                    }
                    break;

                case character.endFrame !== endFrame:
                    {
                        const place = character.getPlace(character.startFrame);
                        character.deletePlace(character.startFrame);

                        character.startFrame = endFrame;

                        if (!character.hasPlace(endFrame)) {
                            character.setPlace(endFrame, place);
                        }
                    }
                    break;

                default:
                    layer.deleteCharacter(characterId);
                    element.remove();
                    break;

            }

            if (!layer.getActiveCharacter(startFrame).length) {
                Util.$screen.clearFrames(layer, startFrame, endFrame);
            }
        }

        this.clear();

        // Util.$screen.clearActiveCharacter();
        // Util.$controller.setDefaultController();
        // scene.changeFrame(frame);
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

        const target = this._$activeElements[0].target;

        const layerId = target.dataset.layerId | 0;
        const layer   = scene.getLayer(layerId);

        const characterId = target.dataset.characterId | 0;
        const character   = layer.getCharacter(characterId);

        // update
        character._$libraryId = event.target.value | 0;
        character._$image     = null;

        Util.$screen.clearTweenMarker();
        if (character._$tween
            && character.hasTween()
        ) {
            Util.$screen.executeTween(layer);
            Util.$screen.createTweenMarker(false);
        }

        const icon = document
            .getElementById("instance-type-name")
            .getElementsByTagName("i")[0];

        const instance = workSpace.getLibrary(character._$libraryId);
        icon.setAttribute("class", `library-type-${instance.type}`);

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

            this.addElement(node, 0, 0, true);
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
        const updateScaleY = this.pageY - event.pageY;
        if (!updateScaleY) {
            return 0;
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

        Util
            .$transformController
            .updateRotate(rotate + updateRotate);

        return updateRotate;
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

            const element = event.target;

            this._$referencePoint.x += mouseX;
            this._$referencePoint.y += mouseY;

            element.style.left = `${element.offsetLeft + mouseX}px`;
            element.style.top  = `${element.offsetTop  + mouseY}px`;

        } else {

            const target  = activeElements[0].target;
            const layerId = target.dataset.layerId | 0;
            const scene   = Util.$currentWorkSpace().scene;
            const layer   = scene.getLayer(layerId);

            const character = layer
                .getCharacter(target.dataset.characterId | 0);

            const frame = Util.$timelineFrame.currentFrame;

            const matrix = character.getClonePlace(frame).matrix;
            const x = mouseX * matrix[0] + mouseY * matrix[2];
            const y = mouseX * matrix[1] + mouseY * matrix[3];

            // 座標を更新
            character._$referencePoint.x += x;
            character._$referencePoint.y += y;

            const point = character.referencePoint;

            // 画面の拡大縮小対応
            const pointX = point.x * Util.$zoomScale;
            const pointY = point.y * Util.$zoomScale;

            const dx = pointX * matrix[0] + pointY * matrix[2];
            const dy = pointX * matrix[1] + pointY * matrix[3];

            const characterElement = document
                .getElementById(`character-${character.id}`);

            const xMin   = characterElement.offsetLeft;
            const yMin   = characterElement.offsetTop;
            const width  = characterElement.offsetWidth;
            const height = characterElement.offsetHeight;

            element.style.left = `${dx + xMin + width  / 2 - 5}px`;
            element.style.top  = `${dy + yMin + height / 2 - 5}px`;

            // if (document
            //     .getElementById(`${layerId}-${frame}`)
            //     .classList
            //     .contains("tween-frame")
            // ) {
            //     this.executeTween(layer);
            //     this.createTweenMarker();
            // }

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
        const updateScaleX = this.pageX - event.pageX;
        if (!updateScaleX) {
            return 0;
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
        const updateScaleY = event.pageY - this.pageY;
        if (!updateScaleY) {
            return 0;
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
        const updateScaleX = event.pageX - this.pageX;
        if (!updateScaleX) {
            return 0;
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
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveDisplayObject (event)
    {
        this.save();

        const scene = Util.$currentWorkSpace().scene;
        const frame = Util.$timelineFrame.currentFrame;

        let xMin = Number.MAX_VALUE;
        let yMin = Number.MAX_VALUE;
        for (let idx = 0; idx < this._$activeElements.length; ++idx) {

            const object  = this._$activeElements[idx];
            const element = document.getElementById(object.target.id);
            const layerId = element.dataset.layerId | 0;

            const layer = scene.getLayer(layerId);

            const character = layer
                .getCharacter(element.dataset.characterId | 0);

            // fixed logic
            this.initPlace(character, layerId, frame);

            // calc
            const dx = event.pageX - object.moveX;
            const dy = event.pageY - object.moveY;

            const matrix = character.getPlace(frame).matrix;

            const tx = dx - parseFloat(element.style.left);
            const ty = dy - parseFloat(element.style.top);

            matrix[4] += tx / Util.$zoomScale;
            matrix[5] += ty / Util.$zoomScale;
            character.screenX += tx;
            character.screenY += ty;

            if (layer.maskId !== null) {
                const maskLayer = scene.getLayer(layer.maskId);
                if (maskLayer.lock && maskLayer._$characters.length) {
                    const maskCharacter = maskLayer._$characters[0];
                    const x = maskCharacter.screenX - character.screenX;
                    const y = maskCharacter.screenY - character.screenY;
                    element.style.webkitMaskPosition = `${x}px ${y}px`;
                }
            }

            element.style.left = `${dx}px`;
            element.style.top  = `${dy}px`;

            // move resize rect
            xMin = Math.min(xMin, character.x);
            yMin = Math.min(yMin, character.y);

            if (layer._$frame.hasClasses(frame)) {

                const classes = layer
                    ._$frame
                    .getClasses(frame);

                if (classes.indexOf("tween-frame") > -1) {
                //     this.executeTween(layer);
                //     this.createTweenMarker();
                //
                    const onionElement = document
                        .getElementById("timeline-onion-skin");
                    if (onionElement.classList.contains("onion-skin-active")) {
                        this.reloadScreen();
                    }
                }
            }
        }

        document.getElementById("object-x").value = xMin;
        document.getElementById("object-y").value = yMin;

        Util
            .$transformController
            .show()
            .relocation();

        Util
            .$gridController
            .show()
            .relocation();
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
        let prevFrame = frame;
        while (prevFrame > 0) {

            const frameElement = document
                .getElementById(`${layer_id}-${prevFrame}`);

            if (frameElement.dataset.frameState === "key-frame") {

                if (!character._$places.has(prevFrame)) {
                    character.setPlace(prevFrame,
                        character.clonePlace(prevFrame, prevFrame)
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

        // 現在のフレーム
        const frame = Util.$timelineFrame.currentFrame;

        // 拡大縮小回転の範囲とポインターの情報を再取得
        let tx   = Number.MAX_VALUE;
        let ty   = Number.MAX_VALUE;
        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;
        for (let idx = 0; idx < this._$activeElements.length; ++idx) {

            const moveTarget = this._$activeElements[idx].target;

            const layerId = moveTarget.dataset.layerId | 0;
            const layer   = scene.getLayer(layerId);

            character = layer.getCharacter(
                moveTarget.dataset.characterId | 0
            );

            tx = Math.min(tx, character.x);
            ty = Math.min(ty, character.y);

            const matrix = character.getPlace(frame).matrix;
            const bounds = Util.$boundsMatrix(character.getBounds(), matrix);
            xMin = Math.min(xMin, bounds.xMin);
            xMax = Math.max(xMax, bounds.xMax);
            yMin = Math.min(yMin, bounds.yMin);
            yMax = Math.max(yMax, bounds.yMax);
        }

        document.getElementById("object-width").value  = Math.abs(xMax - xMin);
        document.getElementById("object-height").value = Math.abs(yMax - yMin);
        document.getElementById("object-x").value = tx;
        document.getElementById("object-y").value = ty;

        // オブジェクト設定を表示して、Stage情報は非表示にする
        Util.$controller.showObjectArea();
        Util.$controller.hideStageSetting();
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
                "fill-color-setting",
                "nine-slice-setting",
                "sound-setting"
            ]);

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

            const frame = node.dataset.frame | 0;

            Util.$timelineFrame.currentFrame = frame;

            const workSpace = Util.$currentWorkSpace();
            workSpace.scene = workSpace.getLibrary(
                node.dataset.libraryId | 0
            );

            const moveX = (frame - 1) * 13;
            document
                .getElementById("timeline-marker")
                .style
                .left = `${moveX}px`;

            const base = document
                .getElementById("timeline-controller-base");

            const x = moveX > base.offsetWidth / 2
                ? moveX - base.offsetWidth / 2
                : 0;

            Util.$timelineLayer.moveTimeLine(x);

            node.remove();
        }
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    keyboardCommand (event)
    {

    }
}
