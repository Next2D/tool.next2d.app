import { $getLayerFromElement } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAltSelectedUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAltSelectedUseCase";
import { execute as timelineLayerShiftSelectedUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerShiftSelectedUseCase";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { execute as timelineLayerControllerRegisterWindowEventUseCase } from "./TimelineLayerControllerRegisterWindowEventUseCase";

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
    const movieClip = workSpace.scene;

    switch (true) {

        case event.altKey || event.metaKey:
            timelineLayerAltSelectedUseCase(movieClip, layer);
            break;

        case event.shiftKey:
            timelineLayerShiftSelectedUseCase(movieClip, layer);
            break;

        default:
            {
                // 外部APIを起動
                const externalLayer    = new ExternalLayer(workSpace, movieClip, layer);
                const externalTimeline = new ExternalTimeline(workSpace, movieClip);

                // 単体選択の外部APIを実行
                externalTimeline
                    .selectedLayers([externalLayer.index]);
            }
            break;

    }

    // レイヤーの移動イベントを登録
    timelineLayerControllerRegisterWindowEventUseCase();
};