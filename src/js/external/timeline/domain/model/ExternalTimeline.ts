import type { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";
import type { ExternalWorkSpace } from "@/external/core/domain/model/ExternalWorkSpace";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { execute as externalTimelineChageFrameUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineChageFrameUseCase";
import { execute as timelineToolLayerAddUseCase } from "@/timeline/application/TimelineTool/application/LayerAdd/usecase/TimelineToolLayerAddUseCase";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description タイムラインの外部APIクラス
 *              Timeline External API Class
 *
 * @class
 */
export class ExternalTimeline
{
    private readonly _$externalMovieClip: ExternalMovieClip;
    private readonly _$externalWorkSpace: ExternalWorkSpace;

    /**
     * @param {ExternalMovieClip} external_movie_clip
     * @param {ExternalWorkSpace} external_work_space
     * @constructor
     * @public
     */
    constructor (
        external_movie_clip: ExternalMovieClip,
        external_work_space: ExternalWorkSpace
    ) {
        /**
         * @type {ExternalMovieClip}
         * @private
         */
        this._$externalMovieClip = external_movie_clip;

        /**
         * @type {ExternalWorkSpace}
         * @private
         */
        this._$externalWorkSpace = external_work_space;
    }

    /**
     * @description 指定のフレームをアクティブにする
     *              Activate the specified frame
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    changeFrame (frame: number): void
    {
        frame = $clamp(frame, 1, Number.MAX_VALUE);

        if (this._$externalWorkSpace.active) {
            // アクティブなら表示も更新
            externalTimelineChageFrameUseCase(frame);
        } else {
            this._$externalMovieClip.currentFrame = frame;
        }
    }

    /**
     * @description 新規レイヤーを追加
     *              Add new layer
     *
     * @param  {string} [name = ""]
     * @param  {number} [index = 0]
     * @return {void}
     * @method
     * @public
     */
    addNewLayer (name: string = "", index: number = 0): void
    {
        if (!this._$externalWorkSpace.active
            || !this._$externalMovieClip.active
        ) {
            // 表示されてなければ、データだけ登録
            this
                ._$externalMovieClip
                .createLayer(name, index);
            return ;
        }

        // 指定されたレイヤーを選択状態にする
        this.setSelectedLayer(index);

        // レイヤーを追加
        timelineToolLayerAddUseCase(
            this._$externalWorkSpace.id,
            this._$externalMovieClip.id
        );
    }

    /**
     * @description 指定したindex値のレイヤーをアクティブにする
     *              Activate the layer with the specified index value
     *
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    setSelectedLayer (index: number): void
    {
        const externalLayers = this._$externalMovieClip.layers;

        const externalLayer = externalLayers[index];
        if (!externalLayer) {
            return ;
        }

        timelineLayerControllerNormalSelectUseCase(externalLayer.id);
    }
}