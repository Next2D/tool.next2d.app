/**
 * @class
 * @extends {DrawTool}
 * @memberOf view.tool.default
 */
class RectangleTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("rectangle");
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    createCharacter ()
    {
        super.createCharacter("rectangle");
    }
}
