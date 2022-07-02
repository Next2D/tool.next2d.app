/**
 * @class
 */
class Tools
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        Util.$readEnd++;
        if (document.readyState === "loading") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }

        /**
         * @description 選択中のツールオブジェクト
         * @type {Tool}
         * @default null
         * @private
         */
        this._$activeTool = null;

        /**
         * @description Toolクラス
         * @type {Map}
         * @private
         */
        this._$tools = new Map();

        /**
         * @description Toolクラス
         * @type {Map}
         * @private
         */
        this._$externalTools = new Map();
    }

    /**
     * @description 初回起動設定
     *
     * @return {void}
     * @public
     */
    initialize ()
    {
        // コントラクターでセットしたイベントを削除
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        // ツールの初期起動
        this.initializeTools();

        // データの読込・保存
        this.initializeData();

        // ユーザー設定系の初期化
        this.initializeUserSetting();

        // end
        Util.$initializeEnd();
        this._$handler = null;
    }

    /**
     * @description 拡張ツールのクラスを登録する関数
     *
     * @param  {string} name
     * @param  {object} tool
     * @return {void}
     * @method
     * @public
     */
    setTool (name, tool)
    {
        this._$externalTools.set(name, tool);
    }

    /**
     * @description 拡張ツールの名前から取得
     *
     * @param  {string} name
     * @return {Tool|null}
     * @method
     * @public
     */
    getTool (name)
    {
        return this._$externalTools.has(name)
            ? this._$externalTools.get(name)
            : null;
    }

    /**
     * @description 名前からデフォルトToolクラスを取得
     *
     * @param  {string} name
     * @return {Tool}
     * @method
     * @public
     */
    getDefaultTool (name)
    {
        return this._$tools.get(name);
    }

    /**
     * @description 現在選択されているToolクラスを返します。
     *
     * @return {Tool}
     * @public
     */
    get activeTool ()
    {
        return this._$activeTool;
    }

    /**
     * @description 選択したToolクラスをセットします。
     *
     * @param  {Tool} tool
     * @return {void}
     * @public
     */
    set activeTool (tool)
    {
        this._$activeTool = tool;
    }

    /**
     * @description ツールの初期起動関数。
     *              イベント登録・ユーザー保存データをセット
     *
     * @return {void}
     * @method
     * @public
     */
    initializeTools ()
    {
        // デフォルトツールクラス
        const defaultTools = [
            ArrowTool,
            TransformTool,
            RectangleTool,
            CircleTool,
            RoundRectTool,
            PenTool,
            BucketTool,
            TextTool,
            ZoomTool,
            HandTool
        ];

        // デフォルトツールを起動して、Mapに格納
        for (let idx = 0; idx < defaultTools.length; ++idx) {
            const DefaultToolClass = defaultTools[idx];
            const tool = new DefaultToolClass();
            this._$tools.set(tool.name, tool);
        }

        // 塗りのカラーElementのイベントと初期値をセット
        const fillColor = document.getElementById("fill-color");
        if (fillColor) {

            fillColor.value = localStorage
                .getItem(`${Util.PREFIX}@${fillColor.id}`) || Util.TOOLS_FILL_DEFAULT_COLOR;

            fillColor
                .addEventListener("change", (event) =>
                {
                    const element = event.target;

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@${element.id}`,
                            event.target.value
                        );
                });
        }

        // 線のカラーElementのイベントと初期値をセット
        const strokeColor = document.getElementById("stroke-color");
        if (strokeColor) {

            strokeColor.value = localStorage
                .getItem(`${Util.PREFIX}@${strokeColor.id}`) || Util.TOOLS_STROKE_DEFAULT_COLOR;

            strokeColor
                .addEventListener("change", (event) =>
                {
                    const element = event.target;

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@${element.id}`,
                            element.value
                        );
                });
        }

        // 線の太さのElementのイベントと初期値をセット
        const strokeSize = document.getElementById("stroke-size");
        if (strokeSize) {

            strokeSize.value = localStorage
                .getItem(`${Util.PREFIX}@${strokeSize.id}`) || Util.STROKE_MIN_SIZE;

            strokeSize
                .addEventListener("focusout", (event) =>
                {
                    const element = event.target;

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@${element.id}`,
                            element.value
                        );
                });
        }

        const element = document.getElementById("tools");
        if (element) {
            element
                .addEventListener("mousemove", (event) =>
                {
                    // 親のイベントを中止する
                    event.stopPropagation();

                    const activeTool = this.activeTool;
                    if (activeTool) {
                        event.tools = true;
                        activeTool.dispatchEvent(
                            EventType.MOUSE_MOVE,
                            event
                        );
                    }
                });

            element
                .addEventListener("mouseout", (event) =>
                {
                    Util.$setCursor("auto");

                    // 親のイベントを中止する
                    event.stopPropagation();
                });
        }
    }

    /**
     * @return {object}
     * @public
     */
    getUserPublishSetting ()
    {
        const object = localStorage
            .getItem(`${Util.PREFIX}@user-publish-setting`);

        if (object) {
            return JSON.parse(object);
        }

        return {
            "layer": false,
            "type": "zlib"
        };
    }

    /**
     * @return {void}
     * @public
     */
    initializeUserSetting ()
    {
        const toolsSetting = document
            .getElementById("tools-setting");

        if (toolsSetting) {
            toolsSetting
                .addEventListener("click", (event) =>
                {
                    const element = document.getElementById("user-setting");

                    element.style.display = "";
                    element.style.left = `${event.pageX + 30}px`;
                    element.style.top  = `${event.pageY - element.clientHeight}px`;

                    element.setAttribute("class", "fadeIn");

                    Util.$endMenu("user-setting");
                });
        }

        const object = this.getUserPublishSetting();

        const layerElement = document
            .getElementById("publish-layer-setting");

        if (layerElement) {
            layerElement
                .children[object.layer ? 1 : 0]
                .selected = true;

            layerElement
                .addEventListener("change", (event) =>
                {
                    const object = this.getUserPublishSetting();
                    object.layer = event.target.value === "1";

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@user-publish-setting`,
                            JSON.stringify(object)
                        );

                });
        }

        const typeElement = document
            .getElementById("publish-type-setting");

        if (typeElement) {
            for (let idx = 0; idx < typeElement.children.length; ++idx) {

                const node = typeElement.children[idx];
                if (object.type !== node.value) {
                    continue;
                }

                node.selected = true;
                break;
            }

            typeElement
                .addEventListener("change", (event) =>
                {
                    const object = this.getUserPublishSetting();
                    object.type  = event.target.value;

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@user-publish-setting`,
                            JSON.stringify(object)
                        );

                });
        }

        const modalElement = document
            .getElementById("modal-setting");

        if (modalElement) {

            if ("modal" in object) {
                modalElement.children[object.modal ? 0 : 1].selected = true;
            }

            modalElement
                .addEventListener("change", (event) =>
                {
                    const object = this.getUserPublishSetting();
                    object.modal = event.target.value === "1";

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@user-publish-setting`,
                            JSON.stringify(object)
                        );

                });
        }
    }

    /**
     * @return {void}
     * @public
     */
    initializeData ()
    {
        // ファイル読み込み
        const loadElement = document
            .getElementById("tools-load");

        if (loadElement) {
            loadElement
                .addEventListener("click", (event) =>
                {
                    const input = document
                        .getElementById("tools-load-file-input");
                    input.click();

                    event.preventDefault();
                });
        }

        const fileInput = document
            .getElementById("tools-load-file-input");

        if (fileInput) {
            fileInput
                .addEventListener("change", (event) =>
                {
                    const files = event.target.files;
                    for (let idx = 0; idx < files.length; ++idx) {
                        this.loadSaveFile(files[idx]);
                    }

                    // reset
                    event.target.value = "";
                });
        }

        const saveElement = document
            .getElementById("tools-save");

        if (saveElement) {
            saveElement
                .addEventListener("click", () =>
                {
                    const postData = {
                        "object": Util.$currentWorkSpace().toJSON(),
                        "type": "n2d"
                    };

                    if (Util.$zlibWorkerActive) {

                        Util.$zlibQueues.push(postData);

                    } else {

                        Util.$zlibWorkerActive = true;
                        Util.$zlibWorker.postMessage(postData);

                    }

                });
        }

        const exportElement = document
            .getElementById("tools-export");

        if (exportElement) {
            exportElement
                .addEventListener("click", () =>
                {
                    // ダウンロードリンクを生成
                    const anchor = document.getElementById("save-anchor");

                    if (anchor.href) {
                        URL.revokeObjectURL(anchor.href);
                    }

                    const type = document
                        .getElementById("publish-type-setting")
                        .value;

                    switch (type) {

                        case "json":
                            anchor.download = `${Util.$currentWorkSpace().name}.json`;
                            anchor.href     = URL.createObjectURL(new Blob(
                                [Publish.toJSON()],
                                { "type" : "application/json" }
                            ));
                            anchor.click();
                            break;

                        case "zlib":
                            Publish.toZlib();
                            break;

                        case "webm":
                            Publish.toWebM();
                            break;

                        case "gif-loop":
                            Publish.toGIF();
                            break;

                        case "gif":
                            Publish.toGIF(-1);
                            break;

                        case "png":
                            Publish.toPng();
                            break;

                        case "apng-loop":
                            Publish.toApng(true);
                            break;

                        case "apng":
                            Publish.toApng(false);
                            break;

                        case "custom":
                            if ("CustomPublish" in window) {
                                window
                                    .CustomPublish
                                    .execute(Publish.toObject());
                            }
                            break;

                    }

                });
        }

        const languageElement = document
            .getElementById("language-setting");

        if (languageElement) {

            const language = localStorage
                .getItem(`${Util.PREFIX}@language-setting`);

            if (language) {
                const children = languageElement.children;
                for (let idx = 0; idx < children.length; ++idx) {
                    const node = children[idx];
                    if (node.value === language) {
                        node.selected = true;
                        break;
                    }
                }
            }

            languageElement
                .addEventListener("change", (event) =>
                {
                    const language = event.target.value;

                    const LanguageClass = Util.$languages.get(language);
                    Util.$currentLanguage = new LanguageClass();

                    localStorage
                        .setItem(`${Util.PREFIX}@language-setting`, language);

                    Util.$addModalEvent(document);
                });
        }
    }

    /**
     * @description n2dファイルの読み込み処理、zipデータ解凍
     *
     * @param  {File} file
     * @return {void}
     * @public
     */
    loadSaveFile (file)
    {
        file
            .arrayBuffer()
            .then((buffer) =>
            {
                const uint8Array = new Uint8Array(buffer);
                Util.$unZlibWorker.postMessage({
                    "buffer": uint8Array,
                    "type": "n2d"
                }, [uint8Array.buffer]);
            });
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    reset ()
    {
        const activeTool = this.activeTool;
        if (activeTool) {
            activeTool.dispatchEvent(EventType.END);
        }

        const tool = this.getDefaultTool("arrow");
        tool.dispatchEvent(EventType.START);
        this.activeTool = tool;
    }
}

Util.$tools = new Tools();
