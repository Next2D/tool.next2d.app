/**
 * @class
 * @extends {Filter}
 */
class GradientGlowFilter extends Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
     */
    constructor (object = null)
    {
        super(object);
        this.name = "GradientGlowFilter";

        this._$distance = 4;
        this._$angle    = 45;
        this._$colors   = [0xffffff, 0];
        this._$alphas   = [0, 100];
        this._$ratios   = [0, 255];
        this._$strength = 1;
        this._$type     = "outer";
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
     * @return {number}
     * @public
     */
    get distance ()
    {
        return this._$distance;
    }

    /**
     * @param  {number} distance
     * @return {void}
     * @public
     */
    set distance (distance)
    {
        this._$distance = Util.$clamp(
            +distance,
            FilterController.MIN_DISTANCE,
            FilterController.MAX_DISTANCE
        );
    }

    /**
     * @return {number}
     * @public
     */
    get angle ()
    {
        return this._$angle;
    }

    /**
     * @param  {number} angle
     * @return {void}
     * @public
     */
    set angle (angle)
    {
        this._$angle = +angle % 360;
    }

    /**
     * @return {array}
     * @public
     */
    get colors ()
    {
        return this._$colors;
    }

    /**
     * @param  {array} colors
     * @return {void}
     * @public
     */
    set colors (colors)
    {
        this._$colors.length = 0;
        this._$colors = colors;
    }

    /**
     * @return {array}
     * @public
     */
    get alphas ()
    {
        return this._$alphas;
    }

    /**
     * @param  {array} alphas
     * @return {void}
     * @public
     */
    set alphas (alphas)
    {
        this._$alphas.length = 0;
        for (let idx = 0; idx < alphas.length; ++idx) {
            this._$alphas.push(alphas[idx] * 100);
        }
    }

    /**
     * @return {array}
     * @public
     */
    get ratios ()
    {
        return this._$ratios;
    }

    /**
     * @param  {array} ratios
     * @return {void}
     * @public
     */
    set ratios (ratios)
    {
        this._$ratios.length = 0;
        for (let idx = 0; idx < ratios.length; ++idx) {
            this._$ratios.push(ratios[idx] * 255);
        }
    }

    /**
     * @return {number}
     * @public
     */
    get strength ()
    {
        return this._$strength;
    }

    /**
     * @param  {number} strength
     * @return {void}
     * @public
     */
    set strength (strength)
    {
        this._$strength = Util.$clamp(
            +strength,
            FilterController.MIN_STRENGTH,
            FilterController.MAX_STRENGTH
        );
    }

    /**
     * @return {string}
     * @public
     */
    get type ()
    {
        return this._$type;
    }

    /**
     * @param  {string} type
     * @return {void}
     * @public
     */
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
     * @return {boolean}
     * @public
     */
    get knockout ()
    {
        return this._$knockout;
    }

    /**
     * @param  {boolean} knockout
     * @return {void}
     * @public
     */
    set knockout (knockout)
    {
        this._$knockout = !!knockout;
    }

    /**
     * @return {object}
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
     * @param  {GradientGlowFilter} filter
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
     * @return {window.next2d.filters.GradientGlowFilter}
     * @public
     */
    createInstance ()
    {
        const object = this.adjustment();
        return new window.next2d.filters.GradientGlowFilter(
            this.distance, this.angle, object.colors, object.alphas,
            object.ratios, this.blurX, this.blurY, this.strength,
            this.quality, this.type, this.knockout
        );
    }

    /**
     * @return {array}
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
     * @return {object}
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
