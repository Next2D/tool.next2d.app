import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as externalTimelineChageFrameUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineChageFrameUseCase";
import { execute as externalMovieClipCreateLayerUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipCreateLayerUseCase";
import { execute as externalTimelineLayerControllerNormalSelectUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerNormalSelectUseCase";
import { $clamp } from "@/global/GlobalUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description タイムラインの外部APIクラス
 *              Timeline External API Class
 *
 * @class
 */
export class ExternalTimeline
{
    private readonly _$workSpace: WorkSpace;
    private _$movieClip: MovieClip;

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
     * @param  {number} [index = 0]
     * @param  {string} [name = ""]
     * @param  {string} [color = ""]
     * @return {voiExternalLayer | nulld}
     * @method
     * @public
     */
    addNewLayer (
        index: number = 0,
        name: string = "",
        color: string = ""
    ): ExternalLayer | null {

        // 新規レイヤーを追加
        const layer = externalMovieClipCreateLayerUseCase(
            this._$workSpace,
            this._$movieClip,
            index, name, color
        );

        return layer ? new ExternalLayer(layer) : null;
    }

    /**
     * @description 指定のMovieClipを編集モードに
     * @param  {MovieClip} movie_clip
     * @return {void}
     * @method
     * @public
     */
    editMovieClip (movie_clip: MovieClip): Promise<void>
    {
        this._$movieClip = movie_clip;
        return this._$workSpace.active
            ? movie_clip.run()
            : Promise.resolve();
    }

    /**
     * @description 指定したindex値のレイヤーをアクティブにする
     *              Activate the layer with the specified index value
     *
     * @param  {number} index
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    setSelectedLayer (
        index: number,
        frame: number
    ): void {

        const layer: Layer | undefined = this._$movieClip.layers[index];
        if (!layer) {
            return ;
        }

        // 指定のレイヤーを選択状態に更新
        externalTimelineLayerControllerNormalSelectUseCase(
            this._$workSpace, this._$movieClip, layer, frame
        );
    }
}