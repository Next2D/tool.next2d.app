/**
 * @class
 * @extends {DrawTool}
 * @memberOf view.tool.default
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
     * @param  {string} [name="circle"]
     * @return {Promise}
     * @method
     * @public
     */
    createCharacter (name = "circle")
    {
        return super.createCharacter(name);
    }
}
