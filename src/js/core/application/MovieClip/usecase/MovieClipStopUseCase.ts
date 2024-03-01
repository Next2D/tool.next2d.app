import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";

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
    timelineLayerAllClearSelectedElementService();
};