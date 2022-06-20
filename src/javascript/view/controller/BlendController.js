/**
 * @class
 * @extends {BaseController}
 */
class BlendController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("blend");
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

        this.setChangeEvent(
            document.getElementById("blend-select")
        );
    }

    /**
     * @description ブレンドモードの値を変更
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeBlendSelect (value)
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
        const element   = activeElements[0].target;

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
        place.blendMode = `${value}`;

        // 再描画ように、キャッシュを削除
        character._$image = null;
    }
}

Util.$blendController = new BlendController();