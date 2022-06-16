class BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @description 自動セーブの判定フラグ
         * @type {boolean}
         * @default false
         * @private
         */
        this._$saved = false;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        if (document.readyState === "loading") {
            Util.$readEnd++;
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
    }

    /**
     * @description 共通初期イベント登録関数
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

        Util.$initializeEnd();
    }

    /**
     * @description スクリーンエリアで変更があったElementを再描画
     *
     * @return {void}
     * @method
     * @public
     */
    reloadScreen ()
    {
        const frame = Util.$timelineFrame.currentFrame;

        Util
            .$currentWorkSpace()
            .scene
            .changeFrame(frame);
    }

    /**
     * @description 現在の状態をundo用に保存
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        // セーブ
        Util
            .$currentWorkSpace()
            .temporarilySaved();
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
}
