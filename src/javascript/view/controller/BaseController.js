/**
 * @class
 */
class BaseController
{
    /**
     * @param {string} [name=""]
     * @constructor
     * @public
     */
    constructor (name = "")
    {
        /**
         * @type {string}
         * @private
         */
        this._$name = name;

        /**
         * @description 自動セーブの判定フラグ
         * @type {boolean}
         * @default false
         * @private
         */
        this._$saved = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pointX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pointY = 0;

        /**
         * @description フォーカスされたかの判定変数
         * @type {boolean}
         * @default false
         * @private
         */
        this._$focus = false;

        /**
         * @description ロック時のInputの値を管理する変数
         *
         * @type {number}
         * @default null
         * @private
         */
        this._$currentValue = null;

        /**
         * @description 指定されたInputElement
         *
         * @type {HTMLInputElement}
         * @default null
         * @private
         */
        this._$currentTarget = null;

        /**
         * @description ロックがOnの時の対象InputElement
         *
         * @type {HTMLInputElement}
         * @default null
         * @private
         */
        this._$lockTarget = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseMove = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseUp = null;

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
     * @description コントローラーの共通初期イベント登録関数
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

        // コントローラー部分の表示非表示イベントを登録
        if (this.name) {
            const element = document
                .getElementById(`${this.name}-setting-title`);

            if (element) {
                element
                    .addEventListener("mousedown", () =>
                    {
                        this.clickTitle();
                    });
            }
        }

        Util.$initializeEnd();
    }

    /**
     * @description Inputにフォーカスされた時に変数を初期化する
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    focusIn (event)
    {
        this._$focus        = true;
        this._$currentValue = +event.target.value;
        Util.$keyLock       = true;
    }

    /**
     * @description Inputにフォーカス終了した時にロックを解放する
     *
     * @return {void}
     * @method
     * @public
     */
    focusOut ()
    {
        this._$focus         = false;
        this._$currentValue  = null;
        this._$currentTarget = null;
        this._$lockTarget    = null;
        Util.$keyLock        = false;
    }

    /**
     * @description Inputが数値の場合マウス動作終了関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @public
     */
    mouseOut (event)
    {
        event.stopPropagation();

        if (this._$focus || !this._$currentTarget) {
            Util.$setCursor("auto");
            event.target.style.cursor = "";
        }
    }

