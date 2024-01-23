import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerFrameNormalSelectUseCase } from "./TimelineLayerFrameNormalSelectUseCase";
import { $getTopIndex } from "../../TimelineUtil";

/**
 * @description フレームエリアのマウスダウンの実行関数
 *              Execution function of mouse down in frame area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // フレーム情報を更新してマーカーを移動
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // タイムラインのAPIに指定したLayerとフレームを送る
    const externalTimeline = $getCurrentWorkSpace().getExternalTimeline();

    switch (true) {

        case event.altKey:
            break;

        case event.shiftKey:
            break;

        default:
            externalTimeline.setSelectedLayer(
                $getTopIndex() + parseInt(element.dataset.layerIndex as string),
                parseInt(element.dataset.frame as NonNullable<string>)
            );
            break;

    }
};