import { $getLayerFromElement } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import { execute as externalTimelineLayerControllerNormalSelectUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerNormalSelectUseCase";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

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

    // 外部APIを起動
    const externalLayer    = new ExternalLayer(workSpace, workSpace.scene, layer);
    const externalTimeline = new ExternalTimeline(workSpace, workSpace.scene);

    switch (true) {

        case event.altKey:
            break;

        case event.shiftKey:
            break;

        default:
            // 単体選択の外部APIを実行
            externalTimeline.selectedLayer(
                externalLayer.index,
                timelineFrame.currentFrame
            );
            break;

    }
};