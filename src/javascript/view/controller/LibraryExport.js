/**
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
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
     * @return {number}
     * @static
     */
    static get DEFAULT_SIZE ()
    {
        return 450;
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
     * @description Input終了後に再描画しない
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    finishInput (event)
    {
        super.finishInput(event, false);
    }

    /**
     * @description マウス移動時の処理で再描画させない
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseMove (event)
    {
        super.mouseMove(event, false);
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

        switch (this._$instance.type) {

            case InstanceType.MOVIE_CLIP:
                {
                    const promises = [];
                    const zip = new JSZip();
                    for (let frame = this._$startFrame;
                        this._$endFrame >= frame;
                        ++frame
                    ) {

                        promises.push(this
                            .getCanvas(frame)
                            // eslint-disable-next-line no-loop-func
                            .then((canvas) =>
                            {
                                zip.file(
                                    `${name}_frame_${frame}.${ext}`,
                                    canvas.toDataURL(`image/${ext}`, 1).replace(/^.*,/, ""),
                                    { "base64" : true }
                                );

                                Util.$poolCanvas(canvas);
                            }));
                    }

                    Promise
                        .all(promises)
                        .then(() =>
                        {
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
                        });
                }
                break;

            case InstanceType.VIDEO:
                {
                    const names = name.split(".");
                    if (names[names.length - 1] === "mp4") {
                        names.pop();
                    }

                    const anchor = document.createElement("a");

                    anchor.download = `${names.join(".")}.mp4`;
                    anchor.href = URL.createObjectURL(new Blob(
                        [new Uint8Array(this._$instance._$buffer)],
                        { "type": "video/mp4" }
                    ));

                    anchor.click();
                }
                break;

            case InstanceType.SOUND:
                {
                    const names = name.split(".");
                    if (names[names.length - 1] === "mp3") {
                        names.pop();
                    }

                    const anchor = document.createElement("a");

                    anchor.download = `${names.join(".")}.mp3`;
                    anchor.href = URL.createObjectURL(new Blob(
                        [new Uint8Array(this._$instance._$buffer)],
                        { "type": "audio/mp3" }
                    ));

                    anchor.click();
                }
                break;

            default:
                this
                    .getCanvas()
                    .then((canvas) =>
                    {
                        const anchor    = document.createElement("a");
                        anchor.download = `${name}.${ext}`;
                        anchor.href     = canvas.toDataURL(`image/${ext}`, 1);
                        anchor.click();

                        Util.$poolCanvas(canvas);
                    });
                break;
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

        event
            .currentTarget
            .childNodes[1]
            .setAttribute("class", this._$lock
                ? "active"
                : "disable"
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
            LibraryExport.MAX_SIZE,
            1
        );

        // xスケールの更新
        const xScale = value / this._$width;

        // ロック中であれば高さも更新
        if (this._$lock) {

            this._$yScale += xScale - this._$xScale;

            document
                .getElementById("export-height")
                .value = `${Math.ceil(this._$height * this._$yScale)}`;
        }

        this._$xScale = xScale;
        this.appendImage();

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
            LibraryExport.MAX_SIZE,
            1
        );

        // yスケールの更新
        const yScale = value / this._$height;

        if (this._$lock) {
            this._$xScale += yScale - this._$yScale;

            document
                .getElementById("export-width")
                .value = `${Math.ceil(this._$width * this._$xScale)}`;
        }

        this._$yScale = yScale;
        this.appendImage();

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

        this.appendImage();

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

        this._$endFrame = value;

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

        this.appendImage();

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

        this.appendImage();

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

        this._$instance = Util
            .$currentWorkSpace()
            .getLibrary(
                LibraryElement.dataset.libraryId | 0
            );

        if (this._$instance.type === InstanceType.FOLDER) {
            Util.$endMenu();
            return ;
        }

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

        const sizeArea = document
            .getElementById("library-export-size-area");

        const fileArea = document
            .getElementById("library-export-file-area");

        switch (this._$instance.type) {

            case InstanceType.MOVIE_CLIP:
                this._$currentFrame = 1;
                this._$startFrame   = 1;
                this._$endFrame     = this._$instance.totalFrame;

                // 書き出し項目のを表示設定
                containerArea.style.display = "";
                sizeArea.style.display      = "";
                fileArea.style.display      = "";

                this.reloadMovieClip();
                break;

            case InstanceType.VIDEO:
            case InstanceType.SOUND:
                // 書き出し項目のを表示設定
                containerArea.style.display = "none";
                sizeArea.style.display      = "none";
                fileArea.style.display      = "none";
                break;

            default:
                {
                    // 書き出し項目のを表示設定
                    containerArea.style.display = "none";
                    sizeArea.style.display      = "";
                    fileArea.style.display      = "";

                    const bounds = this._$instance.getBounds();
                    this._$width  = Math.abs(bounds.xMax - bounds.xMin);
                    this._$height = Math.abs(bounds.yMax - bounds.yMin);

                    // サイズをセット
                    document
                        .getElementById("export-width")
                        .value  = `${Math.ceil(this._$width)}`;

                    document
                        .getElementById("export-height")
                        .value = `${Math.ceil(this._$height)}`;
                }
                break;

        }

        document
            .getElementById("export-name")
            .value = `${this._$instance.name}`;

        // プレビュー画面を初期化して画像をセット
        this.appendImage();

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

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;
        for (let frame = this._$startFrame; this._$endFrame >= frame; ++frame) {

            const bounds = this._$instance.getBounds(matrix, frame);

            xMin = Math.min(bounds.xMin, xMin);
            xMax = Math.max(bounds.xMax, xMax);
            yMin = Math.min(bounds.yMin, yMin);
            yMax = Math.max(bounds.yMax, yMax);
        }

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
     * @return {void}
     * @method
     * @public
     */
    removeImage ()
    {
        const element = document.getElementById("library-export-image");
        if (element) {
            while (element.firstChild) {
                const node = element.firstChild;
                Util.$poolCanvas(node);
                node.remove();
            }
        }
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
        switch (this._$instance.type) {

            case InstanceType.VIDEO:
            case InstanceType.SOUND:
                this
                    ._$instance
                    .getPreview()
                    .then((element) =>
                    {
                        this.removeImage();
                        document
                            .getElementById("library-export-image")
                            .appendChild(element);
                    });
                break;

            default:
                this
                    .getCanvas(this._$currentFrame, true)
                    .then((canvas) =>
                    {
                        const ratio = window.devicePixelRatio;
                        canvas.style.width  = `${canvas.width  / ratio}px`;
                        canvas.style.height = `${canvas.height / ratio}px`;

                        this.removeImage();
                        document
                            .getElementById("library-export-image")
                            .appendChild(canvas);
                    });
                break;

        }
    }

    /**
     * @description Elementを生成
     *
     * @param  {number} frame
     * @param  {boolean} [preview=false]
     * @return {Promise}
     * @method
     * @public
     */
    getCanvas (frame = 1, preview = false)
    {
        const zoomScale = Util.$zoomScale;
        Util.$zoomScale = 1;

        const bounds = this
            ._$instance
            .getBounds([1,0,0,1,0,0], frame);

        // size
        let width  = Math.abs(bounds.xMax - bounds.xMin);
        let height = Math.abs(bounds.yMax - bounds.yMin);
        if (!width || !height) {
            return new Image();
        }

        let xScale = this._$xScale;
        let adjScaleX = 0;
        if (preview && this._$width * this._$xScale > LibraryExport.DEFAULT_SIZE) {
            adjScaleX = LibraryExport.DEFAULT_SIZE / (this._$width * this._$xScale);
        }

        let yScale = this._$yScale;
        let adjScaleY = 0;
        if (preview && this._$height * this._$yScale > LibraryExport.DEFAULT_SIZE) {
            adjScaleY = LibraryExport.DEFAULT_SIZE / (this._$height * this._$yScale);
        }

        if (adjScaleX) {
            xScale *= adjScaleX;
            yScale *= adjScaleX;
        }

        if (adjScaleY) {
            xScale *= adjScaleY;
            yScale *= adjScaleY;
        }

        return this
            ._$instance
            .draw(
                Util.$getCanvas(),
                Math.ceil(width * xScale),
                Math.ceil(height * yScale),
                {
                    "frame": 1,
                    "matrix": [xScale, 0, 0, yScale, 0, 0],
                    "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                    "blendMode": "normal",
                    "filter": []
                },
                frame
            )
            .then((canvas) =>
            {
                // reset
                Util.$zoomScale = zoomScale;

                return Promise.resolve(canvas);
            });
    }
}

Util.$libraryExport = new LibraryExport();
