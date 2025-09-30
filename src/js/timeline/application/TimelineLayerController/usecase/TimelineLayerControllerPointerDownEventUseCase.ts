import { $getLayerFromElement, $setMoveLayerMode } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAltSelectedUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAltSelectedUseCase";
import { execute as timelineLayerShiftSelectedUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerShiftSelectedUseCase";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { execute as timelineLayerControllerActiveExitIconElementService } from "../service/TimelineLayerControllerActiveExitIconElementService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameSelectedAllClearUseCase } from "@/timeline/application/TimelineLayerFrame/usecase/TimelineLayerFrameSelectedAllClearUseCase";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerPointerMoveUseCase } from "./TimelineLayerControllerPointerMoveUseCase";
import { execute as timelineLayerControllerPointerUpUseCase } from "./TimelineLayerControllerPointerUpUseCase";

/**
 * @description レイヤーのコントローラーエリアのマウスダウン処理関数
 *              Mouse down processing function for the controller area of a layer
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
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

    // 再生中なら停止
    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 選択中のフレームを全て非アクティブにする
    timelineLayerFrameSelectedAllClearUseCase(movieClip);

    switch (true) {

        case event.altKey || event.metaKey:
            await timelineLayerAltSelectedUseCase(workSpace, movieClip, layer);
            break;

        case event.shiftKey:
            await timelineLayerShiftSelectedUseCase(movieClip, layer);
            break;

        default:
            if (movieClip.selectedLayers.indexOf(layer) === -1) {
                // 外部APIを起動
                const externalLayer    = new ExternalLayer(workSpace, movieClip, layer);
                const externalTimeline = new ExternalTimeline(workSpace, movieClip);

                // 単体選択の外部APIを実行
                await externalTimeline
                    .selectedLayers([externalLayer.index]);

            }
            break;

    }

    switch (layer.mode) {

        case 2: // マスクの子レイヤー
        case 4: // ガイドの子レイヤー
            timelineLayerControllerActiveExitIconElementService(element);
            break;

        default:
            break;

    }

    // 移動先のレイヤーを未選択に更新
    timelineLayer.distIndex = -1;

    // レイヤーの移動モードを設定
    $setMoveLayerMode(true);

    // ポインターイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        timelineLayerControllerPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        timelineLayerControllerPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        timelineLayerControllerPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        timelineLayerControllerPointerUpUseCase
    );
};