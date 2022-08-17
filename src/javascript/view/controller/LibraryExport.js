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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$lock = false;

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
        this._$currentFrame = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$startFrame = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$endFrame = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;
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
            "library-export-hide-icon",
            "library-export-size-lock",
            "library-export-execution"
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

                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                const names = event.currentTarget.id.split("-");

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
            "export-end-frame",
            "export-current-frame"
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
     * @description 書き出しの実行
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryExportExecution ()
    {
        // モーダルを終了
        Util.$endMenu();

        const ext = document
            .getElementById("library-export-file-type")
            .value;

        const name = document
            .getElementById("export-name")
            .value;

        const ratio = window.devicePixelRatio;
        if (this._$instance.type === "container") {

            const currentFrame = this._$currentFrame;

            const zip = new JSZip();
            for (let frame = this._$startFrame; this._$endFrame >= frame; ++frame) {

                this._$currentFrame = frame;

                const image   = this.getImage();

                const canvas  = document.createElement("canvas");
                canvas.width  = image.width;
                canvas.height = image.height;

                const context = canvas.getContext("2d");
                context.setTransform(1 / ratio, 0, 0, 1 / ratio, 0, 0);
                context.drawImage(image, 0, 0);

                zip.file(
                    `${name}_frame_${frame}.${ext}`,
                    canvas.toDataURL(`image/${ext}`, 1).replace(/^.*,/, ""),
                    { "base64" : true }
                );
            }

            zip
                .generateAsync({ "type" : "blob" })
                .then((content) =>
                {
                    const url = URL.createObjectURL(content);

                    const anchor    = document.createElement("a");
                    anchor.download = `${name}.zip`;
                    anchor.href     = url;
                    anchor.click();

                    URL.revokeObjectURL(url);
                });

            // reset
            this._$currentFrame = currentFrame;

        } else {

            const image   = this.getImage();
            const canvas  = document.createElement("canvas");
            canvas.width  = image.width;
            canvas.height = image.height;

            const context = canvas.getContext("2d");
            context.setTransform(1 / ratio, 0, 0, 1 / ratio, 0, 0);
            context.drawImage(image, 0, 0);

            const anchor    = document.createElement("a");
            anchor.download = `${name}.${ext}`;
            anchor.href     = canvas.toDataURL(`image/${ext}`, 1);
            anchor.click();

        }
    }

    /**
     * @description ロックのOn/Off関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeLibraryExportSizeLock (event)
    {
        // ロックのOn/Off
        this._$lock = !this._$lock;

        // 初期化
        this._$currentValue = null;

        if (!this._$lock) {
            this._$lockTarget = null;
        }

        event
            .currentTarget
            .childNodes[1]
            .setAttribute("class", this._$lock
                ? "active"
                : "disable"
            );
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
        if (this._$focus || !this._$lock) {
            return ;
        }

        this._$lockTarget = document
            .getElementById(
                event.target.id === "export-width"
                    ? "export-height"
                    : "export-width"
            );
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
        value = Util.$clamp(+value,
            LibraryExport.MIN_SIZE,
            LibraryExport.MAX_SIZE
        );

        // xスケールの更新
        this._$xScale = value / this._$width;

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
        value = Util.$clamp(+value,
            LibraryExport.MIN_SIZE,
            LibraryExport.MAX_SIZE
        );

        // yスケールの更新
        this._$yScale = value / this._$height;

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

        this._$startFrame = value;

        // 開始フレームが最終フレーム設定を上回った補正
        const element = document
            .getElementById("export-end-frame");

        const endFrame = element.value | 0;
        if (value > endFrame) {
            element.value   = `${value}`;
            this._$endFrame = value;
        }

        if (value > this._$currentFrame) {
            document
                .getElementById("export-current-frame")
                .value = `${value}`;
            this._$currentFrame = value;
        }

        // 再計算
        this.reloadMovieClip();

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
            element.value     = `${value}`;
            this._$startFrame = value;
        }

        if (this._$currentFrame > value) {
            document
                .getElementById("export-current-frame")
                .value = `${value}`;
            this._$currentFrame = value;
        }

        // 再計算
        this.reloadMovieClip();

        this
            .removeImage()
            .appendImage();

        return value;
    }

    /**
     * @description MovieClipの表示したいフレームの設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeExportCurrentFrame (value)
    {
        value = Util.$clamp(value | 0,
            this._$startFrame,
            this._$endFrame
        );

        this._$currentFrame = value;

        this
            .removeImage()
            .appendImage();

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
     * @description 指定範囲のMovieClipの表示幅を再計算
     *
     * @return {void}
     * @method
     * @public
     */
    reloadMovieClip ()
    {
        const bounds  = this.getBounds();
        this._$width  = Math.abs(bounds.xMax - bounds.xMin);
        this._$height = Math.abs(bounds.yMax - bounds.yMin);

        document
            .getElementById("export-start-frame")
            .value = `${this._$startFrame}`;

        document
            .getElementById("export-end-frame")
            .value = `${this._$endFrame}`;

        document
            .getElementById("export-width")
            .value = `${Math.ceil(this._$width)}`;

        document
            .getElementById("export-height")
            .value = `${Math.ceil(this._$height)}`;
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

        // 書き出すアイテムの情報をセット
        const LibraryElement = activeInstances.values().next().value;

        this._$instance = Util.$currentWorkSpace().getLibrary(
            LibraryElement.dataset.libraryId | 0
        );

        // 初期化
        this._$lock   = false;
        this._$xScale = 1;
        this._$yScale = 1;

        document
            .getElementById("library-export-size-lock")
            .childNodes[1]
            .setAttribute("class", "disable");

        const containerArea = document
            .getElementById("library-export-container-area");

        if (this._$instance.type === "container") {

            this._$currentFrame = 1;
            this._$startFrame   = 1;
            this._$endFrame     = this._$instance.totalFrame;

            this.reloadMovieClip();

            // 書き出し項目を表示
            containerArea.style.display = "";

        } else {

            containerArea.style.display = "none";

            const bounds = this._$instance.getBounds();
            this._$width  = Math.abs(bounds.xMax - bounds.xMin);
            this._$height = Math.abs(bounds.yMax - bounds.yMin);

            // サイズをセット
            document
                .getElementById("export-width")
                .value = `${Math.ceil(this._$width)}`;

            document
                .getElementById("export-height")
                .value = `${Math.ceil(this._$height)}`;
        }

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
     * @description 表示領域を返す
     *
     * @return {object}
     * @method
     * @public
     */
    getBounds ()
    {
        const matrix = [1, 0, 0, 1, 0, 0];

        const place = {
            "frame": 1,
            "matrix": matrix,
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "loop": Util.$getDefaultLoopConfig()
        };

        const range = {
            "startFrame": 1,
            "endFrame": this._$instance.totalFrame + 1
        };

        const currentFrame = Util.$currentFrame;

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;
        for (let frame = this._$startFrame; this._$endFrame >= frame; ++frame) {

            place.frame = Util.$currentFrame = frame;

            const bounds = this._$instance.getBounds(matrix, place, range);

            xMin = Math.min(bounds.xMin, xMin);
            xMax = Math.max(bounds.xMax, xMax);
            yMin = Math.min(bounds.yMin, yMin);
            yMax = Math.max(bounds.yMax, yMax);
        }

        // reset
        Util.$currentFrame = currentFrame;

        return {
            "xMin": xMin,
            "xMax": xMax,
            "yMin": yMin,
            "yMax": yMax
        };
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
        document
            .getElementById("library-export-image")
            .appendChild(this.getImage());
    }

    /**
     * @description ImageElementを生成
     *
     * @return {HTMLImageElement}
     * @method
     * @public
     */
    getImage ()
    {
        const currentFrame = Util.$currentFrame;
        const zoomScale    = Util.$zoomScale;

        let xScale = 1;
        if (this._$width * this._$xScale > 450) {
            xScale = 450 / (this._$width * this._$xScale);
        }

        let yScale = 1;
        if (this._$height * this._$yScale > 450) {
            yScale = 450 / (this._$height * this._$yScale);
        }

        const scale = Math.min(xScale, yScale);

        Util.$currentFrame = this._$currentFrame;
        Util.$zoomScale    = 1;

        const range = this._$instance.type === "container"
            ? {
                "startFrame": 1,
                "endFrame": this._$instance.totalFrame + 1
            }
            : null;

        const place = {
            "frame": this._$currentFrame,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "loop": Util.$getDefaultLoopConfig()
        };

        const bounds = this.getBounds();

        const instanceBounds = this
            ._$instance
            .getBounds([1, 0, 0, 1, 0, 0], place, range);

        place.matrix[0] = this._$xScale * scale;
        place.matrix[3] = this._$yScale * scale;

        const image = this._$instance.toImage(
            Math.ceil(this._$width  * this._$xScale * scale),
            Math.ceil(this._$height * this._$yScale * scale),
            place, range,
            -bounds.xMin + instanceBounds.xMin,
            -bounds.yMin + instanceBounds.yMin
        );

        // reset
        Util.$zoomScale    = zoomScale;
        Util.$currentFrame = currentFrame;

        return image;
    }
}

Util.$libraryExport = new LibraryExport();
