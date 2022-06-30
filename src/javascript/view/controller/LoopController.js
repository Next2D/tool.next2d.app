/**
 * @class
 * @extends {BaseController}
 */
class LoopController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super("loop");
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

}

Util.$loopController = new LoopController();
