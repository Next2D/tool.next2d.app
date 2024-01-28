import { $getLayerFromElement } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import { execute as externalTimelineLayerControllerNormalSelectUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerNormalSelectUseCase";

/**
 * @description レイヤーのコントローラーエリアのマウスダウン処理関数
 *              Mouse down processing function for the controller area of a layer
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

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 指定のLayerオブジェクトを取得
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    switch (true) {

        case event.altKey:
            break;

        case event.shiftKey:
            break;

        default:
            // 単体選択の外部APIを実行
            externalTimelineLayerControllerNormalSelectUseCase(
                workSpace, workSpace.scene, layer, timelineFrame.currentFrame
            );
            break;

    }
};