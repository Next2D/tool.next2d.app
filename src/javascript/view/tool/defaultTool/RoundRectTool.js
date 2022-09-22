/**
 * @class
 * @extends {DrawTool}
 * @memberOf view.tool.default
 */
class RoundRectTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("round-rect");
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    createCharacter ()
    {
        super.createCharacter("round-rect");
    }
}
