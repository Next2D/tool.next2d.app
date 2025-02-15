import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
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
import { execute as externalScreenSelectedFromSelectedLayersUseCase } from "@/external/screen/application/ExternalScreen/usecase/ExternalScreenSelectedFromSelectedLayersUseCase";
import { execute as externalScreenClaerSelectedDisplayObjectUseCase } from "@/external/screen/application/ExternalScreen/usecase/ExternalScreenClaerSelectedDisplayObjectUseCase";
import { execute as externalTimelineLayerFrameShiftFrameUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameShiftFrameUseCase";
import { execute as externalTimelineEditMovieClipUseService } from "@/external/timeline/application/ExternalTimeline/service/ExternalTimelineEditMovieClipUseService";
import { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";

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
     * @description アクティブなMovieClipの現在のフレームのラベル情報
     *              Label information of the current frame of the active MovieClip
     *
     * @member {string}
     * @public
     */
    get label (): string
    {
        const externalMovieClip = new ExternalMovieClip(
            this._$workSpace,
            this._$movieClip
        );
        return externalMovieClip.getLabel(this._$movieClip.currentFrame);
    }
    set label (label: string)
    {
        const externalMovieClip = new ExternalMovieClip(
            this._$workSpace,
            this._$movieClip
        );

        // todo await
        externalMovieClip.setLabel(this._$movieClip.currentFrame, label);
    }

    /**
     * @description 選択中のレイヤーにキーフレームを追加
     *              Add a keyframe to the selected layer
     *
     * @param  {number} start_frame
     * @param  {number} end_frame
     * @return {Promise<void>}
     * @method
     * @public
     */
    async convertToKeyframes (start_frame: number, end_frame: number = 0): Promise<void>
    {
        await externalTimelineLayerFrameConvertToKeyframesUseCase(
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
     * @return {Promise}
     * @method
     * @public
     */
    async convertToEmptyKeyframes (start_frame: number, end_frame: number = 0): Promise<void>
    {
        await externalTimelineLayerFrameConvertToEmptyKeyframesUseCase(
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
     * @return {Promise}
     * @method
     * @public
     */
    async changeFrame (frame: number): Promise<void>
    {
        if (!frame) {
            return ;
        }

        await externalTimelineChageFrameUseCase(
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
     * @return {Promise<ExternalLayer | null>}
     * @method
     * @public
     */
    async addNewLayer (
        index: number = 0,
        name: string = "",
        color: string = "",
        layer_id: number = -1,
        receiver: boolean = false
    ): Promise<ExternalLayer | null> {

        // レイヤーの選択状態を初期化
        // fixed logic
        this.deactivatedAllLayers();

        const externalLayer = await externalTimelineAddNewLayerUseCase(
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
     * @return {Promise}
     * @method
     * @public
     */
    async deleteLayer (
        indexes: number[],
        receiver: boolean = false
    ): Promise<void> {

        if (!indexes.length) {
            return ;
        }

        // 削除前に非アクティブに更新
        this.deactivatedLayer(indexes);

        await externalTimelineDeleteLayerUseCase(
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
     * @param  {ExternalMovieClip} external_movie_clip
     * @return {void}
     * @method
     * @public
     */
    async editMovieClip (external_movie_clip: ExternalMovieClip): Promise<void>
    {
        const movieClip = this
            ._$workSpace
            .getLibrary(external_movie_clip.id) as MovieClip;

        const editMovieClip = await externalTimelineEditMovieClipUseService(
            this._$workSpace, movieClip
        );

        if (editMovieClip) {
            this._$movieClip = editMovieClip;
        }
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

        // 選択したレイヤーのDisplayObjectを選択状態に更新
        externalScreenSelectedFromSelectedLayersUseCase(
            this._$workSpace,
            this._$movieClip
        );
    }

    /**
     * @description 指定したフレーム番号のフレームをアクティブにする
     *              Activate the frame with the specified frame number
     *
     * @param  {array} frames
     * @return {Promise}
     * @method
     * @public
     */
    async selectedFrames (frames: number[]): Promise<void>
    {
        // 指定のフレームを選択状態に更新
        externalTimelineLayerFrameSelectedFramesUseCase(
            this._$workSpace,
            this._$movieClip,
            frames
        );

        // 選択したレイヤーのDisplayObjectを選択状態に更新
        externalScreenSelectedFromSelectedLayersUseCase(
            this._$workSpace,
            this._$movieClip,
            frames
        );

        // 選択されたフレームの中の最後のフレームをセット
        let frame = frames.length > 1
            ? this._$movieClip.selectedFrameObject.end
            : frames[0];

        if (!frame) {
            frame = frames[0];
        }

        // フレーム情報に合わせてタイムラインを更新
        await externalTimelineChageFrameUseCase(
            this._$workSpace,
            this._$movieClip,
            frame
        );

        // 選択中のフレームが1つの場合、選択中のフレーム幅を更新
        if (frames.length === 1
            && this._$workSpace.active
            && this._$movieClip.active
        ) {
            this._$movieClip.selectedFrameObject.start = frame;
            this._$movieClip.selectedFrameObject.end   = frame;
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
        // 選択中のレイヤーを非アクティブ化する
        externalTimelineLayerDeactivatedAllLayerUseCase(
            this._$workSpace,
            this._$movieClip
        );

        // 選択中のDisplayObjectをクリア
        externalScreenClaerSelectedDisplayObjectUseCase(
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
     * @return {Promise}
     * @method
     * @public
     */
    async behindLayer (index: number): Promise<void>
    {
        await externalTimelineLayerControllerBehindUseCase(
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
     * @return {Promise}
     * @method
     * @public
     */
    async insertFrames (num_frame: number): Promise<void>
    {
        await externalTimelineLayerFrameInsertFramesUseCase(
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
     * @return {Promise}
     * @method
     * @public
     */
    async eraseFrames (start_frame: number, end_frame: number = 0): Promise<void>
    {
        // 選択中のDisplayObjectをクリア
        externalScreenClaerSelectedDisplayObjectUseCase(
            this._$workSpace,
            this._$movieClip
        );

        await externalTimelineLayerFrameRemoveFrameUseCase(
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
     * @return {Promise}
     * @method
     * @public
     */
    async deleteKeyframes (start_frame: number, end_frame: number = 0): Promise<void>
    {
        // 選択中のDisplayObjectをクリア
        externalScreenClaerSelectedDisplayObjectUseCase(
            this._$workSpace,
            this._$movieClip
        );

        await externalTimelineLayerFrameDeleteKeyframesUseCase(
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

    /**
     * @description 指定したフレームを一番左側にセットしてヘッダーを表示
     *              Set the specified frame to the far left and display the header
     *
     * @param  {number} frame
     * @return {Promise}
     * @method
     * @public
     */
    async shiftFrame (frame: number): Promise<void>
    {
        if (!frame) {
            return ;
        }

        // フレームを選択
        await this.selectedFrames([frame]);

        // フレームを完全に移動
        await externalTimelineLayerFrameShiftFrameUseCase(
            this._$workSpace,
            this._$movieClip,
            frame
        );
    }
}