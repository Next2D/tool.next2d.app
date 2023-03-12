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
     * @param  {string} [name="rectangle"]
     * @return {Promise}
     * @method
     * @public
     */
    createCharacter (name = "rectangle")
    {
        return super.createCharacter(name);
    }
}
