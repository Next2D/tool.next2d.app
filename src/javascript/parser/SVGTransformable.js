/**
 * @class
 */
class SVGTransformable
{
    /**
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return {*}
     * @method
     * @public
     */
    matrix (a = 1, b = 0, c = 0, d = 1, e = 0, f = 0)
    {
        return this.transform(SVGPathDataTransformer.MATRIX(a, b, c, d, e, f));
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @return {*}
     * @method
     * @public
     */
    translate (x, y = 0)
    {
        return this.transform(SVGPathDataTransformer.TRANSLATE(x, y));
    }

    /**
     * @param  {number} x
     * @param  {number} [y=null]
     * @return {*}
     * @method
     * @public
     */
    scale (x, y = null)
    {
        return this.transform(SVGPathDataTransformer.SCALE(x, y === null || isNaN(y) ? x : y));
    }

    /**
     * @param  {number} a
     * @param  {number} x
     * @param  {number} y
     * @return {*}
     * @method
     * @public
     */
    rotate (a, x = 0, y = 0)
    {
        return this.transform(SVGPathDataTransformer.ROTATE(a * (Math.PI / 180), x, y));
    }

    /**
     * @param  {number} a
     * @return {*}
     * @method
     * @public
     */
    skewX (a)
    {
        return this.transform(SVGPathDataTransformer.SKEW_X(a * (Math.PI / 180)));
    }

    /**
     * @param  {number} a
     * @return {*}
     * @method
     * @public
     */
    skewY (a)
    {
        return this.transform(SVGPathDataTransformer.SKEW_Y(a * (Math.PI / 180)));
    }
}