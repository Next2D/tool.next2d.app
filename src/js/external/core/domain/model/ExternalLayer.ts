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
     * @description Layer本体を返却、内部処理以外でのアクセスは非推奨
     *              Layer body returned, deprecated for access other than for internal processing
     *
     * @deprecated
     * @return {Layer}
     * @readonly
     * @public
     */
    get _$body (): Layer
    {
        return this._$layer;
    }
}