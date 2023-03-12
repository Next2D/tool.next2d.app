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
     * @param  {string} [name="round-rect"]
     * @return {Promise}
     * @method
     * @public
     */
    createCharacter (name = "round-rect")
    {
        return super.createCharacter(name);
    }
}
