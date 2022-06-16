/**
 * @class
 * @extends {Filter}
 */
class BlurFilter extends Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
     */
    constructor (object = null)
    {
        super(object);
        this.name = "BlurFilter";
    }

    /**
     * @return {window.next2d.filters.BlurFilter}
     * @public
     */
    createInstance ()
    {
        return new window.next2d.filters.BlurFilter(
            this.blurX, this.blurY, this.quality
        );
    }

    /**
     * @return {array}
     */
    toParamArray ()
    {
        return [null, this.blurX, this.blurY, this.quality];
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "name": this.name,
            "blurX": this.blurX,
            "blurY": this.blurY,
            "quality": this.quality,
            "state": this.state
        };
    }
}
