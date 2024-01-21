import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalItem } from "./ExternalItem";
import { ExternalLayer } from "./ExternalLayer";
import { execute as externalMovieClipCreateLayerUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipCreateLayerUseCase";

/**
 * @description MovieClipの外部APIクラス
 *              MovieClip external API classes
 * @class
 */
export class ExternalMovieClip extends ExternalItem
{
    private readonly _$movieClip: MovieClip;
    private readonly _$workSpace: WorkSpace;

    /**
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip
    ) {

        super(movie_clip);

        /**
         * @type {WorkSpace}
         * @private
         */
        this._$workSpace = work_space;

        /**
         * @type {MovieClip}
         * @private
         */
        this._$movieClip = movie_clip;
    }

    /**
     * @description 指定したMovieClipの識別ID
     *              Identification ID of the specified MovieClip
     *
     * @return {number}
     * @readonly
     * @public
     */
    get id (): number
    {
        return this._$movieClip.id;
    }

    /**
     * @description MovieClipのアクティブ状態を返却
     *              Returns the active state of MovieClip
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get active (): boolean
    {
        return this._$movieClip.active;
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
     * @param  {string} [color = ""]
     * @return {ExternalLayer | null}
     * @method
     * @public
     */
    createLayer (
        name: string = "",
        index: number = 0,
        color: string = ""
    ): ExternalLayer | null {

        // 新規レイヤーを作成して、指定indexに配置
        const layer = externalMovieClipCreateLayerUseCase(
            this._$workSpace,
            this._$movieClip,
            name, index, color
        );

        return layer ? new ExternalLayer(layer) : null;
    }
}