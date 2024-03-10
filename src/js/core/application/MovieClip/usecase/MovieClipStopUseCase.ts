import { execute as timelineLayerAllClearSelectedElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAllClearSelectedElementUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameClearSelectedUseCase } from "@/timeline/application/TimelineLayerFrame/usecase/TimelineLayerFrameClearSelectedUseCase";

/**
 * @description MovieClipの終了処理
 *              Exit Process for MovieClip
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 選択中のElementを初期化
    timelineLayerAllClearSelectedElementUseCase();

    // タイムラインのフレーム選択の情報を初期化
    timelineLayerFrameClearSelectedUseCase();
    timelineLayer.clear();
};