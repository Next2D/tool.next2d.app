/**
 * @class
 * @memberOf view.tool
 */
class SaveProgress
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
         * @type {number}
         * @default 0
         * @private
         */
        this._$value = 0;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

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
     * @return {boolean}
     * @readonly
     * @public
     */
    get active ()
    {
        return this._$active;
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

        const element = document.getElementById("save-progress-modal");
        if (element) {
            element.addEventListener("mousedown", (event) =>
            {
                this.moveStart(event);
            });
        }

        Util.$initializeEnd();
    }

    /**
     * @description マウス移動をセットアップ
     *
     * @param {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveStart (event)
    {
        event.stopPropagation();
        event.preventDefault();

        // 現在のポジションをセット
        this._$pageX = event.pageX;
        this._$pageY = event.pageY;

        if (!this._$mouseMove) {
            this._$mouseMove = this.mouseMove.bind(this);
        }

        if (!this._$mouseUp) {
            this._$mouseUp = this.mouseUp.bind(this);
        }

        window.addEventListener("mousemove", this._$mouseMove);
        window.addEventListener("mouseup", this._$mouseUp);
    }

    /**
     * @description 移動処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseMove (event)
    {
        const element = document.getElementById("save-progress-modal");
        if (!element) {
            return ;
        }

        window.requestAnimationFrame(() =>
        {
            const left = element.offsetLeft + (event.pageX - this._$pageX);
            const top  = element.offsetTop  + (event.pageY - this._$pageY);

            element.setAttribute("style", `left: ${left}px; top: ${top}px`);

            // 現在のポジションをセット
            this._$pageX = event.pageX;
            this._$pageY = event.pageY;
        });
    }

    /**
     * @description 移動完了処理
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    mouseUp (event)
    {
        event.stopPropagation();
        event.preventDefault();

        window.removeEventListener("mousemove", this._$mouseMove);
        window.removeEventListener("mouseup", this._$mouseUp);
    }

    /**
     * @description プログレスバーを起動
     *
     * @return {void}
     * @method
     * @public
     */
    start ()
    {
        const element = document.getElementById("save-progress-modal");
        if (!element) {
            return ;
        }

        // プログレスバーを初期化
        this.update(0, "Save Start");

        if (!element.classList.contains("fadeIn")) {
            element.setAttribute("class", "fadeIn");
        }

        element.setAttribute("style", "");
        const left = (window.innerWidth  - element.clientWidth)  / 2;
        const top  = (window.innerHeight - element.clientHeight) / 2;

        element.setAttribute("style", `left: ${left}px; top: ${top}px`);

        // アクティブ
        this._$active = true;
    }

    /**
     * @description JSON生成の待機
     *
     * @return {void}
     * @method
     * @public
     */
    createJson ()
    {
        this.update(10, "Create JSON");
    }

    /**
     * @description zlib圧縮の待機
     *
     * @return {void}
     * @method
     * @public
     */
    zlibDeflate ()
    {
        this.update(10, "Zlib Deflate");

        this._$timerId = setInterval(() =>
        {
            this.update(
                Math.min(70, this._$value + 1),
                "Zlib Deflate"
            );
        }, 300);
    }

    /**
     * @description バイナリデータ生成待機
     *
     * @return {void}
     * @method
     * @public
     */
    createBinary ()
    {
        clearInterval(this._$timerId);
        this.update(70, "Create Binary");
    }

    /**
     * @description ローカルのDBの起動待機
     *
     * @return {void}
     * @method
     * @public
     */
    launchDatabase ()
    {
        this.update(80, "Launch Database");
    }

    /**
     * @description コミット待機
     *
     * @return {void}
     * @method
     * @public
     */
    commit ()
    {
        this.update(90, "Commit");
    }

    /**
     * @description プログレスバーを終了
     *
     * @return {void}
     * @method
     * @public
     */
    end ()
    {
        this.update(100, "Complete");

        window.removeEventListener("mousemove", this._$mouseMove);
        window.removeEventListener("mouseup", this._$mouseUp);

        this._$timerId = -1;
        this._$active  = false;

        const element = document.getElementById("save-progress-modal");
        if (!element) {
            return ;
        }

        if (!element.classList.contains("fadeOut")) {
            setTimeout(() =>
            {
                element.setAttribute("class", "fadeOut");
            }, 1000);
        }
    }

    /**
     * @description プログレスバーの値を更新
     *
     * @param  {number} value
     * @param  {string} state
     * @return {void}
     * @method
     * @public
     */
    update (value, state = "")
    {
        const element = document.getElementById("save-progress");
        if (!element) {
            return ;
        }

        this._$value  = value;
        element.value = `${value}`;

        // 状態を更新
        document
            .getElementById("progress-state")
            .textContent = state;
    }
}

Util.$saveProgress = new SaveProgress();
