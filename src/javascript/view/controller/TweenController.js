/**
 * @class
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
