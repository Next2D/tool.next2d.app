/**
 * @class
 */
class InputEvent
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
         * @description フォーカスされたかの判定変数
         * @type {boolean}
         * @default false
         * @private
         */
        this._$focus = false;

        /**
         * @description 発火したイベントオブジェクト
         * @type {Event}
         * @default null
         * @private
         */
        this._$currentEvent = null;

        /**
         * @description 指定されたInputElement
         *
         * @type {HTMLInputElement}
         * @default null
         * @private
         */
        this._$currentTarget = null;

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
     * @description Elementのid名をキャメルケースに変換して関数を実行
     *              例) font-select => changeFontSelectがコールされる
     *              valueはstringで渡すので、コール先の関数内で変換とバリデーションを行う必要がある
     *
     * @param  {string} name
     * @param  {string|number|Event} value
     * @return {*}
     * @method
     * @public
     */
    changeFunction (name, value)
    {
        const names = name.split("-");

        let functionName = names
            .map((value) =>
            {
                return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
            })
            .join("");

        return this[`change${functionName}`](value);
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
                return ;

            default:
                Util.$setCursor("ew-resize");
                event.target.style.cursor = "ew-resize";
                break;

        }

        this._$currentValue = +event.target.value;
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
            this._$currentTarget.value = this.changeFunction(
                this._$currentTarget.id,
                currentValue + diff
            );

            // 値を更新
            this._$pointX = event.screenX;
        });
    }

    /**
     * @description Inputにフォーカスされた時に変数を初期化する
     *
     * @return {void}
     * @method
     * @public
     */
    focusIn ()
    {
        this._$focus  = true;
        Util.$keyLock = true;
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
        this._$saved         = false;
        this._$focus         = false;
        this._$currentTarget = null;
        Util.$keyLock        = false;
    }

    /**
     * @param  {Event|KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    finishInput (event)
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
            event.target.value = this.changeFunction(
                this._$currentTarget.id,
                this._$currentTarget.value
            );

            this.focusOut();
        }
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
