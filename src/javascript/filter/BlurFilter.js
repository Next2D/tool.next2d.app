/**
 * Next2Dのフィルターと連動したBlurFilterクラス
 * BlurFilter class in conjunction with Next2D filters
 *
 * @class
 * @extends {Filter}
 */
class BlurFilter extends Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        super(object);
        this.name = "BlurFilter";
    }

    /**
     * @description Next2DのBlurFilterを生成
     *              Generate Next2D BlurFilter
     *
     * @return {window.next2d.filters.BlurFilter}
     * @method
     * @public
     */
    createInstance ()
    {
        return new window.next2d.filters.BlurFilter(
            this.blurX, this.blurY, this.quality
        );
    }

    /**
     * @description クラス内の変数を配列にして返す
     *              Returns an array of variables in the class
     *
     * @return {array}
     * @method
     * @public
     */
    toParamArray ()
    {
        return [null, this.blurX, this.blurY, this.quality];
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
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
