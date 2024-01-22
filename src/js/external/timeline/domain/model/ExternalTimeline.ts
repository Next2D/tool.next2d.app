import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { execute as externalTimelineChageFrameUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineChageFrameUseCase";
import { execute as timelineToolLayerAddUseCase } from "@/timeline/application/TimelineTool/application/LayerAdd/usecase/TimelineToolLayerAddUseCase";
import { $clamp } from "@/global/GlobalUtil";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description タイムラインの外部APIクラス
 *              Timeline External API Class
 *
 * @class
 */
export class ExternalTimeline
{
    private readonly _$workSpace: WorkSpace;
    private readonly _$movieClip: MovieClip;

    /**
     * @param {WorkSpace} work_space
     * @param {MovieClip} movie_clip
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip
    ) {
        /**
         * @type {ExternalMovieClip}
         * @private
         */
        this._$workSpace = work_space;

        /**
         * @type {ExternalWorkSpace}
         * @private
         */
        this._$movieClip = movie_clip;
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

        if (this._$workSpace.active) {
            // アクティブなら表示も更新
            externalTimelineChageFrameUseCase(frame);
        } else {
            this._$movieClip.currentFrame = frame;
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
        if (!this._$workSpace.active
            || !this._$movieClip.active
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
            this._$workSpace.id,
            this._$movieClip.id
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
        const layers = this._$movieClip.layers;

        const layer = layers[index];
        if (!layer) {
            return ;
        }

        timelineLayerControllerNormalSelectUseCase(layer);
    }
}