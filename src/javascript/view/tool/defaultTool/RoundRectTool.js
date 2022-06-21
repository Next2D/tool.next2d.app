/**
 * @class
 * @extends {DrawTool}
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
