/**
 * @class
 * @extends {BaseController}
 */
class LibraryExport extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Instance}
         * @default null
         * @private
         */
        this._$instance = null;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$xScale = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$yScale = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$frame = 1;
    }

    /**
     * @return {number}
     * @static
     */
    static get MAX_SIZE ()
    {
        return 0xfff;
    }

    /**
     * @return {number}
     * @static
     */
    static get MIN_SIZE ()
    {
        return 1;
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
            "library-menu-export",
            "library-export-hide-icon"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("mousedown", (event) =>
            {
                if (event.button) {
                    return ;
                }

                // 表示モーダルを全て終了
                Util.$endMenu();

                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                const names = event.target.id.split("-");

                let functionName = names
                    .map((value) =>
                    {
                        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
                    })
                    .join("");

                this[`execute${functionName}`](event);
            });

        }

        const inputIds = [
            "export-width",
            "export-height",
            "export-start-frame",
            "export-end-frame"
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
     * @description 書き出しの幅の設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeExportWidth (value)
    {
        value = Util.$clamp(value | 0,
            LibraryExport.MIN_SIZE,
            LibraryExport.MAX_SIZE
        );

        // xスケールの更新
        const bounds  = this._$instance.getBounds();
        const width   = Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
        this._$xScale = value / width;

        this
            .removeImage()
            .appendImage();

        return value;
    }

    /**
     * @description 書き出しの高さの設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeExportHeight (value)
    {
        value = Util.$clamp(value | 0,
            LibraryExport.MIN_SIZE,
            LibraryExport.MAX_SIZE
        );

        // xスケールの更新
        const bounds  = this._$instance.getBounds();
        const height  = Math.ceil(Math.abs(bounds.yMax - bounds.yMin));
        this._$yScale = value / height;

        this
            .removeImage()
            .appendImage();

        return value;
    }

    /**
     * @description MovieClipの書き出しの開始フレームの設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeExportStartFrame (value)
    {
        value = Util.$clamp(value | 0,
            1,
            this._$instance.totalFrame
        );

        this._$frame = value;

        // 開始フレームが最終フレーム設定を上回った補正
        const element = document
            .getElementById("export-end-frame");

        const endFrame = element.value | 0;
        if (value > endFrame) {
            element.value = `${value}`;
        }

        this
            .removeImage()
            .appendImage();

        return value;
    }

    /**
     * @description MovieClipの書き出しの終了フレームの設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeExportEndFrame (value)
    {
        value = Util.$clamp(value | 0,
            1,
            this._$instance.totalFrame
        );

        // 最終フレームが開始フレーム設定を下回った補正
        const element = document
            .getElementById("export-start-frame");

        const startFrame = element.value | 0;
        if (startFrame > value) {
            element.value = `${value}`;
            this._$frame  = value;

            this
                .removeImage()
                .appendImage();
        }

        return value;
    }

    /**
     * @description 書き出しモーダルを非表示に
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryExportHideIcon ()
    {
        Util.$endMenu();
    }

    /**
     * @description 指定したアイテムを画像として書き出す
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuExport ()
    {
        const activeInstances = Util
            .$libraryController
            .activeInstances;

        if (!activeInstances.size) {
            return ;
        }

        // 初期化
        this._$xScale = 1;
        this._$yScale = 1;
        this._$frame  = 1;

        // 書き出すアイテムの情報をセット
        const LibraryElement = activeInstances.values().next().value;

        this._$instance = Util.$currentWorkSpace().getLibrary(
            LibraryElement.dataset.libraryId | 0
        );

        const containerArea = document
            .getElementById("library-export-container-area");

        if (this._$instance.type === "container") {

            containerArea.style.display = "";

            document
                .getElementById("export-start-frame")
                .value = "1";

            document
                .getElementById("export-end-frame")
                .value = `${this._$instance.totalFrame}`;

        } else {

            containerArea.style.display = "none";

        }

        // サイズをセット
        const bounds = this._$instance.getBounds();
        const width  = Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
        const height = Math.ceil(Math.abs(bounds.yMax - bounds.yMin));

        document
            .getElementById("export-width")
            .value = `${width}`;

        document
            .getElementById("export-height")
            .value = `${height}`;

        document
            .getElementById("export-name")
            .value = `${this._$instance.name}`;

        // プレビュー画面を初期化して画像をセット
        this
            .removeImage()
            .appendImage();

        // 書き出しモーダル以外を終了
        Util.$endMenu("library-export-modal");

        // 書き出しのモーダルを表示
        const element = document
            .getElementById("library-export-modal");

        element.style.display = "";
        element.setAttribute("class", "fadeIn");
    }

    /**
     * @description プレビューのイメージを初期化
     *
     * @return {LibraryExport}
     * @method
     * @public
     */
    removeImage ()
    {
        const element = document.getElementById("library-export-image");
        if (element) {
            while (element.firstChild) {
                element.firstChild.remove();
            }
        }
        return this;
    }

    /**
     * @description プレビュー画像をセット
     *
     * @return {void}
     * @method
     * @public
     */
    appendImage ()
    {
        const bounds = this._$instance.getBounds([
            this._$xScale, 0, 0, this._$yScale, 0, 0
        ]);

        const width  = Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
        const height = Math.ceil(Math.abs(bounds.yMax - bounds.yMin));

        const currentFrame = Util.$currentFrame;
        Util.$currentFrame = this._$frame;

        document
            .getElementById("library-export-image")
            .appendChild(
                this._$instance.toImage(width, height, {
                    "frame": this._$frame,
                    "matrix": [this._$xScale, 0, 0, this._$yScale, 0, 0],
                    "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                    "blendMode": "normal",
                    "filter": []
                }));

        // reset
        Util.$currentFrame = currentFrame;
    }
}

Util.$libraryExport = new LibraryExport();
