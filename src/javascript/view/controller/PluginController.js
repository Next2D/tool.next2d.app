/**
 * @class
 * @memberOf view.controller
 */
class PluginController
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
        this._$saved = false;

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$selectElement = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$deleteCommand = null;

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

        this._$deleteCommand = this.deleteCommand.bind(this);

        const element = document.getElementById("plugin-list-box");
        if (element) {

            element.addEventListener("mouseleave", () =>
            {
                this.mouseleave();
            });

            element.addEventListener("dragover", (event) =>
            {
                event.preventDefault();
            });

            element.addEventListener("drop", (event) =>
            {
                this.dropElement(event);
            });
        }

        // 終了コール
        Util.$initializeEnd();
    }

    /**
     * @description 選択したElementを解放
     *
     * @param  {DragEvent} event
     * @return {void}
     * @method
     * @public
     */
    dropElement (event)
    {
        this.save();

        event.preventDefault();

        const workSpace = Util.$currentWorkSpace();

        const promises = [];

        const files = event.dataTransfer.files;
        for (let idx = 0; idx < files.length; ++idx) {

            const file = files[idx];

            promises.push(file
                .text()
                .then((src) =>
                {
                    // 上書き
                    workSpace._$plugins.set(file.name, {
                        "name": file.name,
                        "src": src
                    });
                }));

        }

        Promise
            .all(promises)
            .then(() =>
            {
                this.reload(
                    Array.from(Util.$currentWorkSpace()._$plugins.values())
                );

                this._$saved = false;
            });
    }

    /**
     * @description 選択したElementを解放
     *
     * @return {void}
     * @method
     * @public
     */
    mouseleave ()
    {
        if (this._$selectElement) {
            this
                ._$selectElement
                .classList
                .remove("active");
        }

        window
            .removeEventListener("keydown", this._$deleteCommand);

        this._$selectElement = null;
    }

    /**
     * @description プラグインデータを追加
     *
     * @param  {array} plugins
     * @return {void}
     * @method
     * @public
     */
    reload (plugins)
    {
        // elementを初期化
        const elementIds = [
            "plugin-list-box",
            "plugin-tools",
            "plugin-menu"
        ];

        // プラグインで追加されたelementを初期化
        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            while (element.children.length) {
                element.children[0].remove();
            }

        }

        const scripts = document.getElementsByTagName("script");
        for (let idx = 0; idx < scripts.length; ++idx) {

            const element = scripts[idx];
            if (!element.dataset.plugin) {
                continue;
            }

            element.remove();
        }

        for (let idx = 0; idx < plugins.length; ++idx) {

            const plugin = plugins[idx];

            const element = document.getElementById(plugin.name);
            if (element) {
                continue;
            }

            this.appendScript(plugin.name, plugin.src);
            this.appendNode(plugin.name);
        }
    }

    /**
     * @description 取り込んだscriptをhtmlに挿入する
     *
     * @param  {string} name
     * @param  {string} src
     * @return {void}
     * @method
     * @public
     */
    appendScript (name, src)
    {
        const script = document.createElement("script");
        script.dataset.plugin = "true";

        script.async = true;
        script.id    = name;
        script.type  = "text/javascript";
        script.src   = URL.createObjectURL(
            new Blob([src], {
                "type": "text/javascript"
            })
        );

        document
            .getElementsByTagName("head")[0]
            .appendChild(script);
    }

    /**
     * @description プラグインの一覧にelementを追加
     *
     * @param  {string} name
     * @return {void}
     * @method
     * @public
     */
    appendNode (name)
    {
        const div = document.createElement("div");
        div.dataset.id   = `${name}_node`;
        div.dataset.name = `${name}`;
        div.classList.add("plugin-list");
        div.innerHTML = `<i></i>${name}`;

        div.addEventListener("mousedown", (event) =>
        {
            if (!this._$selectElement) {
                window
                    .addEventListener("keydown", this._$deleteCommand);
            }

            if (this._$selectElement) {
                this
                    ._$selectElement
                    .classList
                    .remove("active");
            }

            // 選択したelementをセット
            this._$selectElement = event.currentTarget;

            this
                ._$selectElement
                .classList
                .add("active");
        });

        document
            .getElementById("plugin-list-box")
            .appendChild(div);
    }

    /**
     * @description 選択しているプラグインを削除
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    deleteCommand (event)
    {
        if (Util.$keyLock) {
            return ;
        }

        // 削除キー以外はスキップ
        if (event.key !== "Backspace") {
            return ;
        }

        this.save();

        window
            .removeEventListener("keydown", this._$deleteCommand);

        // 削除処理
        this.dispose(this._$selectElement);

        // 初期化
        this._$selectElement = null;
        this._$saved = false;
    }

    /**
     * @description 削除処理
     *
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    dispose (element)
    {
        const name = element.dataset.name;

        // スクリプトを削除
        const plugin = document.getElementById(name);
        if (plugin) {
            plugin.remove();
        }

        Util
            .$currentWorkSpace()
            ._$plugins.delete(name);

        // elementを削除
        element.remove();
    }

    /**
     * @description undo用にデータを内部保管する
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        if (!this._$saved) {
            this._$saved = true;

            Util
                .$currentWorkSpace()
                .temporarilySaved();
        }
    }
}

Util.$pluginController = new PluginController();
