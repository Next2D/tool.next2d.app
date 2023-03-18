/**
 * @class
 * @memberOf view.tool
 */
class ShortcutSetting
{

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {array}
         * @private
         */
        this._$names = [
            "screen",
            "timeline",
            "library"
        ];

        /**
         * @type {object}
         * @private
         */
        this._$default = {
            "screen": [
                {
                    "key": "v",
                    "text": "V",
                    "css": "tools-arrow",
                    "description": "{{選択ツール}}"
                },
                {
                    "key": "q",
                    "text": "Q",
                    "css": "tools-arrow-transform",
                    "description": "{{自由変形ツール}}"
                },
                {
                    "key": "a",
                    "text": "A",
                    "css": "tools-transform",
                    "description": "{{Shape変形ツール}}"
                },
                {
                    "key": "p",
                    "text": "P",
                    "css": "tools-pen",
                    "description": "{{ペンツール}}"
                },
                {
                    "key": "k",
                    "text": "K",
                    "css": "tools-bucket",
                    "description": "{{バケツツール}}"
                },
                {
                    "key": "r",
                    "text": "R",
                    "css": "tools-rectangle",
                    "description": "{{矩形ツール}}"
                },
                {
                    "key": "o",
                    "text": "O",
                    "css": "tools-circle",
                    "description": "{{楕円ツール}}"
                },
                {
                    "key": "rShift",
                    "text": "Shift + R",
                    "css": "tools-round-rect",
                    "description": "{{角丸矩形ツール}}"
                },
                {
                    "key": "t",
                    "text": "T",
                    "css": "tools-text",
                    "description": "{{テキストツール}}"
                },
                {
                    "key": "z",
                    "text": "Z",
                    "css": "tools-zoom",
                    "description": "{{ズームツール}}"
                },
                {
                    "key": "rCtrl",
                    "text": "Ctrl + R",
                    "css": "tools-load",
                    "description": "{{プロジェクトデータの読込}}"
                },
                {
                    "key": "sShiftCtrl",
                    "text": "Ctrl + Shift + S",
                    "css": "tools-save",
                    "description": "{{プロジェクトデータを保存}}"
                },
                {
                    "key": "EnterShiftCtrl",
                    "text": "Ctrl + Shift + Enter",
                    "css": "tools-export",
                    "description": "{{書き出し}}"
                },
                {
                    "key": "s",
                    "text": "S",
                    "css": "tools-setting",
                    "description": "{{設定}}"
                },
                {
                    "key": "ArrowUpShiftCtrl",
                    "text": "Ctrl + Shift + ArrowUp",
                    "css": "screen-front",
                    "description": "{{最前面}}"
                },
                {
                    "key": "ArrowUpCtrl",
                    "text": "Ctrl + ArrowUp",
                    "css": "screen-front-one",
                    "description": "{{ひとつ前面へ}}"
                },
                {
                    "key": "ArrowDownCtrl",
                    "text": "Ctrl + ArrowDown",
                    "css": "screen-menu-bottom",
                    "description": "{{ひとつ背面へ}}"
                },
                {
                    "key": "ArrowDownShiftCtrl",
                    "text": "Ctrl + Shift + ArrowDown",
                    "css": "screen-back",
                    "description": "{{最背面}}"
                },
                {
                    "key": "1",
                    "text": "1",
                    "css": "screen-position-left",
                    "description": "{{左揃え}}"
                },
                {
                    "key": "2",
                    "text": "2",
                    "css": "screen-position-center",
                    "description": "{{中央揃え(水平方向)}}"
                },
                {
                    "key": "3",
                    "text": "3",
                    "css": "screen-position-right",
                    "description": "{{右揃え}}"
                },
                {
                    "key": "4",
                    "text": "4",
                    "css": "screen-position-top",
                    "description": "{{上揃え}}"
                },
                {
                    "key": "5",
                    "text": "5",
                    "css": "screen-position-middle",
                    "description": "{{中央揃え(垂直方向)}}"
                },
                {
                    "key": "6",
                    "text": "6",
                    "css": "screen-position-bottom",
                    "description": "{{下揃え}}"
                },
                {
                    "key": "!Shift",
                    "text": "Shift + 1",
                    "css": "stage-position-left",
                    "description": "{{ステージ左揃え}}"
                },
                {
                    "key": "\"Shift",
                    "text": "Shift + 2",
                    "css": "stage-position-center",
                    "description": "{{ステージ中央揃え(水平方向)}}"
                },
                {
                    "key": "#Shift",
                    "text": "Shift + 3",
                    "css": "stage-position-right",
                    "description": "{{ステージ右揃え}}"
                },
                {
                    "key": "$Shift",
                    "text": "Shift + 4",
                    "css": "stage-position-top",
                    "description": "{{ステージ上揃え}}"
                },
                {
                    "key": "%Shift",
                    "text": "Shift + 5",
                    "css": "stage-position-middle",
                    "description": "{{ステージ中央揃え(垂直方向)}}"
                },
                {
                    "key": "&Shift",
                    "text": "Shift + 6",
                    "css": "stage-position-bottom",
                    "description": "{{ステージ下揃え}}"
                },
                {
                    "key": "dCtrl",
                    "text": "Ctrl + D",
                    "css": "screen-distribute-to-layers",
                    "description": "{{レイヤーに配分}}"
                },
                {
                    "key": "kCtrl",
                    "text": "Ctrl + K",
                    "css": "screen-distribute-to-keyframes",
                    "description": "{{キーフレームに配分}}"
                },
                {
                    "key": "iCtrl",
                    "text": "Ctrl + I",
                    "css": "screen-integrating-paths",
                    "description": "{{パスの結合}}"
                },
                {
                    "key": "pCtrl",
                    "text": "Ctrl + P",
                    "css": "screen-add-tween-curve-pointer",
                    "description": "{{カーブポインターの追加}}"
                },
                {
                    "key": "pShiftCtrl",
                    "text": "Ctrl + Shift + P",
                    "css": "screen-delete-tween-curve-pointer",
                    "description": "{{カーブポインターの削除}}"
                },
                {
                    "key": "mShift",
                    "text": "Shift + M",
                    "css": "screen-change-movie-clip",
                    "description": "{{MovieClipに変換}}"
                },
                {
                    "key": "rShiftCtrl",
                    "text": "Ctrl + Shift + R",
                    "css": "screen-ruler",
                    "description": "{{定規}}"
                },
                {
                    "key": "e",
                    "text": "E",
                    "css": "screen-change-scene",
                    "description": "{{MovieClipを編集}}"
                },
                {
                    "key": "eShift",
                    "text": "Shift + E",
                    "css": "screen-move-scene",
                    "description": "{{親の階層へ移動}}"
                }
            ],
            "timeline": [
                {
                    "key": "nShift",
                    "text": "Shift + N",
                    "css": "timeline-layer-normal",
                    "description": "{{通常レイヤー}}"
                },
                {
                    "key": "mShift",
                    "text": "Shift + M",
                    "css": "timeline-layer-mask",
                    "description": "{{マスクレイヤー}}"
                },
                {
                    "key": "gShift",
                    "text": "Shift + G",
                    "css": "timeline-layer-guide",
                    "description": "{{ガイドレイヤー}}"
                },
                {
                    "key": ";Ctrl",
                    "text": "Ctrl + +",
                    "css": "timeline-layer-add",
                    "description": "{{レイヤーを追加}}"
                },
                {
                    "key": "BackspaceCtrl",
                    "text": "Ctrl + Backspace",
                    "css": "timeline-layer-trash",
                    "description": "{{レイヤーを削除}}"
                },
                {
                    "key": "hShift",
                    "text": "Shift + H",
                    "css": "timeline-layer-light-all",
                    "description": "{{全てのレイヤーをハイライト}}"
                },
                {
                    "key": "dShift",
                    "text": "Shift + D",
                    "css": "timeline-layer-disable-all",
                    "description": "{{全てのレイヤーを非表示}}"
                },
                {
                    "key": "lShift",
                    "text": "Shift + L",
                    "css": "timeline-layer-lock-all",
                    "description": "{{全てのレイヤーをロック}}"
                },
                {
                    "key": "m",
                    "text": "M",
                    "css": "context-menu-tween-add",
                    "description": "{{モーショントゥイーンの追加}}"
                },
                {
                    "key": "mCtrl",
                    "text": "Ctrl + M",
                    "css": "context-menu-tween-delete",
                    "description": "{{モーショントゥイーンの削除}}"
                },
                {
                    "key": "s",
                    "text": "S",
                    "css": "timeline-script-add",
                    "description": "{{スクリプトを追加}}"
                },
                {
                    "key": "k",
                    "text": "K",
                    "css": "timeline-key-add",
                    "description": "{{キーフレームを追加}}"
                },
                {
                    "key": "kCtrl",
                    "text": "Ctrl + K",
                    "css": "timeline-key-delete",
                    "description": "{{キーフレームを削除}}"
                },
                {
                    "key": "e",
                    "text": "E",
                    "css": "timeline-empty-add",
                    "description": "{{空のキーフレームを追加}}"
                },
                {
                    "key": "f",
                    "text": "F",
                    "css": "timeline-frame-add",
                    "description": "{{フレームを追加}}"
                },
                {
                    "key": "fCtrl",
                    "text": "Ctrl + F",
                    "css": "timeline-frame-delete",
                    "description": "{{フレームを削除}}"
                },
                {
                    "key": "oCtrl",
                    "text": "Ctrl + O",
                    "css": "timeline-onion-skin",
                    "description": "{{オニオンスキン}}"
                },
                {
                    "key": "p",
                    "text": "P",
                    "css": "timeline-preview",
                    "description": "{{プレビューのON/OFF}}"
                },
                {
                    "key": "pCtrl",
                    "text": "Ctrl + P",
                    "css": "timeline-repeat",
                    "description": "{{ループ設定}}"
                },
                {
                    "key": "l",
                    "text": "L",
                    "css": "label-name",
                    "description": "{{フレームラベル}}"
                },
                {
                    "key": "z",
                    "text": "Z",
                    "css": "timeline-scale",
                    "description": "{{タイムライン幅の拡大・縮小}}"
                },
                {
                    "key": "lCtrl",
                    "text": "Ctrl + L",
                    "css": "context-menu-layer-clone",
                    "description": "{{レイヤーを複製}}"
                },
                {
                    "key": "ArrowLeftShiftCtrl",
                    "text": "Ctrl + Shift + ArrowLeft",
                    "css": "context-menu-first-frame",
                    "description": "{{最初のフレームに移動}}"
                },
                {
                    "key": "ArrowRightShiftCtrl",
                    "text": "Ctrl + Shift + ArrowRight",
                    "css": "context-menu-last-frame",
                    "description": "{{最後のフレームに移動}}"
                },
                {
                    "key": "cCtrl",
                    "text": "Ctrl + C",
                    "css": "context-menu-frame-copy",
                    "description": "{{フレームをコピー}}"
                },
                {
                    "key": "vCtrl",
                    "text": "Ctrl + V",
                    "css": "context-menu-frame-paste",
                    "description": "{{フレームをペースト}}"
                }
            ],
            "library": [
                {
                    "key": "mCtrl",
                    "text": "Ctrl + M",
                    "css": "library-menu-container-add",
                    "description": "{{新規MovieClip}}"
                },
                {
                    "key": "fCtrl",
                    "text": "Ctrl + F",
                    "css": "library-menu-folder-add",
                    "description": "{{新規フォルダー}}"
                },
                {
                    "key": "rCtrl",
                    "text": "Ctrl + R",
                    "css": "library-menu-file",
                    "description": "{{読み込み}}"
                },
                {
                    "key": "sShiftCtrl",
                    "text": "Ctrl + Shift + S",
                    "css": "library-menu-export",
                    "description": "{{書き出し}}"
                },
                {
                    "key": "Backspace",
                    "text": "Backspace",
                    "css": "library-menu-delete",
                    "description": "{{削除}}"
                },
                {
                    "key": "cCtrl",
                    "text": "Ctrl + C",
                    "css": "library-menu-copy",
                    "description": "{{コピー}}"
                },
                {
                    "key": "vCtrl",
                    "text": "Ctrl + V",
                    "css": "library-menu-paste",
                    "description": "{{ペースト}}"
                },
                {
                    "key": "e",
                    "text": "E",
                    "css": "library-menu-change-scene",
                    "description": "{{MovieClipを編集}}"
                },
            ]
        };

