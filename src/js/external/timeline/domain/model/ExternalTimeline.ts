import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { $clamp } from "@/global/GlobalUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $convertFrameObject } from "@/timeline/application/TimelineUtil";
import { execute as externalTimelineChageFrameUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineChageFrameUseCase";
import { execute as externalTimelineLayerDeactivateLayerUseCase } from "@/external/timeline/application/ExternalTimelineLayer/usecase/ExternalTimelineLayerDeactivateLayerUseCase";
import { execute as externalTimelineLayerControllerSelectedLayersUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerSelectedLayersUseCase";
import { execute as externalTimelineLayerFrameSelectedUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameSelectedUseCase";
import { execute as timelineLayerAllClearSelectedElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAllClearSelectedElementUseCase";
import { execute as externalTimelineLayerControllerBehindUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerBehindUseCase";
import { execute as externalTimelineAddNewLayerUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineAddNewLayerUseCase";
import { execute as externalTimelineDeleteLayerUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineDeleteLayerUseCase";

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
     * @description TODO
     *
     * @param {number} start_frame
     * @param {number} end_frame
     * @return {void}
     * @method
     * @public
     */
    convertToKeyframes (start_frame: number, end_frame: number = 0): void
    {
        console.log("TODO convertToKeyframes");

        // 選択中のレイヤーがなければ終了
        if (!this._$movieClip.selectedLayers.length) {
            return ;
        }

        const frameObject = $convertFrameObject(start_frame, end_frame);
        console.log(frameObject);
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

        if (this._$workSpace.active && this._$movieClip.active) {
            // アクティブなら表示を非アクティブに更新
            externalTimelineChageFrameUseCase(frame);
        }

        // 内部情報を更新
        this._$movieClip.currentFrame = frame;

        // 選択中のLayerを解放
        this.deactivatedAllLayers();
    }

    /**
     * @description 新規レイヤーを追加
     *              Add new layer
     *
     * @param  {number} [index = 0]
     * @param  {string} [name = ""]
     * @param  {string} [color = ""]
     * @param  {boolean} [receiver = false]
     * @return {ExternalLayer | null}
     * @method
     * @public
     */
    addNewLayer (
        index: number = 0,
        name: string = "",
        color: string = "",
        receiver: boolean = false
    ): ExternalLayer | null {

        // レイヤーの選択状態を初期化
        // fixed logic
        this.deactivatedAllLayers();

        const externalLayer = externalTimelineAddNewLayerUseCase(
            this._$workSpace,
            this._$movieClip,
            index, name, color, receiver
        );

        if (!externalLayer) {
            return null;
        }

        // 追加したレイヤーを選択状態に更新
        this.selectedLayers([externalLayer.index]);

        return externalLayer;
    }

    /**
     * @description 指定したindexのレイヤーを削除
     *              Delete layer of specified index
     *
     * @param  {array} indexes
     * @param  {boolean} [receiver = false]
     * @return {void}
     * @method
     * @public
     */
    deleteLayer (
        indexes: number[],
        receiver: boolean = false
    ): void {

        // 削除前に非アクティブに更新
        this.deactivatedLayer(indexes);

        externalTimelineDeleteLayerUseCase(
            this._$workSpace,
            this._$movieClip,
            indexes,
            receiver
        );

        // 削除後に選択状態を更新
        this.selectedLayers([
            Math.min(...indexes, this._$movieClip.layers.length - 1)
        ]);
    }

    /**
     * @description 指定のMovieClipを編集モードに切り替える
     *              Switch the specified MovieClip to edit mode
     *
     * @param  {MovieClip} movie_clip
     * @return {void}
     * @method
     * @public
     */
    editMovieClip (movie_clip: MovieClip): Promise<void>
    {
        if (this._$movieClip === movie_clip) {
            return Promise.resolve();
        }

        this._$movieClip = movie_clip;
        return this._$workSpace.active
            ? movie_clip.run()
            : Promise.resolve();
    }

    /**
     * @description 指定したindex値のレイヤーをアクティブにする
     *              Activate the layer with the specified index value
     *
     * @param  {array} indexes
     * @return {void}
     * @method
     * @public
     */
    selectedLayers (indexes: number[]): void
    {
        // 全ての選択を解除
        this.deactivatedAllLayers();

        // 指定のIndexを選択状態に更新
        externalTimelineLayerControllerSelectedLayersUseCase(
            this._$workSpace,
            this._$movieClip,
            indexes
        );
    }

    /**
     * @description 指定したindex値のレイヤーをアクティブにする
     *              Activate the layer with the specified index value
     *
     * @param  {array} frames
     * @return {void}
     * @method
     * @public
     */
    selectedFrames (frames: number[]): void
    {
        // 選択中のレイヤーがなければ終了
        if (!this._$movieClip.selectedLayers.length) {
            return ;
        }

        if (this._$workSpace.active && this._$movieClip.active) {
            externalTimelineLayerFrameSelectedUseCase(this._$movieClip, frames);
        }
    }

    /**
     * @description 選択中の全てのレイヤーのアクティブを解除する
     *              Deactivate all selected layers
     *
     * @return {void}
     * @method
     * @public
     */
    deactivatedAllLayers (): void
    {
        // 表示中のMovieClipなら表示側を更新
        if (this._$workSpace.active && this._$movieClip.active) {
            timelineLayerAllClearSelectedElementUseCase(this._$movieClip);
        }

        // 内部データを初期化
        this._$movieClip.clearSelectedLayer();
    }

    /**
     * @description 指定したindex値のレイヤーのアクティブを解除する
     *              Deactivates the layer with the specified index value
     *
     * @param  {array} indexes
     * @return {void}
     * @method
     * @public
     */
    deactivatedLayer (indexes: number[]): void
    {
        for (let idx = 0; idx < indexes.length; ++idx) {

            const layer: Layer | undefined = this._$movieClip.layers[indexes[idx]];
            if (!layer) {
                return ;
            }

            // 指定のレイヤーを非アクティブ化する
            externalTimelineLayerDeactivateLayerUseCase(
                this._$workSpace, this._$movieClip, layer
            );
        }
    }

    /**
     * @description 指定のindex値の後ろに選択中のレイヤーを移動
     *              Move the selected layer behind the specified index value
     *
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    behindLayer (index: number): void
    {
        externalTimelineLayerControllerBehindUseCase(
            this._$workSpace,
            this._$movieClip,
            index
        );
    }
}