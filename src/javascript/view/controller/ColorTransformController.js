/**
 * カラートランスフォーム機能のコントローラークラス
 * Controller class for color transform function
 *
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class ColorTransformController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("color");
    }

    /**
     * @description カラーオフセットの最小数値
     *              Minimum color offset value
     *
     * @return {number}
     * @const
     * @static
     */
    static get MIN_OFFSET ()
    {
        return -255;
    }

    /**
     * @description カラーオフセットの最大数値
     *              Maximum color offset value
     *
     * @return {number}
     * @const
     * @static
     */
    static get MAX_OFFSET ()
    {
        return 255;
    }

    /**
     * @description カラーマルチプライヤの最小数値
     *              Minimum value for color multiplier
     *
     * @return {number}
     * @const
     * @static
     */
    static get MIN_MULTIPLIER ()
    {
        return 0;
    }

    /**
     * @description カラーマルチプライヤの最大数値
     *              Maximum number of color multipliers
     *
     * @return {number}
     * @const
     * @static
     */
    static get MAX_MULTIPLIER ()
    {
        return 100;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();

        const elementIds = [
            "color-alpha-offset",
            "color-red-offset",
            "color-green-offset",
            "color-blue-offset",
            "color-alpha-multiplier",
            "color-red-multiplier",
            "color-green-multiplier",
            "color-blue-multiplier"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            this.setInputEvent(element);
        }
    }

    /**
     * @description 赤の値を更新
     *              Update red value
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeColorRedMultiplier (value)
    {
        // 補正
        value = Util.$clamp(
            +value,
            ColorTransformController.MIN_MULTIPLIER,
            ColorTransformController.MAX_MULTIPLIER
        );

        this.updateColor(0, value / 100);

        return value;
    }

    /**
     * @description 緑の値を更新
     *              Update green value
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeColorGreenMultiplier (value)
    {
        // 補正
        value = Util.$clamp(
            +value,
            ColorTransformController.MIN_MULTIPLIER,
            ColorTransformController.MAX_MULTIPLIER
        );

        this.updateColor(1, value / 100);

        return value;
    }

    /**
     * @description 青の値を更新
     *              Update blue value
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeColorBlueMultiplier (value)
    {
        // 補正
        value = Util.$clamp(
            +value,
            ColorTransformController.MIN_MULTIPLIER,
            ColorTransformController.MAX_MULTIPLIER
        );

        this.updateColor(2, value / 100);

        return value;
    }

    /**
     * @description 透明度の値を更新
     *              Update transparency value
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeColorAlphaMultiplier (value)
    {
        // 補正
        value = Util.$clamp(
            +value,
            ColorTransformController.MIN_MULTIPLIER,
            ColorTransformController.MAX_MULTIPLIER
        );

        this.updateColor(3, value / 100);

        return value;
    }

    /**
     * @description Offsetの赤の値を更新
     *              Update red value of Offset
     *
     * @param {string} value
     * @method
     * @public
     */
    changeColorRedOffset (value)
    {
        // 補正
        value = Util.$clamp(
            value | 0,
            ColorTransformController.MIN_OFFSET,
            ColorTransformController.MAX_OFFSET
        );

        this.updateColor(4, value);

        return value;
    }

    /**
     * @description Offsetの緑の値を更新
     *              Update green value of Offset
     *
     * @param {string} value
     * @method
     * @public
     */
    changeColorGreenOffset (value)
    {
        // 補正
        value = Util.$clamp(
            value | 0,
            ColorTransformController.MIN_OFFSET,
            ColorTransformController.MAX_OFFSET
        );

        this.updateColor(5, value);

        return value;
    }

    /**
     * @description Offsetの青の値を更新
     *              Update the blue value of Offset
     *
     * @param {string} value
     * @method
     * @public
     */
    changeColorBlueOffset (value)
    {
        // 補正
        value = Util.$clamp(
            value | 0,
            ColorTransformController.MIN_OFFSET,
            ColorTransformController.MAX_OFFSET
        );

        this.updateColor(6, value);

        return value;
    }

    /**
     * @description Offsetの透明度の値を更新
     *              Update Offset transparency value
     *
     * @param {string} value
     * @method
     * @public
     */
    changeColorAlphaOffset (value)
    {
        // 補正
        value = Util.$clamp(
            value | 0,
            ColorTransformController.MIN_OFFSET,
            ColorTransformController.MAX_OFFSET
        );

        this.updateColor(7, value);

        return value;
    }

    /**
     * @description カラーの値の更新、indexで分岐処理を行う
     *              Update color values, branch processing with index
     *
     * @param  {number} index
     * @param  {number} value
     * @return {number}
     * @method
     * @public
     */
    updateColor (index, value)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;
        const element   = activeElements[0];

        // 対象レイヤーオブジェクト
        const layer = scene.getLayer(
            element.dataset.layerId | 0
        );

        // スクリーンで選択しているDisplayObject
        const character = layer.getCharacter(
            element.dataset.characterId | 0
        );

        const frame = Util.$timelineFrame.currentFrame;

        // 対象のカラーを更新
        const place = character.getPlace(frame);
        place.colorTransform[index] = value;

        // tweenの座標を再計算してポインターを再配置
        character.relocationTween(frame);

        // 再描画ように、キャッシュを削除
        character._$image = null;
    }
}

Util.$colorTransformController = new ColorTransformController();
