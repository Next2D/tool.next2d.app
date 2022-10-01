/**
 * ブレンド機能のコントローラークラス
 * Controller class for blend function
 *
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
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
     *              initial invoking function
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
     *              Change blend mode value
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

        const scene   = Util.$currentWorkSpace().scene;
        const element = activeElements[0];

        // 対象レイヤーオブジェクト
        const layer = scene.getLayer(
            element.dataset.layerId | 0
        );

        // スクリーンで選択しているDisplayObject
        const character = layer.getCharacter(
            element.dataset.characterId | 0
        );

        const frame = Util.$timelineFrame.currentFrame;

        // 指定フレームのplace objectを取得
        let place = character.getPlace(frame);
        if (place.tweenFrame) {

            // キーフレームの途中でブレンドモードを切り替えたらtweenを分割する
            if (character.endFrame - 1 > frame && !character.hasTween(frame)) {

                Util
                    .$timelineTool
                    .executeTimelineKeyAdd();

                // 新規のキーフレームのplace objectをセット
                place = character.getPlace(frame);
            }

            // tweenの場合は主となるキーフレームに切り替える
            place = character.getPlace(place.tweenFrame);
        }

        // 指定のブレンドモードを適用
        place.blendMode = `${value}`;

        // tween情報を更新
        if (place.tweenFrame) {
            character.updateTweenBlend(frame);
        }

        // 再描画ように、キャッシュを削除
        character._$image = null;
    }
}

Util.$blendController = new BlendController();
