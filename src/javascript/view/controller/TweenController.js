/**
 * @class
 * @extends {BaseController}
 */
class TweenController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super("ease");
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
    }

    /**
     * @description tweenのポインター位置を再計算してElementを配置
     *
     * @return {void}
     * @method
     * @public
     */
    reload ()
    {
        console.log("reload");
    }

    /**
     * @description スクリーンのポインターを非表示にする
     *
     * @return {void}
     * @method
     * @public
     */
    remove ()
    {
        console.log("remove");
    }
}

Util.$tweenController = new TweenController();
