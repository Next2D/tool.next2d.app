/**
 * @class
 */
class SVGCommandTypes
{
    /**
     * @return {number}
     * @const
     * @static
     */
    static get CLOSE_PATH ()
    {
        return 1;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MOVE_TO ()
    {
        return 2;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get HORIZ_LINE_TO ()
    {
        return 4;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get VERT_LINE_TO ()
    {
        return 8;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get LINE_TO ()
    {
        return 16;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get CURVE_TO ()
    {
        return 32;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get SMOOTH_CURVE_TO ()
    {
        return 64;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get QUAD_TO ()
    {
        return 128;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get SMOOTH_QUAD_TO ()
    {
        return 256;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get ARC ()
    {
        return 512;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get CIRCLE ()
    {
        return 1024;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get LINE_COMMANDS ()
    {
        return SVGCommandTypes.LINE_TO
            | SVGCommandTypes.HORIZ_LINE_TO
            | SVGCommandTypes.VERT_LINE_TO;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get DRAWING_COMMANDS ()
    {
        return SVGCommandTypes.HORIZ_LINE_TO
            | SVGCommandTypes.VERT_LINE_TO
            | SVGCommandTypes.LINE_TO
            | SVGCommandTypes.CURVE_TO
            | SVGCommandTypes.SMOOTH_CURVE_TO
            | SVGCommandTypes.QUAD_TO
            | SVGCommandTypes.SMOOTH_QUAD_TO
            | SVGCommandTypes.ARC;
    }
}