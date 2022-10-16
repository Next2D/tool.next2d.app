/**
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class LoopController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super("loop");

        /**
         * @type {string}
         * @default "start"
         * @private
         */
        this._$frameTarget = "start";
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

        const elementIds = [
            "no-use-loop",
            "loop-repeat",
            "loop-no-repeat",
            "fixed-one",
            "loop-no-repeat-reversal",
            "loop-repeat-reversal",
            "frame-picker-button",
            "target-start-button",
            "target-end-button"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                // 他のイベントを中止
                event.stopPropagation();

                // id名で関数を実行
                this.executeFunction(event.target.id, event);
            });
        }

        const inputIds = [
            "loop-start-frame",
            "loop-end-frame"
        ];

        for (let idx = 0; idx < inputIds.length; ++idx) {

            const element = document.getElementById(inputIds[idx]);
            if (!element) {
                continue;
            }

            this.setInputEvent(element);
        }
    }

    /**
     * @description ループの開始フレームを設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeLoopStartFrame (value)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return value;
        }

        const element = activeElements[0];

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(
            element.dataset.layerId | 0
        );

        const character = layer.getCharacter(
            element.dataset.characterId | 0
        );

        if (!character) {
            return value;
        }

        const instance = Util
            .$currentWorkSpace()
            .getLibrary(
                character.libraryId
            );

        if (!instance) {
            return value;
        }

        value = Util.$clamp(value | 0, 1, instance.totalFrame);

        const frame = Util.$timelineFrame.currentFrame;
        const range = character.getRange(frame);

        let place = character.getPlace(range.startFrame);
        if (!place.loop) {
            return value;
        }

        // ループタイプを更新してキャッシュを削除
        place.loop.start  = value;
        character.dispose();

        // 再描画
        this.reloadScreen();

        return value;
    }

    /**
     * @description ループの終了フレームを設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeLoopEndFrame (value)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return value;
        }

        const element = activeElements[0];

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(
            element.dataset.layerId | 0
        );

        const character = layer.getCharacter(
            element.dataset.characterId | 0
        );

        if (!character) {
            return value;
        }

        const instance = Util
            .$currentWorkSpace()
            .getLibrary(
                character.libraryId
            );

        if (!instance) {
            return value;
        }

        value = Util.$clamp(value | 0, 0, instance.totalFrame);

        const frame = Util.$timelineFrame.currentFrame;
        const range = character.getRange(frame);

        let place = character.getPlace(range.startFrame);
        if (!place.loop) {
            return value;
        }

        // ループタイプを更新してキャッシュを削除
        place.loop.end    = value;
        character.dispose();

        // 再描画
        this.reloadScreen();

        return value ? value : "-";
    }

    /**
     * @description フレーム毎のイメージを生成
     *
     * @return {void}
     * @method
     * @public
     */
    changeFramePickerButton ()
    {
        document
            .getElementById("loop-image-list")
            .style.display = "none";

        this.loadLoopFrameList();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    changeTargetStartButton ()
    {
        const element = document
            .getElementById("target-start-button");

        if (!element.classList.contains("active")) {
            element.classList.add("active");
        }

        document
            .getElementById("target-end-button")
            .classList.remove("active");

        this._$frameTarget = "start";
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    changeTargetEndButton ()
    {
        const element = document
            .getElementById("target-end-button");

        if (!element.classList.contains("active")) {
            element.classList.add("active");
        }

        document
            .getElementById("target-start-button")
            .classList.remove("active");

        this._$frameTarget = "end";
    }

    /**
     * @description カスタムループ機能をOnに
     *
     * @return {void}
     * @method
     * @public
     */
    changeLoopRepeat ()
    {
        const element = document
            .getElementById("loop-repeat");

        // 全てのボタンを非アクティブに
        this.clearLoopButton(element);

        element.classList.add("active");

        this.updateLoopType(0);
    }

    /**
     * @description カスタムループの1回終了機能をOnに
     *
     * @return {void}
     * @method
     * @public
     */
    changeLoopNoRepeat ()
    {
        const element = document
            .getElementById("loop-no-repeat");

        // 全てのボタンを非アクティブに
        this.clearLoopButton(element);

        element.classList.add("active");

        this.updateLoopType(1);
    }

    /**
     * @description 指定フレームに固定
     *
     * @return {void}
     * @method
     * @public
     */
    changeFixedOne ()
    {
        const element = document
            .getElementById("fixed-one");

        // 全てのボタンを非アクティブに
        this.clearLoopButton(element);

        element.classList.add("active");

        this.updateLoopType(2);
    }

    /**
     * @description カスタムループの逆再生の1回終了機能をOnに
     *
     * @return {void}
     * @method
     * @public
     */
    changeLoopNoRepeatReversal ()
    {
        const element = document
            .getElementById("loop-no-repeat-reversal");

        // 全てのボタンを非アクティブに
        this.clearLoopButton(element);

        element.classList.add("active");

        this.updateLoopType(3);
    }

    /**
     * @description カスタムループ機能の逆再生をOnに
     *
     * @return {void}
     * @method
     * @public
     */
    changeLoopRepeatReversal ()
    {
        const element = document
            .getElementById("loop-repeat-reversal");

        // 全てのボタンを非アクティブに
        this.clearLoopButton(element);

        element.classList.add("active");

        this.updateLoopType(4);
    }

    /**
     * @description Playerのループ機能をOn
     *
     * @return {void}
     * @method
     * @public
     */
    changeNoUseLoop ()
    {
        const element = document
            .getElementById("no-use-loop");

        // 全てのボタンを非アクティブに
        this.clearLoopButton(element);

        element.classList.add("active");

        this.updateLoopType(5);
    }

    /**
     * @description 全てのボタンを非アクティブに
     *
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    clearLoopButton (element)
    {
        // 全てのボタンを非アクティブに
        const children = element.parentNode.children;
        for (let idx = 0; idx < children.length; ++idx) {
            children[idx]
                .classList
                .remove("active");
        }
    }

    /**
     * @description 初期化
     *
     * @param  {object} loop_setting
     * @return {void}
     * @method
     * @public
     */
    reload (loop_setting)
    {
        const children = document
            .getElementById("loop-setting-view-area")
            .firstElementChild.children;

        for (let idx = 0; idx < children.length; ++idx) {
            children[idx].classList.remove("active");
        }

        const element = document
            .getElementById("loop-image-list");

        while (element.children.length) {
            element.children[0].remove();
        }

        const types = [
            "loop-repeat",
            "loop-no-repeat",
            "fixed-one",
            "loop-no-repeat-reversal",
            "loop-repeat-reversal",
            "no-use-loop"
        ];

        document
            .getElementById(types[loop_setting.type])
            .classList.add("active");

        document
            .getElementById("loop-start-frame")
            .value = `${loop_setting.start}`;

        document
            .getElementById("loop-end-frame")
            .value = `${loop_setting.end ? loop_setting.end : "-"}`;
    }

    /**
     * @return {void}
     * @public
     */
    loadLoopFrameList ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return ;
        }

        // イメージ表示を初期化
        const element = document
            .getElementById("loop-image-list");

        const children = element.children;
        while (children.length) {
            children[0].remove();
        }

        const workSpace = Util.$currentWorkSpace();
        const scene = workSpace.scene;

        const target = activeElements[0];

        const layerId = target.dataset.layerId | 0;
        const layer   = scene.getLayer(layerId);

        const characterId = target.dataset.characterId | 0;
        const character   = layer.getCharacter(characterId);

        const range = {
            "startFrame": character.startFrame,
            "endFrame": character.endFrame
        };

        const instance = workSpace.getLibrary(character.libraryId);

        const currentFrame = Util.$timelineFrame.currentFrame;

        const promises = [];
        const endFrame = instance.totalFrame;
        for (let frame = 1; endFrame >= frame; ++frame) {

            // eslint-disable-next-line no-loop-func
            promises.push(new Promise((resolve) =>
            {
                window.requestAnimationFrame(() =>
                {
                    const { Sprite, BitmapData } = window.next2d.display;
                    const { Matrix, ColorTransform } = window.next2d.geom;

                    Util.$currentFrame = frame;

                    const sprite = new Sprite();

                    const placeObject = {
                        "frame": frame,
                        "matrix": [1, 0, 0, 1, 0, 0],
                        "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                        "blendMode": "normal",
                        "filter": [],
                        "loop": Util.$getDefaultLoopConfig()
                    };

                    const displayObject = sprite
                        .addChild(
                            instance.createInstance(placeObject, range)
                        );

                    displayObject
                        .transform
                        .matrix = new Matrix();

                    displayObject
                        .transform
                        .colorTransform = new ColorTransform();

                    const bounds = instance.getBounds(
                        [1, 0, 0, 1, 0, 0], placeObject, range
                    );

                    const width  = Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
                    const height = Math.ceil(Math.abs(bounds.yMax - bounds.yMin));
                    const scale  = Math.min(95 / width, 95 / height);
                    const ratio  = window.devicePixelRatio;

                    const bitmapData = new BitmapData(
                        width  * scale * ratio,
                        height * scale * ratio,
                        true, 0
                    );

                    const matrix = new Matrix(
                        ratio, 0, 0, ratio,
                        -bounds.xMin * ratio,
                        -bounds.yMin * ratio
                    );

                    matrix.scale(scale, scale);
                    bitmapData.draw(sprite, matrix);

                    const image = new Image();
                    image.onload = () =>
                    {
                        return resolve({
                            "index": frame - 1,
                            "image": image
                        });
                    };

                    image.src    = bitmapData.toDataURL();
                    image.width  = bitmapData.width  / ratio;
                    image.height = bitmapData.height / ratio;

                    bitmapData.dispose();
                });
            }));
        }

        Promise.all(promises)
            .then((results) =>
            {
                // reset
                Util.$currentFrame = currentFrame;

                const images = [];
                for (let idx = 0; idx < results.length; ++idx) {
                    const object = results[idx];
                    images[object.index] = object.image;
                }

                for (let idx = 0; idx < images.length; ++idx) {

                    const frame = idx + 1;

                    const span = document.createElement("span");
                    span.textContent = `[ ${frame} ]`;

                    const p = document.createElement("p");
                    p.appendChild(images[idx]);

                    const div = document.createElement("div");
                    div.dataset.frame = `${frame}`;

                    div.appendChild(p);
                    div.appendChild(span);

                    // eslint-disable-next-line no-loop-func
                    div.addEventListener("click", (event) =>
                    {
                        this.clickImage(event);
                    });

                    element.appendChild(div);
                }

                element.style.display = "";
            });
    }

    /**
     * @description フレームのイメージを押下してフレーム番号を適用
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    clickImage (event)
    {
        // 他のイベントを中止
        event.stopPropagation();

        const element = document
            .getElementById(
                `loop-${this._$frameTarget}-frame`
            );

        this.save();

        element.focus();
        element.value = event.currentTarget.dataset.frame;
        element.blur();

        this._$saved = false;
    }

    /**
     * @description ループタイプの更新
     *
     * @param  {number} [type=0]
     * @return {void}
     * @method
     * @public
     */
    updateLoopType (type = 0)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return ;
        }

        const element = activeElements[0];

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(
            element.dataset.layerId | 0
        );

        const character = layer.getCharacter(
            element.dataset.characterId | 0
        );

        if (!character) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;
        const range = character.getRange(frame);

        let place = character.getPlace(range.startFrame);
        if (place.loop.type === type) {
            return ;
        }

        // ループタイプを更新してキャッシュを削除
        place.loop.type   = type;
        character.dispose();

        // 再描画
        this.reloadScreen();
    }
}

Util.$loopController = new LoopController();
