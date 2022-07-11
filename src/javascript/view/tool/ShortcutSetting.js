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
            "shortcut-setting-restore",
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

        // 初期はスクリーンを表示
        this.executeShortcutSettingScreen();

        Util.$initializeEnd();
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
            .classList.add("active");
        document
            .getElementById("shortcut-setting-timeline")
            .classList.remove("active");
        document
            .getElementById("shortcut-setting-library")
            .classList.remove("active");
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
            .classList.remove("active");
        document
            .getElementById("shortcut-setting-timeline")
            .classList.add("active");
        document
            .getElementById("shortcut-setting-library")
            .classList.remove("active");
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
            .classList.remove("active");
        document
            .getElementById("shortcut-setting-timeline")
            .classList.remove("active");
        document
            .getElementById("shortcut-setting-library")
            .classList.add("active");
    }

    /**
     * @description ショートカット情報を初期値に戻す
     *
     * @return {void}
     * @method
     * @public
     */
    executeShortcutSettingRestore ()
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

            Util.$endMenu("shortcut-setting-menu");

            const userSetting = document
                .getElementById("user-setting");

            element.style.display = "";
            element.style.left = `${userSetting.offsetLeft}px`;
            element.style.top  = `${userSetting.offsetTop}px`;

            element.setAttribute("class", "fadeIn");
        }
    }
}

Util.$shortcutSetting = new ShortcutSetting();
