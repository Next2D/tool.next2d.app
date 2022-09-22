/**
 * 各種Filterの親クラスで、共通処理が定義されてます。
 * Common processes are defined in the parent classes of various Filters.
 *
 * @class
 * @memberOf filter
 */
class Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        this._$blurX   = 4;
        this._$blurY   = 4;
        this._$quality = 1;
        this._$state   = true;
        this._$name    = "";

        if (object) {
            this.blurX   = object.blurX;
            this.blurY   = object.blurY;
            this.quality = object.quality | 0;
            this.state   = object.state;
        }
    }

    /**
     * @description 子のクラスのクローンを生成
     *              Generate a clone of the child class
     *
     * @return {Filter}
     * @method
     * @public
     */
    clone ()
    {
        return new this.constructor(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
     * @description 指定されたフィルターと同一の設定がないか判定
     *              Determine if there are any settings identical to the specified filter
     *
     * @param  {Filter} filter
     * @return {boolean}
     * @method
     * @public
     */
    isSame (filter)
    {
        if (this._$quality !== filter._$quality) {
            return false;
        }

        if (this._$blurX !== filter._$blurX) {
            return false;
        }

        if (this._$blurY !== filter._$blurY) {
            return false;
        }

        return true;
    }

    /**
     * @description 水平方向のぼかし量。
     *              The amount of horizontal blur.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get blurX ()
    {
        return this._$blurX;
    }
    set blurX (blur_x)
    {
        this._$blurX = Util.$clamp(
            +blur_x,
            FilterController.MIN_BLUR,
            FilterController.MAX_BLUR
        );
    }

    /**
     * @description 垂直方向のぼかし量。
     *              The amount of vertical blur.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get blurY ()
    {
        return this._$blurY;
    }
    set blurY (blur_y)
    {
        this._$blurY = Util.$clamp(
            +blur_y,
            FilterController.MIN_BLUR,
            FilterController.MAX_BLUR
        );
    }

    /**
     * @description ぼかしの実行回数です。
     *              The number of times to perform the blur.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get quality ()
    {
        return this._$quality;
    }
    set quality (quality)
    {
        this._$quality = Util.$clamp(quality | 0, 1, 3);
    }

    /**
     * @description コントローラーの表示/非表示のフラグ
     *              Flag to show/hide controllers
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get state ()
    {
        return this._$state;
    }
    set state (state)
    {
        this._$state = state;
    }

    /**
     * @description 子のFilterクラスのクラス名
     *              Class name of the child Filter class
     *
     * @member {string}
     * @default ""
     * @public
     */
    get name ()
    {
        return this._$name;
    }
    set name (name)
    {
        this._$name = name;
    }
}
