/**
 * @class
 * @extends {InputEvent}
 */
class ColorTool extends InputEvent
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

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
     * @return {string}
     * @const
     * @static
     */
    static get FILL_DEFAULT_COLOR ()
    {
        return "#000000";
    }

    /**
     * @return {string}
     * @const
     * @static
     */
    static get STROKE_DEFAULT_COLOR ()
    {
        return "#000000";
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get STROKE_DEFAULT_SIZE ()
    {
        return 0;
    }

    /**
     * @description 初回起動設定
     *
     * @return {void}
     * @public
     */
    initialize ()
    {
        // コントラクターでセットしたイベントを削除
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        // 塗りのカラーElementのイベントと初期値をセット
        const fillColor = document.getElementById("fill-color");
        if (fillColor) {

            fillColor.value = localStorage
                .getItem(`${Util.PREFIX}@${fillColor.id}`) || ColorTool.FILL_DEFAULT_COLOR;

            fillColor
                .addEventListener("change", (event) =>
                {
                    const element = event.target;

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@${element.id}`,
                            event.target.value
                        );
                });
        }

        // 線のカラーElementのイベントと初期値をセット
        const strokeColor = document.getElementById("stroke-color");
        if (strokeColor) {

            strokeColor.value = localStorage
                .getItem(`${Util.PREFIX}@${strokeColor.id}`) || ColorTool.STROKE_DEFAULT_COLOR;

            strokeColor
                .addEventListener("change", (event) =>
                {
                    const element = event.target;

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@${element.id}`,
                            element.value
                        );
                });
        }

        // 線の太さのElementのイベントと初期値をセット
        const strokeSize = document.getElementById("stroke-size");
        if (strokeSize) {

            strokeSize.value = localStorage
                .getItem(`${Util.PREFIX}@${strokeSize.id}`) || ColorTool.STROKE_DEFAULT_SIZE;

            this.setInputEvent(strokeSize);
        }

        // end
        Util.$initializeEnd();
    }

    /**
     * @description 線のInput処理
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeStrokeSize (value)
    {
        value = Util.$clamp(value | 0, 0, 255);

        localStorage.setItem(`${Util.PREFIX}@stroke-size`, value);

        return value;
    }
}

Util.$colorTool = new ColorTool();
