import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLayerFromElement, $getTopIndex } from "../../TimelineUtil";
import { execute as externalTimelineLayerControllerNormalSelectUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerNormalSelectUseCase";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

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

    // 指定のLayerオブジェクトを取得
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const frame = parseInt(element.dataset.frame as NonNullable<string>);

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
            externalTimeline.selectedLayer(externalLayer.index, frame);
            break;

    }
};