/**
 * コントローラーの各項目の共有クラス
 * Shared class for each item in the controller
 *
 * @class
 * @memberOf view.controller
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
        if (document.readyState !== "complete") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
    }

    /**
     * @description コントローラーの共通の初期起動関数
     *              Common initial startup functions for controllers.
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
     *              Initialize variables when Input is focused
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
     *              Release lock when focus ends on Input
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
     *              Mouse operation end function if Input is numeric
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
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
     *              For numeric InputElement, values can be changed with the mouse
     *              Initialize cursors and variables according to state
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
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
     * @description マウスアップ処理、移動イベントなどを削除して初期化
     *              Delete and initialize mouse-up process, move events, etc.
     *
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
     *              Add and subtract numbers with the mouse
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
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
     *              Redraw Element with changes in screen area
     *
     * @return {void}
     * @method
     * @public
     */
    reloadScreen ()
    {
        const workSpace = Util.$currentWorkSpace();
        if (!workSpace) {
            return ;
        }

        const scene = workSpace.scene;
        if (!scene) {
            return ;
        }

        scene.changeFrame(Util.$timelineFrame.currentFrame);
    }

    /**
     * @description Inputが数値の場合マウス動作で加算減算できればカーソルを変化させる
     *              If Input is a number, the cursor is changed if it can be added and subtracted by mouse movement.
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
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
     * @description 各項目の表示/非表示の処理
     *              Show/Hide each item
     *
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
     *              Convert Element's id name to CamelCase and execute function
     *              e.g.) font-select => changeFontSelect is called
     *              Since value is passed as a string, conversion and validation must be performed in the calling function
     *
     *              In the case of DOM, the ID is assigned to the last string, so if the function does not exist, remove the last string.
     *              e.g.) sound-volume-1 => changeSoundVolume is called
     *
     * @param  {string} name
     * @param  {string|number|Event} value
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
     * @description Input入力終了時の処理関数
     *              Processing function at the end of Input input
     *
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
     *              Store data internally for undo when there are property updates
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        // 保存中ならスキップ
        if (this._$saved) {
            return ;
        }

        this._$saved = true;

        const workSpace = Util.$currentWorkSpace();
        if (!workSpace) {
            return ;
        }

        workSpace.temporarilySaved();
    }

    /**
     * @description 指定のelementにchangeイベントを登録する
     *              Register a change event to the specified element.
     *
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
     * @description Inputのelementに各種コントローラーで利用するイベントを登録
     *              Register events used by various controllers in the element of Input
     *
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
     * @description 指定のelementにclickイベントを登録する
     *              Register a click event to the specified element.
     *
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
     * @description タイトル表示用の変数
     *              Variables for title display
     *
     * @member {string}
     * @default ""
     * @readonly
     * @public
     */
    get name ()
    {
        return this._$name;
    }
}
