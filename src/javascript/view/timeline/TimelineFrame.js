/**
 * @class
 * @extends {BaseTimeline}
 */
class TimelineFrame extends BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pointX = 0;

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
     * @description 現在のフレーム番号を返却する
     *
     * @return {number}
     * @public
     */
    get currentFrame ()
    {
        return document.getElementById("current-frame").value | 0;
    }

    /**
     * @description 指定フレームをセット
     *
     * @param  {number} frame
     * @return {void}
     * @public
     */
    set currentFrame (frame)
    {
        const element = document.getElementById("current-frame");
        if (element) {
            element.value = `${frame | 0}`;
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
        super.initialize();

        const element = document.getElementById("current-frame");

        if (element) {

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
        super.focusIn();
        this._$currentValue  = +event.target.value;
        this._$currentTarget = event.target;
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
        super.focusOut();
        this._$currentValue  = null;
        this._$currentTarget = null;
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

        // 選択中のレイヤーを初期化
        Util.$timelineLayer.clear();

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
                currentValue = 1;
            }

            // clampで補正された値をセット
            const frame = Util.$clamp(
                currentValue + diff,
                1, Util.$timelineHeader.lastFrame
            );

            this._$currentTarget.value = `${frame}`;
            this._$currentValue        = frame;
            this._$pointX              = event.screenX;

            // タイムラインの座標の補正
            this.moveTimeline();

            //

            // 再描画
            this.reloadScreen();
        });
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

            // Inputの値を更新
            const frame = Util.$clamp(
                event.target.value | 0,
                1, Util.$timelineHeader.lastFrame
            );

            event.target.value = `${frame}`;

            // タイムラインの座標の補正
            this.moveTimeline();

            // 初期化
            this.focusOut();

            // 再描画
            this.reloadScreen();
        }
    }

    /**
     * @description フレームに合わせてタイムラインの座標を移動させる
     *
     * @return {void}
     * @method
     * @public
     */
    moveTimeline ()
    {
        // マーカーを移動
        Util.$timelineMarker.move();

        // タイムラインの座標修正
        const deltaX =
            Util.$timelineFrame.currentFrame
                * (Util.$timelineTool.timelineWidth + 1);

        const element = document
            .getElementById("timeline-controller-base");

        switch (true) {

            case deltaX > element.scrollLeft + element.offsetWidth:
                Util
                    .$timelineLayer
                    .moveTimeLine(
                        deltaX - (Util.$timelineTool.timelineWidth + 1)
                    );
                break;

            case element.scrollLeft >= deltaX:
                {
                    const frame = element.offsetWidth
                        / (Util.$timelineTool.timelineWidth + 1) | 0;

                    Util
                        .$timelineLayer
                        .moveTimeLine(
                            deltaX - frame
                                * (Util.$timelineTool.timelineWidth + 1)
                        );
                }
                break;

            default:
                break;

        }
    }
}

Util.$timelineFrame = new TimelineFrame();
