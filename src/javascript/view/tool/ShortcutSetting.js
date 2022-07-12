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

        const parentIds = [
            "shortcut-list-screen",
            "shortcut-list-timeline",
            "shortcut-list-library"
        ];

        for (let idx = 0; idx < parentIds.length; ++idx) {

            const children = document
                .getElementById(parentIds[idx])
                .children;

            for (let idx = 0; idx < children.length; ++idx) {
                const node = children[idx];
                node.addEventListener("mousedown", (event) =>
                {
                    this.selectNode(event);
                });
            }
        }

        this._$keydownEvent = this.keydownEvent.bind(this);

        Util.$initializeEnd();
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

            case event.key.length === 1:
                texts.push(event.key.toUpperCase());
                break;

            default:
                break;

        }

        this
            ._$selectNode
            .lastElementChild
            .textContent = `${texts.join(" + ")}`;

        console.log(this._$selectArea);
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

        // 初期値
        // const defaults = new Map([
        //     ["keyV", {
        //         "css": "tools-arrow",
        //         "text": "{{選択ツール}}",
        //         "command": "keyV"
        //     }]
        // ]);

        // リセット
        const children = document
            .getElementById("shortcut-list-screen")
            .children;

        for (let idx = 0; idx < children.length; ++idx) {

            const node = children[idx].lastElementChild;
            console.log(node.dataset.key);

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
        // TODO 保存処理
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
        // TODO 保存処理
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

        if (element.classList.contains("fadeIn")) {

            Util.$endMenu();

        } else {

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
}

Util.$shortcutSetting = new ShortcutSetting();
