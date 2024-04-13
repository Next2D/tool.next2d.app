import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as externalTimelineChageFrameUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineChageFrameUseCase";
import { execute as externalTimelineLayerDeactivateLayerUseCase } from "@/external/timeline/application/ExternalTimelineLayer/usecase/ExternalTimelineLayerDeactivateLayerUseCase";
import { execute as externalTimelineLayerControllerSelectedLayersUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerSelectedLayersUseCase";
import { execute as externalTimelineLayerControllerBehindUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerBehindUseCase";
import { execute as externalTimelineAddNewLayerUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineAddNewLayerUseCase";
import { execute as externalTimelineDeleteLayerUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineDeleteLayerUseCase";
import { execute as externalTimelineLayerFrameConvertToEmptyKeyframesUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameConvertToEmptyKeyframesUseCase";
import { execute as externalTimelineLayerFrameConvertToKeyframesUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameConvertToKeyframesUseCase";
import { execute as externalTimelineLayerFrameSelectedFramesUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameSelectedFramesUseCase";
import { execute as externalTimelineLayerDeactivatedAllLayerUseCase } from "@/external/timeline/application/ExternalTimelineLayer/usecase/ExternalTimelineLayerDeactivatedAllLayerUseCase";
import { execute as externalTimelineLayerFrameInsertFramesUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameInsertFramesUseCase";
import { execute as externalTimelineAddItemToMovieClipUseCase } from "@/external/timeline/application/ExternalTimeline/usecase/ExternalTimelineAddItemToMovieClipUseCase";
import { execute as externalTimelineLayerFrameRemoveFrameUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameRemoveFrameUseCase";
import { execute as externalTimelineLayerFrameDeleteKeyframesUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameDeleteKeyframesUseCase";

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
     * @description 選択中のレイヤーにキーフレームを追加
     *              Add a keyframe to the selected layer
     *
     * @param  {number} start_frame
     * @param  {number} end_frame
     * @return {void}
     * @method
     * @public
     */
    convertToKeyframes (start_frame: number, end_frame: number = 0): void
    {
        externalTimelineLayerFrameConvertToKeyframesUseCase(
            this._$workSpace,
            this._$movieClip,
            start_frame,
            end_frame
        );
    }

    /**
     * @description 選択中のレイヤーに空のキーフレームを追加
     *              Add an empty key frame to the selected layer
     *
     * @param  {number} start_frame
     * @param  {number} end_frame
     * @return {void}
     * @method
     * @public
     */
    convertToEmptyKeyframes (start_frame: number, end_frame: number = 0): void
    {
        externalTimelineLayerFrameConvertToEmptyKeyframesUseCase(
            this._$workSpace,
            this._$movieClip,
            start_frame,
            end_frame
        );
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
        externalTimelineChageFrameUseCase(
            this._$workSpace,
            this._$movieClip,
            frame
        );

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
     * @param  {number} [layer_id = -1]
     * @param  {boolean} [receiver = false]
     * @return {ExternalLayer | null}
     * @method
     * @public
     */
    addNewLayer (
        index: number = 0,
        name: string = "",
        color: string = "",
        layer_id: number = -1,
        receiver: boolean = false
    ): ExternalLayer | null {

        // レイヤーの選択状態を初期化
        // fixed logic
        this.deactivatedAllLayers();

        const externalLayer = externalTimelineAddNewLayerUseCase(
            this._$workSpace,
            this._$movieClip,
            index, name, color, layer_id, receiver
        );

        // 追加したレイヤーを選択状態に更新
        if (externalLayer) {
            this.selectedLayers([externalLayer.index]);
        }

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

        if (!indexes.length) {
            return ;
        }

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
     * @description 指定したフレーム番号のフレームをアクティブにする
     *              Activate the frame with the specified frame number
     *
     * @param  {array} frames
     * @return {void}
     * @method
     * @public
     */
    selectedFrames (frames: number[]): void
    {
        externalTimelineLayerFrameSelectedFramesUseCase(
            this._$workSpace,
            this._$movieClip,
            frames
        );
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
        externalTimelineLayerDeactivatedAllLayerUseCase(
            this._$workSpace,
            this._$movieClip
        );
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
        // 指定のレイヤーを非アクティブ化する
        externalTimelineLayerDeactivateLayerUseCase(
            this._$workSpace, this._$movieClip, indexes
        );
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

    /**
     * @description 選択中のフレームに指定数のフレームを挿入
     *              Insert the specified number of frames into the selected frames
     *
     * @param  {number} num_frame
     * @return {void}
     * @method
     * @public
     */
    insertFrames (num_frame: number): void
    {
        externalTimelineLayerFrameInsertFramesUseCase(
            this._$workSpace,
            this._$movieClip,
            num_frame
        );
    }

    /**
     * @description 選択中の範囲のフレームを削除
     *              Delete the frames in the selected range
     *
     * @param  {number} start_frame
     * @param  {number} [end_frame = 0]
     * @return {void}
     * @method
     * @public
     */
    eraseFrames (start_frame: number, end_frame: number = 0): void
    {
        externalTimelineLayerFrameRemoveFrameUseCase(
            this._$workSpace,
            this._$movieClip,
            start_frame,
            end_frame
        );
    }

    /**
     * @description 選択中の範囲のキーフレームを削除
     *              Delete the keyframes in the selected range
     *
     * @param  {number} start_frame
     * @param  {number} [end_frame = 0]
     * @return {void}
     * @method
     * @public
     */
    deleteKeyframes (start_frame: number, end_frame: number = 0): void
    {
        externalTimelineLayerFrameDeleteKeyframesUseCase(
            this._$workSpace,
            this._$movieClip,
            start_frame,
            end_frame
        );
    }

    /**
     * @description 選択中アイテムをアクティブなMovieClipの指定xy座標に追加
     *              Add selected items to the specified xy coordinates of the active MovieClip
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {string} path
     * @return {Promise}
     * @method
     * @public
     */
    async addItemToMovieClip (
        x: number,
        y: number,
        path: string,
        indexes: number[] = []
    ): Promise<void> {
        await externalTimelineAddItemToMovieClipUseCase(
            this._$workSpace,
            this._$movieClip,
            x, y, path, indexes
        );
    }
}