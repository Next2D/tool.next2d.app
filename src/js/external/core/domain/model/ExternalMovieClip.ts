import type { MovieClip } from "@/core/domain/model/MovieClip";
import { ExternalItem } from "./ExternalItem";
import { ExternalLayer } from "./ExternalLayer";

/**
 * @description MovieClipの外部APIクラス
 *              MovieClip external API classes
 * @class
 */
export class ExternalMovieClip extends ExternalItem
{
    private readonly _$movieClip: MovieClip;

    /**
     * @constructor
     * @public
     */
    constructor (movie_clip: MovieClip)
    {
        super();

        /**
         * @type {MovieClip}
         * @private
         */
        this._$movieClip = movie_clip;
    }

    /**
     * @description MovieClipのフレーム情報を更新
     *              Update MovieClip frame information
     *
     * @member {number}
     * @readonly
     * @public
     */
    get currentFrame (): number
    {
        return this._$movieClip.currentFrame;
    }
    set currentFrame (frame: number)
    {
        this._$movieClip.currentFrame = frame;
    }

    /**
     * @description MovieClipの全てのレイヤーを配列で返却
     *              Return all layers in MovieClip as an array
     *
     * @member {ExternalLayer[]}
     * @readonly
     * @public
     */
    get layers (): ExternalLayer[]
    {
        const layers = this._$movieClip.layers;

        const externalLayers = [];
        for (let idx = 0; idx < layers.length; ++idx) {
            externalLayers.push(new ExternalLayer(layers[idx]));
        }

        return externalLayers;
    }

    /**
     * @description 新規レイヤーを作成
     *              Create a new layer
     *
     * @param  {string} [name = ""]
     * @param  {number} [index = 0]
     * @return {ExternalLayer}
     * @method
     * @public
     */
    createLayer (name: string = "", index: number = 0): ExternalLayer
    {
        // 新規レイヤーを作成して、指定indexに配置
        const layer = this._$movieClip.createLayer(name);
        this._$movieClip.setLayer(layer, index);

        return new ExternalLayer(layer);
    }
}