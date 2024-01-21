import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description Layerの外部APIクラス
 *              Layer external API classes
 * @class
 */
export class ExternalLayer
{
    private readonly _$layer: Layer;

    /**
     * @param {Layer} layer
     * @constructor
     * @public
     */
    constructor (layer: Layer)
    {
        /**
         * @type {Layer}
         * @private
         */
        this._$layer = layer;
    }

    /**
     * @description Layerオブジェクトの識別ID
     *              Identification ID of the Layer object
     *
     * @member {number}
     * @readonly
     * @public
     */
    get id (): number
    {
        return this._$layer.id;
    }
}