        /**
         * @type {Map}
         * @private
         */
        this._$commandMapping = new Map([
            ["screen", new Map()],
            ["timeline", new Map()],
            ["library", new Map()],
            ["global", new Map()]
        ]);

        /**
         * @type {Map}
         * @private
         */
        this._$viewMapping = new Map([
            ["screen", new Map()],
            ["timeline", new Map()],
            ["library", new Map()],
            ["global", new Map()]
        ]);

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$active = false;

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$selectNode = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$selectArea = "";

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$keydownEvent = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        Util.$readEnd++;
        if (document.readyState !== "complete") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
    }

    /**
     * @return {Map}
     */
    get commandMapping ()
    {
        return this._$commandMapping;
    }

    /**
     * @return {Map}
     */
    get viewMapping ()
    {
        return this._$viewMapping;
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
        // イベントの登録を解除して、変数を解放
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        const elementIds = [
            "shortcut-setting-screen",
            "shortcut-setting-timeline",
            "shortcut-setting-library",
            "shortcut-setting-reset",
            "shortcut-setting-save",
            "shortcut-setting-close"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            element.addEventListener("click", (event) =>
            {
                event.stopPropagation();
                event.preventDefault();

                this.executeFunction(event);
            });
        }

        // オリジナルのショートカットのマッピングを生成
        this.createShortcutMap();

        // イベント登録して、表示を更新
        for (let idx = 0; idx < this._$names.length; ++idx) {

            const name = this._$names[idx];

            const parent = document
                .getElementById(`shortcut-list-${name}`);

            if (!parent) {
                continue;
            }

            const mapping = this.viewMapping.get(name);

            const values = this._$default[name];
            for (let idx = 0; idx < values.length; ++idx) {

                const data = values[idx];

                const htmlTag = `
<div class="shortcut-item">
    <i class="${data.css}"></i>
    <div class="description">
        <span class="language" data-text="${data.description}">${Util.$currentLanguage.replace(data.description)}</span>
    </div>
    <div class="command" data-key="${data.key}" data-default-text="${data.text}">${data.text}</div>
</div>`;

                parent.insertAdjacentHTML("beforeend", htmlTag);

                const node = parent.lastElementChild;
                node.addEventListener("mousedown", (event) =>
                {
                    this.selectNode(event);
                });

                const cmdElement = node.lastElementChild;
                if (!mapping.has(cmdElement.dataset.key)) {
                    continue;
                }

                const object = mapping.get(cmdElement.dataset.key);
                cmdElement.dataset.map = object.map;
                cmdElement.textContent = object.text;
            }
        }

        // 登録用関数
        this._$keydownEvent = this.keydownEvent.bind(this);

        Util.$initializeEnd();
    }

    /**
     * @description 個別のショートカットをマッピング
     *
     * @return {void}
     * @method
     * @public
     */
    createShortcutMap ()
    {
        const data = localStorage.getItem(`${Util.PREFIX}@shortcut`);
        if (!data) {
            return ;
        }

        const object = JSON.parse(data);
        const keys = Object.keys(object);
        for (let idx = 0; idx < keys.length; ++idx) {

            const name = keys[idx];

            // リセット
            this.viewMapping.get(name).clear();
            this.commandMapping.get(name).clear();

            const values = object[name];
            for (let idx = 0; idx < values.length; ++idx) {

                const data = values[idx];

                this.viewMapping.get(name).set(data.key, {
                    "map": data.map,
                    "text": data.text
                });

                this.commandMapping.get(name).set(data.map, data.key);
            }
        }
    }

    /**
     * @description キーダウンイベントを受け取る
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    keydownEvent (event)
    {
        const element = document
            .getElementById("shortcut-setting-menu");

        if (element.classList.contains("fadeOut")) {
            Util.$useShortcutSetting = false;
            this._$active = false;
            window.removeEventListener("keydown", this._$keydownEvent);
            return ;
        }

        if (!this._$selectNode || !this._$selectArea) {
            return ;
        }

        const texts = [];
        if (Util.$shiftKey) {
            texts.push("Shift");
        }
        if (Util.$altKey) {
            texts.push("Alt");
        }
        if (Util.$ctrlKey) {
            texts.push("Ctrl");
        }

        switch (true) {

            case event.key === " ":
                texts.push(event.code);
                break;

            case event.key.length === 1:
                texts.push(event.key.toUpperCase());
                break;

            default:
                texts.push(event.key);
                break;

        }

        const cmdElement = this._$selectNode.lastElementChild;
        cmdElement.textContent = `${texts.join(" + ")}`;

        const key = Util.$generateShortcutKey(event.key, {
            "alt": Util.$altKey,
            "shift": Util.$shiftKey,
            "ctrl": Util.$ctrlKey
        });

        if (key !== cmdElement.dataset.key) {
            cmdElement.dataset.map  = key;
            cmdElement.dataset.text = cmdElement.textContent;
        } else {
            delete cmdElement.dataset.map;
            delete cmdElement.dataset.text;
        }
    }

    /**
     * @description 選択したElementをセット
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    selectNode (event)
    {
        if (this._$selectNode) {
            this
                ._$selectNode
                .classList
                .remove("shortcut-active");
        }

        this._$selectNode = event.target;

        this
            ._$selectNode
            .classList
            .add("shortcut-active");
    }

    /**
     * @description Elementのid名をキャメルケースに変換して関数を実行
     *              例) font-select => executeFontSelectがコールされる
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    executeFunction (event)
    {
        const names = event.target.id.split("-");

        let functionName = names
            .map((value) =>
            {
                return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
            })
            .join("");

        this[`execute${functionName}`](event);
    }

    /**
     * @description スクリーンエリアのショートカット情報を表示
     *
     * @return {void}
     * @method
     * @public
     */
    executeShortcutSettingScreen ()
    {
        document
            .getElementById("shortcut-setting-screen")
            .classList.add("shortcut-active");
        document
            .getElementById("shortcut-setting-timeline")
            .classList.remove("shortcut-active");
        document
            .getElementById("shortcut-setting-library")
            .classList.remove("shortcut-active");

        document
            .getElementById("shortcut-list-screen")
            .style.display = "";
        document
            .getElementById("shortcut-list-timeline")
            .style.display = "none";
        document
            .getElementById("shortcut-list-library")
            .style.display = "none";

        this._$selectArea = "screen";

        if (this._$selectNode) {
            this
                ._$selectNode
                .classList
                .remove("shortcut-active");
            this._$selectNode = null;
        }
    }

    /**
     * @description スクリーンエリアのショートカット情報を表示
     *
     * @return {void}
     * @method
     * @public
     */
    executeShortcutSettingTimeline ()
    {
        document
            .getElementById("shortcut-setting-screen")
            .classList.remove("shortcut-active");
        document
            .getElementById("shortcut-setting-timeline")
            .classList.add("shortcut-active");
        document
            .getElementById("shortcut-setting-library")
            .classList.remove("shortcut-active");

        document
            .getElementById("shortcut-list-screen")
            .style.display = "none";
        document
            .getElementById("shortcut-list-timeline")
            .style.display = "";
        document
            .getElementById("shortcut-list-library")
            .style.display = "none";

        this._$selectArea = "timeline";

        if (this._$selectNode) {
            this
                ._$selectNode
                .classList
                .remove("shortcut-active");
            this._$selectNode = null;
        }
    }

    /**
     * @description スクリーンエリアのショートカット情報を表示
     *
     * @return {void}
     * @method
     * @public
     */
    executeShortcutSettingLibrary ()
    {
        document
            .getElementById("shortcut-setting-screen")
            .classList.remove("shortcut-active");
        document
            .getElementById("shortcut-setting-timeline")
            .classList.remove("shortcut-active");
        document
            .getElementById("shortcut-setting-library")
            .classList.add("shortcut-active");

        document
            .getElementById("shortcut-list-screen")
            .style.display = "none";
        document
            .getElementById("shortcut-list-timeline")
            .style.display = "none";
        document
            .getElementById("shortcut-list-library")
            .style.display = "";

        this._$selectArea = "library";

        if (this._$selectNode) {
            this
                ._$selectNode
                .classList
                .remove("shortcut-active");
            this._$selectNode = null;
        }
    }

    /**
     * @description ショートカット情報を初期値に戻す
     *
     * @return {void}
     * @method
     * @public
     */
    executeShortcutSettingReset ()
    {
        // 初期化
        localStorage.removeItem(`${Util.PREFIX}@shortcut`);

        for (let idx = 0; idx < this._$names.length; ++idx) {

            const name = this._$names[idx];

            const children = document
                .getElementById(`shortcut-list-${name}`)
                .children;

            for (let idx = 0; idx < children.length; ++idx) {

                const node = children[idx];

                const cmdElement = node.lastElementChild;
                cmdElement.textContent = cmdElement.dataset.defaultText;
                if (!cmdElement.dataset.map) {
                    continue;
                }

                delete cmdElement.dataset.map;
                delete cmdElement.dataset.text;
            }

            this.viewMapping.get(name).clear();
            this.commandMapping.get(name).clear();
        }

        this.createShortcutMap();
    }

    /**
     * @description ショートカットの情報を保存
     *
     * @return {void}
     * @method
     * @public
     */
    executeShortcutSettingSave ()
    {
        // 初期化
        localStorage.removeItem(`${Util.PREFIX}@shortcut`);

        const object = {};
        for (let idx = 0; idx < this._$names.length; ++idx) {

            const name = this._$names[idx];

            const children = document
                .getElementById(`shortcut-list-${name}`)
                .children;

            for (let idx = 0; idx < children.length; ++idx) {

                const node = children[idx].lastElementChild;
                if (!node.dataset.map) {
                    continue;
                }

                if (!object[name]) {
                    object[name] = [];
                }

                object[name].push({
                    "key": node.dataset.key,
                    "map": node.dataset.map,
                    "text": node.textContent
                });
            }
        }

        localStorage
            .setItem(
                `${Util.PREFIX}@shortcut`,
                JSON.stringify(object)
            );

        this.createShortcutMap();
    }

    /**
     * @description ショートカットの設定画面を閉じる
     *
     * @return {void}
     * @method
     * @public
     */
    executeShortcutSettingClose ()
    {
        Util.$userSetting.show();

        if (this._$selectNode) {
            this
                ._$selectNode
                .classList
                .remove("shortcut-active");

            this._$selectNode = null;
            this._$selectArea = "";
        }
    }

    /**
     * @description 設定画面を表示
     *
     * @return {void}
     * @method
     * @public
     */
    show ()
    {
        const element = document
            .getElementById("shortcut-setting-menu");

        // 初期化
        if (this._$selectNode) {
            this
                ._$selectNode
                .classList
                .remove("shortcut-active");

            this._$selectNode = null;
            this._$selectArea = "";
        }

        this.executeShortcutSettingScreen();

        if (!this._$active) {
            Util.$useShortcutSetting = true;
            this._$active = true;
            window.addEventListener("keydown", this._$keydownEvent);
        }

        Util.$endMenu("shortcut-setting-menu");

        const userSetting = document
            .getElementById("user-setting");

        element.style.display = "";
        element.style.left    = `${userSetting.offsetLeft}px`;
        element.style.top     = `${userSetting.offsetTop}px`;

        element.setAttribute("class", "fadeIn");
    }
}

Util.$shortcutSetting = new ShortcutSetting();
