/**
 * @class
 * @memberOf view.screen
 */
class ChangeMovieClip extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$element = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$message = "";
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

        const element = document
            .getElementById("change-movie-clip");

        if (element) {
            const elements = element
                .getElementsByClassName("change-movie-clip-box-child");

            for (let idx = 0; elements.length > idx; ++idx) {

                const element = elements[idx];

                // 初期値をセット
                if (element.dataset.position === "middle-center") {
                    this._$element = element;
                    this._$element.classList.add("active");
                }

                element.addEventListener("mousedown", (event) =>
                {
                    // 親のイベント中止
                    event.stopPropagation();

                    // id名で関数を実行
                    this.changeBox(event);
                });
            }

        }

        const elementIds = [
            "change-movie-clip-button"
        ];

        for (let idx = 0; elementIds.length > idx; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                if (this._$message) {
                    this.showModal(this._$message);
                    return ;
                }

                // id名で関数を実行
                this.executeFunction(event.target.id);
            });

        }

        const input = document
            .getElementById("change-movie-clip-input");

        if (input) {

            input.addEventListener("focusin", () =>
            {
                this.focusIn();
            });

            // 重複チェック
            input.addEventListener("focusout", () =>
            {
                this.focusOut();
            });
        }
    }

    /**
     * @description 名前編集開始
     *
     * @return {void}
     * @method
     * @public
     */
    focusIn ()
    {
        Util.$keyLock = true;
    }

    /**
     * @description 名前編集終了
     *
     * @return {void}
     * @method
     * @public
     */
    focusOut ()
    {
        if (!Util.$keyLock) {
            return ;
        }

        // 初期化
        Util.$keyLock  = false;
        this._$message = "";

        const input = document.getElementById("change-movie-clip-input");
        if (!input) {
            return ;
        }

        const name = input.value;
        if (!name) {
            this._$message = "{{名前は必須です}}";
        }

        if (!this._$message) {

            const workSpace = Util.$currentWorkSpace();
            for (const instance of workSpace._$libraries.values()) {

                if (instance.path !== name) {
                    continue;
                }

                this._$message = "{{名前が重複しています}}";
                break;
            }
        }

        if (this._$message) {
            this.showModal(this._$message);
        }
    }

    /**
     * @description 注意テキストを表示
     *
     * @param  {string} [message=""]
     * @return {void}
     * @method
     * @public
     */
    showModal (message = "")
    {
        const element = document
            .getElementById("detail-modal");

        if (element) {

            clearTimeout(
                element.dataset.timerId | 0
            );

            element.textContent = Util
                .$currentLanguage
                .replace(message);

            const parent = document
                .getElementById("change-movie-clip");

            const x = parent.offsetLeft - parent.offsetWidth  / 2;
            const y = parent.offsetTop  - parent.offsetHeight / 2;

            const input = document
                .getElementById("change-movie-clip-input");

            element.style.left = `${x + input.offsetLeft}px`;
            element.style.top  = `${y + input.offsetTop}px`;

            if (!element.classList.contains("fadeIn")) {
                element.setAttribute("class", "fadeIn");
            }

            // 1.5秒で自動的に消えるようタイマーをセット
            element.dataset.timerId = setTimeout(() =>
            {
                if (!element.classList.contains("fadeOut")) {
                    element.setAttribute("class", "fadeOut");
                }
            }, 1500);
        }
    }

    /**
     * @description 基準点を設定
     *
     * @return  {void}
     * @method
     * @public
     */
    changeBox (event)
    {
        // 初期化
        if (this._$element) {
            this._$element
                .setAttribute("class", "change-movie-clip-box-child");
        }

        this._$element = event.target;
        this._$element.classList.add("active");
    }

    /**
     * @description MovieClipに変換
     *
     * @return {void}
     * @method
     * @public
     */
    executeChangeMovieClipButton ()
    {
        const input = document
            .getElementById("change-movie-clip-input");

        if (!input) {
            return ;
        }

        if (Util.$keyLock) {
            input.blur();
        }

        if (!this._$element || this._$message) {
            return ;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        if (!Util.$timelineLayer.targetLayer) {
            return ;
        }

        this.save();

        const workSpace = Util.$currentWorkSpace();

        const scene = workSpace.scene;
        const frame = Util.$timelineFrame.currentFrame;

        const id = workSpace.nextLibraryId;

        // ライブラリに空のMovieClipを追加
        const instance = workSpace.addLibrary(
            Util
                .$libraryController
                .createInstance(
                    InstanceType.MOVIE_CLIP,
                    input.value,
                    id
                )
        );

        // MovieClipに指定したDisplayObjectを登録
        const newLayer = new Layer();
        instance.setLayer(0, newLayer);

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];
            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            const bounds = character.getBounds();
            xMin = Math.min(xMin, bounds.xMin);
            xMax = Math.max(xMax, bounds.xMax);
            yMin = Math.min(yMin, bounds.yMin);
            yMax = Math.max(yMax, bounds.yMax);
        }

        const position = this._$element.dataset.position;

        let dx = xMin;
        let dy = yMin;

        const w = Math.abs(xMax - xMin);
        const h = Math.abs(yMax - yMin);
        switch (position) {

            case "top-left":
                break;

            case "top-center":
                dx += w / 2;
                break;

            case "top-right":
                dx += w;
                break;

            case "middle-left":
                dy += h / 2;
                break;

            case "middle-center":
                dx += w / 2;
                dy += h / 2;
                break;

            case "middle-right":
                dx += w;
                dy += h / 2;
                break;

            case "bottom-left":
                dy += h;
                break;

            case "bottom-center":
                dx += w / 2;
                dy += h;
                break;

            case "bottom-right":
                dx += w;
                dy += h;
                break;

        }

        /**
         * @type {Layer}
         */
        let targetLayer = null;

        let targetRange = null;
        let targetTween = null;
        const layers = new Map();
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];
            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            if (!targetLayer) {
                targetLayer = layer;
            }

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            if (!targetRange) {
                targetRange = character.getRange(frame);

                if (character.hasTween(targetRange.startFrame)) {
                    targetTween = {
                        "tween": character.getTween(targetRange.startFrame),
                        "place": character.getClonePlace(targetRange.endFrame - 1)
                    };
                }
            }

            const range = character.getRange(frame);
            if (!layers.has(layer.id)) {
                layers.set(layer.id, {
                    "layer": layer,
                    "range": range
                });
            }

            const cloneCharacter = new Character();
            cloneCharacter.libraryId = character.libraryId;

            const place = character.getPlace(range.startFrame);

            const clonePlace = {
                "frame": 1,
                "matrix": place.matrix.slice(),
                "colorTransform": place.colorTransform.slice(),
                "blendMode": place.blendMode,
                "filter": place.filter.slice(),
                "loop": place.loop
                    ? JSON.parse(JSON.stringify(place.loop))
                    : Util.$getDefaultLoopConfig(),
                "depth": idx
            };

            if ("scaleX" in place) {
                clonePlace.scaleX = place.scaleX;
            }

            if ("scaleY" in place) {
                clonePlace.scaleY = place.scaleY;
            }

            if ("rotation" in place) {
                clonePlace.rotation = place.rotation;
            }

            cloneCharacter.setPlace(1, clonePlace);

            cloneCharacter.x -= dx;
            cloneCharacter.y -= dy;

            newLayer.addCharacter(cloneCharacter);

            // 削除
            character.remove(layer);
        }

        // 各レイヤーを再描画
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

        const character = new Character();
        character.libraryId  = instance.id;
        character.startFrame = targetRange.startFrame;
        character.endFrame   = targetRange.endFrame;

        if (targetTween) {

            for (let keyFrame = targetRange.startFrame;
                targetRange.endFrame > keyFrame;
                ++keyFrame
            ) {
                character.setPlace(keyFrame, {
                    "frame": keyFrame,
                    "tweenFrame": targetRange.startFrame,
                    "matrix": [1, 0, 0, 1, dx, dy],
                    "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                    "blendMode": "normal",
                    "filter": [],
                    "depth": 0,
                    "loop": Util.$getDefaultLoopConfig()
                });
            }

            let lastX = targetTween.place.matrix[4];
            let lastY = targetTween.place.matrix[5];
            switch (position) {

                case "top-left":
                    break;

                case "top-center":
                    lastX += w / 2;
                    break;

                case "top-right":
                    lastX += w;
                    break;

                case "middle-left":
                    lastY += h / 2;
                    break;

                case "middle-center":
                    lastX += w / 2;
                    lastY += h / 2;
                    break;

                case "middle-right":
                    lastX += w;
                    lastY += h / 2;
                    break;

                case "bottom-left":
                    lastY += h;
                    break;

                case "bottom-center":
                    lastX += w / 2;
                    lastY += h;
                    break;

                case "bottom-right":
                    lastX += w;
                    lastY += h;
                    break;

            }

            const lastPlace = character.getPlace(targetRange.endFrame - 1);
            lastPlace.matrix[4] = lastX;
            lastPlace.matrix[5] = lastY;

            character.setTween(targetRange.startFrame, targetTween.tween);

            Util
                .$tweenController
                .relocationPlace(character, targetRange.startFrame);

        } else {

            character.setPlace(targetRange.startFrame, {
                "frame": targetRange.startFrame,
                "matrix": [1, 0, 0, 1, dx, dy],
                "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                "blendMode": "normal",
                "filter": [],
                "depth": 0,
                "loop": Util.$getDefaultLoopConfig(),
                "scaleX": 1,
                "scaleY": 1,
                "rotation": 0
            });

        }

        targetLayer.addCharacter(character);

        const emptyCharacter = targetLayer
            .getActiveEmptyCharacter(targetRange.startFrame);

        if (emptyCharacter) {
            targetLayer.deleteEmptyCharacter(emptyCharacter);
        }

        // 前方に空のキーフレームを追加
        if (targetRange.startFrame > 1) {
            targetLayer.addEmptyCharacter(new EmptyCharacter({
                "startFrame": 1,
                "endFrame": targetRange.startFrame
            }));
        }

        targetLayer.reloadStyle();

        // 選択中のelementを初期化
        tool.clearActiveElement(); // fixed logic

        // 再描画
        this.reloadScreen();

        // 初期化
        this._$saved = false;
    }
}

Util.$changeMovieClip = new ChangeMovieClip();