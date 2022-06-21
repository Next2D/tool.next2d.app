/**
 * @class
 * @extends {DrawTool}
 */
class CircleTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("circle");
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    createCharacter ()
    {
        super.createCharacter("circle");
    }
}
