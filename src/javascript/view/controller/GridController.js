/**
 * @class
 * @extends {BaseController}
 */
class GridController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("nine-slice");

        /**
         * @description 表示非表示の状態変数、初期値は非表示
         * @type {string}
         * @default "hide"
         * @private
         */
        this._$state = "hide";

        /**
         * @type {array}
         * @private
         */
        this._$elementIds = [
            "grid-top-left",
            "grid-top-right",
            "grid-bottom-left",
            "grid-bottom-right"
        ];

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$gridMouseMove = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$gridMouseUp = null;
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

        const inputIds = [
            "nine-slice-setting-x",
            "nine-slice-setting-y",
            "nine-slice-setting-w",
            "nine-slice-setting-h"
        ];

        for (let idx = 0; idx < inputIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(inputIds[idx])
            );
        }

        // スクリーンのグリッドElementのイベントを登録
        for (let idx = 0; idx < this._$elementIds.length; ++idx) {

            const element = document.getElementById(this._$elementIds[idx]);
            if (!element) {
                continue;
            }

            // 初期は非表示
            element.style.display = "none";
            element.addEventListener("mousedown", (event) =>
            {
                this.standbyPointer(event);
            });
        }
    }

    /**
     * @description スクリーンの変形Elementの選択時の関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    standbyPointer (event)
    {
        // 親のイベントを中止する
        event.stopPropagation();

        const activeTool = Util.$tools.activeTool;
        if (activeTool) {
            event.grid = true;
            activeTool.dispatchEvent(
                EventType.MOUSE_DOWN,
                event
            );
        }
    }

    /**
     * @description グリッドのx座標の値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeNineSliceSettingX (value)
    {
        this.updateShapeGrid (
            +value,
            +document.getElementById("nine-slice-setting-y").value,
            +document.getElementById("nine-slice-setting-w").value,
            +document.getElementById("nine-slice-setting-h").value
        );
        return +value;
    }

    /**
     * @description グリッドのy座標の値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeNineSliceSettingY (value)
    {
        this.updateShapeGrid (
            +document.getElementById("nine-slice-setting-x").value,
            +value,
            +document.getElementById("nine-slice-setting-w").value,
            +document.getElementById("nine-slice-setting-h").value
        );
        return +value;
    }

    /**
     * @description グリッドの幅の値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeNineSliceSettingW (value)
    {
        this.updateShapeGrid (
            +document.getElementById("nine-slice-setting-x").value,
            +document.getElementById("nine-slice-setting-y").value,
            +value,
            +document.getElementById("nine-slice-setting-h").value
        );
        return +value;
    }

    /**
     * @description グリッドの高さの値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeNineSliceSettingH (value)
    {
        this.updateShapeGrid (
            +document.getElementById("nine-slice-setting-x").value,
            +document.getElementById("nine-slice-setting-y").value,
            +document.getElementById("nine-slice-setting-w").value,
            +value
        );
        return +value;
    }

    /**
     * @description グリッドのElementの値を更新
     *
     * @param  {number} [x=0]
     * @param  {number} [y=0]
     * @param  {number} [w=0]
     * @param  {number} [h=0]
     * @return {void}
     * @method
     * @public
     */
    updateShapeGrid (x, y, w, h)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const instance = Util
            .$currentWorkSpace()
            .getLibrary(
                activeElements[0].dataset.libraryId | 0
            );

        switch (0) {

            case x:
            case y:
                instance._$grid = null;
                this.hide();
                break;

            default:
                instance._$grid = {
                    "x": x,
                    "y": y,
                    "w": w,
                    "h": h
                };

                this
                    .show()
                    .relocation();
                break;

        }

        instance.cacheClear();
    }

    /**
     * @description スクリーンのグリッドElementを表示
     *
     * @return {GridController}
     * @method
     * @public
     */
    show ()
    {
        if (this._$state !== "show") {
            this._$state = "show";

            for (let idx = 0; idx < this._$elementIds.length; ++idx) {

                const element = document
                    .getElementById(this._$elementIds[idx]);

                if (!element) {
                    continue;
                }

                element.style.display = "";
            }
        }

        return this;
    }

    /**
     * @description スクリーンのグリッドElementを非表示
     *
     * @return {void}
     * @method
     * @public
     */
    hide ()
    {
        if (this._$state === "hide") {
            return ;
        }

        for (let idx = 0; idx < this._$elementIds.length; ++idx) {

            const element = document
                .getElementById(this._$elementIds[idx]);

            if (!element) {
                continue;
            }

            element.style.display = "none";
        }
        this._$state = "hide";
    }

    /**
     * @description スクリーンのグリッドElementを再配置
     *
     * @return {void}
     * @method
     * @public
     */
    relocation ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return this.hide();
        }

        const target      = activeElements[0];
        const characterId = target.dataset.characterId | 0;

        const element = document
            .getElementById(`character-${characterId}`);

        if (!element) {
            return this.hide();
        }

        const workSpace = Util.$currentWorkSpace();
        const instance  = workSpace.getLibrary(
            target.dataset.libraryId | 0
        );

        if (!instance || instance.type !== InstanceType.SHAPE) {
            return this.hide();
        }

        const grid = instance._$grid;
        if (!grid) {
            return this.hide();
        }

        const layerId   = target.dataset.layerId | 0;
        const layer     = workSpace.scene.getLayer(layerId);
        const character = layer.getCharacter(
            target.dataset.characterId | 0
        );

        if (character.rotation) {
            this.hide();
            return;
        }

        const bounds = character.getBounds();

        const x = element.offsetLeft;
        const y = element.offsetTop;
        const w = character.width  - Math.abs(bounds.xMax - bounds.xMin);
        const h = character.height - Math.abs(bounds.yMax - bounds.yMin);

        const topLeft = document.getElementById("grid-top-left");
        topLeft.style.left = `${x + grid.x - 4}px`;
        topLeft.style.top  = `${y + grid.y - 4}px`;

        const topRight = document.getElementById("grid-top-right");
        topRight.style.left = `${x + grid.x + grid.w + w - 4}px`;
        topRight.style.top  = `${y + grid.y - 4}px`;

        const bottomLeft = document.getElementById("grid-bottom-left");
        bottomLeft.style.left = `${x + grid.x - 4}px`;
        bottomLeft.style.top  = `${y + grid.y + grid.h + h - 4}px`;

        const bottomRight = document.getElementById("grid-bottom-right");
        bottomRight.style.left = `${x + grid.x + grid.w + w - 4}px`;
        bottomRight.style.top  = `${y + grid.y + grid.h + h - 4}px`;
    }
}

Util.$gridController = new GridController();
