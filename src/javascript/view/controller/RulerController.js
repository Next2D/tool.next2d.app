/**
 * @class
 * @memberOf view.controller
 */
class RulerController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("ruler");
    }

    /**
     * @description オブジェクトコントローラーの初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();

        const element = document.getElementById("ruler-position");
        if (!element) {
            return ;
        }

        this.setInputEvent(element);
    }

    /**
     * @description 境界線の座標を更新
     *              Update red value
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeRulerPosition (value)
    {
        value |= 0;

        const target = Util.$screenRuler._$target;
        if (target) {
            const mode = Util.$screenRuler._$mode;

            if (mode === "x") {
                target.style.left = `${Math.ceil(Util.$offsetLeft + value * Util.$zoomScale)}px`;
            } else {
                target.style.top = `${Math.ceil(Util.$offsetTop + value * Util.$zoomScale)}px`;
            }
        }

        return value;
    }

    /**
     * @description コントローラーの値をセット
     *
     * @param  {number} value
     * @return {void}
     * @method
     * @public
     */
    setInputValue (value)
    {
        const element = document.getElementById("ruler-position");
        if (!element) {
            return ;
        }

        element.value = `${Math.ceil(value / Util.$zoomScale)}`;
    }
}

Util.$rulerController = new RulerController();