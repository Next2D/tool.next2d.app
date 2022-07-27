/**
 * @class
 * @extends {BaseController}
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
     * @return {number}
     * @const
     * @static
     */
    static get MIN_OFFSET ()
    {
        return -255;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_OFFSET ()
    {
        return 255;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_MULTIPLIER ()
    {
        return 0;
    }

    /**
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
            this.setInputEvent(
                document.getElementById(elementIds[idx])
            );
        }
    }

    /**
     * @description Offsetの値を補正
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    offsetClamp (value)
    {
        return Util.$clamp(
            value | 0,
            ColorTransformController.MIN_OFFSET,
            ColorTransformController.MAX_OFFSET
        );
    }

    /**
     * @description 値を補正
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    multiplierClamp (value)
    {
        return Util.$clamp(
            +value,
            ColorTransformController.MIN_MULTIPLIER,
            ColorTransformController.MAX_MULTIPLIER
        );
    }

    /**
     * @description 赤の値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeColorRedMultiplier (value)
    {
        // 補正
        value = this.multiplierClamp(value);

        this.updateColor(0, value / 100);

        return value;
    }

    /**
     * @description 緑の値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeColorGreenMultiplier (value)
    {
        // 補正
        value = this.multiplierClamp(value);

        this.updateColor(1, value / 100);

        return value;
    }


    /**
     * @description 青の値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeColorBlueMultiplier (value)
    {
        // 補正
        value = this.multiplierClamp(value);

        this.updateColor(2, value / 100);

        return value;
    }

    /**
     * @description 透明度の値を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeColorAlphaMultiplier (value)
    {
        // 補正
        value = this.multiplierClamp(value);

        this.updateColor(3, value / 100);

        return value;
    }

    /**
     * @description Offsetの赤の値を更新
     *
     * @param {string} value
     * @method
     * @public
     */
    changeColorRedOffset (value)
    {
        // 補正
        value = this.offsetClamp(value);

        this.updateColor(4, value);

        return value;
    }

    /**
     * @description Offsetの緑の値を更新
     *
     * @param {string} value
     * @method
     * @public
     */
    changeColorGreenOffset (value)
    {
        // 補正
        value = this.offsetClamp(value);

        this.updateColor(5, value);

        return value;
    }

    /**
     * @description Offsetの青の値を更新
     *
     * @param {string} value
     * @method
     * @public
     */
    changeColorBlueOffset (value)
    {
        // 補正
        value = this.offsetClamp(value);

        this.updateColor(6, value);

        return value;
    }

    /**
     * @description Offsetの透明度の値を更新
     *
     * @param {string} value
     * @method
     * @public
     */
    changeColorAlphaOffset (value)
    {
        // 補正
        value = this.offsetClamp(value);

        this.updateColor(7, value);

        return value;
    }

    /**
     * @description 値更新の分岐関数
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

        // 再描画ように、キャッシュを削除
        character._$image = null;

        // tweenの座標を再計算してポインターを再配置
        character.relocationTween(frame);
    }
}

Util.$colorTransformController = new ColorTransformController();