    /**
     * @description 数値のInputElementの場合はマウスで値を変更可能
     *              状態に合わせてカーソルや変数を初期化する
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @public
     */
    mouseDown (event)
    {
        // Inputモードなら何もしない
        if (this._$focus) {
            return ;
        }

        event.preventDefault();

        // 初期化
        this._$saved         = false;
        this._$pointX        = event.screenX;
        this._$currentTarget = event.target;
        this._$currentValue  = +event.target.value;

        Util.$setCursor("ew-resize");

        if (!this._$mouseMove) {
            this._$mouseMove = this.mouseMove.bind(this);
        }

        if (!this._$mouseUp) {
            this._$mouseUp = this.mouseUp.bind(this);
        }

        // イベントを登録
        window.addEventListener("mousemove", this._$mouseMove);
        window.addEventListener("mouseup", this._$mouseUp);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    mouseUp ()
    {
        // イベントを削除
        window.removeEventListener("mousemove", this._$mouseMove);
        window.removeEventListener("mouseup", this._$mouseUp);

        Util.$setCursor("auto");

        if (this._$currentTarget) {
            this._$currentTarget.style.cursor = "";
            this._$currentTarget.focus();
        }
    }

    /**
     * @description マウスで数値の加算減算を行う
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @public
     */
    mouseMove (event)
    {
        if (this._$focus || !this._$currentTarget) {
            return ;
        }

        window.requestAnimationFrame(() =>
        {
            if (this._$focus || !this._$currentTarget) {
                return ;
            }

            event.preventDefault();

            Util.$setCursor("ew-resize");

            const diff = event.screenX - this._$pointX;

            let currentValue = +this._$currentTarget.value;
            if (isNaN(currentValue)) {
                currentValue = 0;
            }

            // clampで補正された値をセット
            this._$currentTarget.value = this.executeFunction(
                this._$currentTarget.id,
                currentValue + diff
            );

            this._$currentValue = +this._$currentTarget.value;
            if (this._$lockTarget) {
                // clampで補正された値をセット
                this._$lockTarget.value = this.executeFunction(
                    this._$lockTarget.id,
                    +this._$lockTarget.value + diff
                );
            }

            this._$pointX = event.screenX;

            this.reloadScreen();
        });
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
     * @description Inputが数値の場合マウス動作で加算減算できればカーソルを変化させる
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @public
     */
    mouseOver (event)
    {
        event.stopPropagation();

        switch (true) {

            case this._$focus:
            case this._$currentTarget !== null:
            case this._$currentValue !== null:
                return ;

            default:
                Util.$setCursor("ew-resize");
                event.target.style.cursor = "ew-resize";
                break;

        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    clickTitle ()
    {
        const element = document
            .getElementById(`${this.name}-setting-view-area`);

        const icon = document
            .getElementById(`${this.name}-setting-title`)
            .getElementsByTagName("i")[0];

        if (element.style.display === "none") {
            element.style.display = "";
            icon.setAttribute("class", "active");
        } else {
            element.style.display = "none";
            icon.setAttribute("class", "disable");
        }
    }

    /**
     * @description Elementのid名をキャメルケースに変換して関数を実行
     *              例) font-select => changeFontSelectがコールされる
     *              valueはstringで渡すので、コール先の関数内で変換とバリデーションを行う必要がある
     *
     *              DOMの場合は最後の文字列にIDが付与されるので、関数が存在しない時は最後の文字列を外す
     *              例) sound-volume-1 => changeSoundVolumeがコールされる
     *
     * @param  {string} name
     * @param  {string|number} value
     * @return {*}
     * @method
     * @public
     */
    executeFunction (name, value)
    {
        this.save();

        const names = name.split("-");

        let functionName = names
            .map((value) =>
            {
                return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
            })
            .join("");

        if (!(`change${functionName}` in this)) {

            // 最後の文字を削除
            names.pop();

            functionName = names
                .map((value) => {
                    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
                })
                .join("");
        }

        return this[`change${functionName}`](value);
    }

    /**
     * @param  {Event|KeyboardEvent} event
     * @param  {boolean} [reload=true]
     * @return {void}
     * @method
     * @public
     */
    finishInput (event, reload = true)
    {
        // Enterを押下したら、focusoutイベントを発火させる
        if (event.key === "Enter") {
            event.currentTarget.blur();
            return ;
        }

        // focusoutなら更新関数を実行
        if (event.type === "focusout") {

            this._$currentTarget = event.target;

            // Inputの値を更新
            const value = this.executeFunction(
                event.target.id,
                event.target.value
            );

            // ロックしたInputの値を更新
            if (this._$lockTarget) {
                this._$lockTarget.value = this.executeFunction(
                    this._$lockTarget.id,
                    +this._$lockTarget.value + value - this._$currentValue
                );
            }

            event.target.value  = value;
            this._$currentValue = value;

            this.focusOut();

            // スクリーンを再描画
            if (reload) {
                this.reloadScreen();
            }
        }
    }

    /**
     * @description プロパティーの更新がある時はundo用にデータを内部保管する
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

    /**
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    setChangeEvent (element)
    {
        if (!element) {
            return ;
        }

        element
            .addEventListener("change", (event) =>
            {
                this._$currentTarget = event.target;

                this.executeFunction(
                    event.target.id,
                    event.target.value
                );

                this._$currentTarget = null;

                // スクリーンを再描画
                this.reloadScreen();
            });
    }

    /**
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    setInputEvent (element)
    {
        if (!element) {
            return ;
        }

        element.addEventListener("mouseover", (event) =>
        {
            this.mouseOver(event);
        });
        element.addEventListener("mouseout", (event) =>
        {
            this.mouseOut(event);
        });
        element.addEventListener("mousedown", (event) =>
        {
            this.mouseDown(event);
        });
        element.addEventListener("focusin", (event) =>
        {
            this.focusIn(event);
        });
        element.addEventListener("focusout",  (event) =>
        {
            this.finishInput(event);
        });
        element.addEventListener("keypress",  (event) =>
        {
            this.finishInput(event);
        });
    }

    /**
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    setClickEvent (element)
    {
        if (!element) {
            return ;
        }

        element
            .addEventListener("click", (event) =>
            {
                this._$currentTarget = event.target;

                this.executeFunction(
                    event.target.id,
                    event.target.value
                );

                this._$currentTarget = null;

                // スクリーンを再描画
                this.reloadScreen();
            });
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get name ()
    {
        return this._$name;
    }
}
