/**
 * @class
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
            ],
            "timeline": [],
            "library": []
        };

        /**
         * @type {Map}
         * @private
         */
        this._$commandMapping = new Map([
            ["screen", new Map()],
            ["timeline", new Map()],
            ["library", new Map()]
        ]);

        /**
         * @type {Map}
         * @private
         */
        this._$viewMapping = new Map([
            ["screen", new Map()],
            ["timeline", new Map()],
            ["library", new Map()]
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
        if (document.readyState === "loading") {
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

            document
                .getElementById(elementIds[idx])
                .addEventListener("click", (event) =>
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

            case event.key === "ArrowRight":
            case event.key === "ArrowLeft":
            case event.key === "ArrowUp":
            case event.key === "ArrowDown":
                texts.push(event.key);
                break;

            case event.key === " ":
                texts.push(event.code);
                break;

            case event.key.length === 1:
                texts.push(event.key.toUpperCase());
                break;

            default:
                return ;

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

Util.$defaultShortcut = new Map([
    ["screen", new Map()],
    ["timeline", new Map()],
    ["library", new Map()]
]);
