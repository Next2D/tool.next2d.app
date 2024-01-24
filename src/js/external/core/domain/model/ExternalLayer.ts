import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalLayerUpdateNameUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateNameUseCase";
import { execute as timelineLayerControllerLayerNameUpdateHistoryUseCase } from "@/history/application/timeline/TimelineLayerController/LayerName/usecase/TimelineLayerControllerLayerNameUpdateHistoryUseCase";

/**
 * @description Layerの外部APIクラス
 *              Layer external API classes
 * @class
 */
export class ExternalLayer
{
    private readonly _$layer: Layer;
    private readonly _$workSpace: WorkSpace;
    private readonly _$movieClip: MovieClip;

    /**
     * @param {Layer} layer
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip,
        layer: Layer
    ) {
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

        /**
         * @type {Layer}
         * @private
         */
        this._$layer = layer;
    }

    /**
     * @description レイヤー名を返却
     *              Layer name returned
     *
     * @member {string}
     * @public
     */
    get name (): string
    {
        return this._$layer.name;
    }
    set name (name: string)
    {
        if (!name) {
            name = "Layer";
        }

        // 変更がなければ終了
        if (this._$layer.name === name) {
            return ;
        }

        // 作業履歴を登録
        timelineLayerControllerLayerNameUpdateHistoryUseCase(
            this._$workSpace, this._$movieClip, this._$layer, name
        );

        // レイヤー名を更新
        externalLayerUpdateNameUseCase(
            this._$workSpace, this._$movieClip, this._$layer, name
        );
    }
}