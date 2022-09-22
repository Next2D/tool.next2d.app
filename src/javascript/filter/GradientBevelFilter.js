/**
 * Next2Dのフィルターと連動したGradientBevelFilterクラス
 * GradientBevelFilter class in conjunction with Next2D filters
 *
 * @class
 * @extends {Filter}
 * @memberOf filter
 */
class GradientBevelFilter extends Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        super(object);
        this.name = "GradientBevelFilter";

        this._$distance = 4;
        this._$angle    = 45;
        this._$colors   = [0xffffff, 0xff0000, 0];
        this._$alphas   = [100, 0, 100];
        this._$ratios   = [0, 128, 255];
        this._$strength = 1;
        this._$type     = "inner";
        this._$knockout = false;

        if (object) {
            this.distance = +object.distance;
            this.angle    = +object.angle;
            this.colors   = object.colors;
            this.alphas   = object.alphas;
            this.ratios   = object.ratios;
            this.strength = +object.strength;
            this.type     = object.type;
            this.knockout = object.knockout;
        }
    }

    /**
     * @description シャドウのオフセット距離です。
     *              The offset distance for the shadow, in pixels.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get distance ()
    {
        return this._$distance;
    }
    set distance (distance)
    {
        this._$distance = Util.$clamp(
            +distance,
            FilterController.MIN_DISTANCE,
            FilterController.MAX_DISTANCE
        );
    }

    /**
     * @description シャドウの角度
     *              The angle of the shadow.
     *
     * @member  {number}
     * @default 45
     * @public
     */
    get angle ()
    {
        return this._$angle;
    }
    set angle (angle)
    {
        this._$angle = +angle % 360;
    }

    /**
     * @description グラデーションで使用する RGB 16 進数カラー値の配列です。
     *              An array of RGB hexadecimal color values to use in the gradient.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get colors ()
    {
        return this._$colors;
    }
    set colors (colors)
    {
        this._$colors.length = 0;
        this._$colors = colors;
    }

    /**
     * @description カラー配列内の各色に対応するアルファ透明度の値の配列です。
     *              An array of alpha transparency values
     *              for the corresponding colors in the colors array.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get alphas ()
    {
        return this._$alphas;
    }
    set alphas (alphas)
    {
        this._$alphas.length = 0;
        for (let idx = 0; idx < alphas.length; ++idx) {
            this._$alphas.push(alphas[idx] * 100);
        }
    }

    /**
     * @description カラー配列内の対応するカラーの色分布比率の配列です。
     *              An array of color distribution ratios
     *              for the corresponding colors in the colors array.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get ratios ()
    {
        return this._$ratios;
    }
    set ratios (ratios)
    {
        this._$ratios.length = 0;
        for (let idx = 0; idx < ratios.length; ++idx) {
            this._$ratios.push(ratios[idx] * 255);
        }
    }

    /**
     * @description インプリントの強さまたは広がりです。
     *              The strength of the imprint or spread.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get strength ()
    {
        return this._$strength;
    }
    set strength (strength)
    {
        this._$strength = Util.$clamp(
            +strength,
            FilterController.MIN_STRENGTH,
            FilterController.MAX_STRENGTH
        );
    }

    /**
     * @description オブジェクトでのベベルの配置
     *              The placement of the bevel on the object.
     *
     * @member  {string}
     * @default BitmapFilterType.INNER
     * @public
     */
    get type ()
    {
        return this._$type;
    }
    set type (type)
    {
        type = `${type}`.toLowerCase();
        switch (type) {

            case "outer":
            case "full":
                this._$type = type;
                break;

            default:
                this._$type = "inner";
                break;

        }
    }

    /**
     * @description オブジェクトにノックアウト効果を適用するかどうか
     *              Specifies whether the object has a knockout effect.
     *
     * @member  {boolean}
     * @default false
     * @public
     */
    get knockout ()
    {
        return this._$knockout;
    }
    set knockout (knockout)
    {
        this._$knockout = !!knockout;
    }

    /**
     * @description カラー、アルファー、分布比率の配列の値をバリデーションを行い算出
     *              Validated and calculated values for color, alpha, and distribution ratio arrays
     *
     * @return {object}
     * @method
     * @public
     */
    adjustment ()
    {
        const ratios = [];
        const colors = [];
        const alphas = [];

        const ratioMap = new Map();
        for (let idx = 0; idx < this._$ratios.length; ++idx) {

            const ratio = this._$ratios[idx] / 255;

            ratios.push(ratio);
            ratioMap.set(ratio, idx);
        }

        ratios.sort(function (a, b)
        {
            switch (true) {

                case a > b:
                    return 1;

                case a < b:
                    return -1;

                default:
                    return 0;

            }
        });

        for (let idx = 0; idx < ratios.length; ++idx) {

            const index = ratioMap.get(ratios[idx]);

            colors.push(this._$colors[index]);
            alphas.push(this._$alphas[index] / 100);
        }

        return {
            "ratios": ratios,
            "colors": colors,
            "alphas": alphas
        };
    }

    /**
     * @description 指定されたフィルターと同一の設定がないか判定
     *              Determine if there are any settings identical to the specified filter
     *
     * @param  {GradientBevelFilter} filter
     * @return {boolean}
     * @method
     * @public
     */
    isSame (filter)
    {
        if (this._$distance !== filter._$distance) {
            return false;
        }

        if (this._$angle !== filter._$angle) {
            return false;
        }

        for (let idx = 0; idx < this._$colors.length; ++idx) {
            if (this._$colors[idx] !== filter._$colors[idx]) {
                return false;
            }
        }

        for (let idx = 0; idx < this._$alphas.length; ++idx) {
            if (this._$alphas[idx] !== filter._$alphas[idx]) {
                return false;
            }
        }

        for (let idx = 0; idx < this._$ratios.length; ++idx) {
            if (this._$ratios[idx] !== filter._$ratios[idx]) {
                return false;
            }
        }

        if (this._$strength !== filter._$strength) {
            return false;
        }

        if (this._$type !== filter._$type) {
            return false;
        }

        if (this._$knockout !== filter._$knockout) {
            return false;
        }

        return super.isSame(filter);
    }

    /**
     * @description Next2DのGradientBevelFilterを生成
     *              Generate Next2D GradientBevelFilter
     *
     * @return {window.next2d.filters.GradientBevelFilter}
     * @method
     * @public
     */
    createInstance ()
    {
        const object = this.adjustment();
        return new window.next2d.filters.GradientBevelFilter(
            this.distance, this.angle, object.colors, object.alphas,
            object.ratios, this.blurX, this.blurY, this.strength,
            this.quality, this.type, this.knockout
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
        const object = this.adjustment();
        return [null,
            this.distance, this.angle, object.colors, object.alphas,
            object.ratios, this.blurX, this.blurY, this.strength,
            this.quality, this.type, this.knockout
        ];
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
        const object = this.adjustment();
        return {
            "name": this.name,
            "blurX": this.blurX,
            "blurY": this.blurY,
            "quality": this.quality,
            "state": this.state,
            "distance": this.distance,
            "angle": this.angle,
            "colors": object.colors,
            "alphas": object.alphas,
            "ratios": object.ratios,
            "strength": this.strength,
            "type": this.type,
            "knockout": this.knockout
        };
    }
}
