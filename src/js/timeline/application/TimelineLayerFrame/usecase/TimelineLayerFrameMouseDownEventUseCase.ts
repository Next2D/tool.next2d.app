import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLayerFromElement } from "../../TimelineUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerFrameMouseMoveEventUseCase } from "./TimelineLayerFrameMouseMoveEventUseCase";
import { execute as timelineLayerFrameFirstSelectedService } from "../service/TimelineLayerFrameFirstSelectedService";
import { execute as timelineLayerFrameClearSelectedUseCase } from "./TimelineLayerFrameClearSelectedUseCase";

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

    // 表示を初期化
    // fixed logic
    timelineLayerFrameClearSelectedUseCase();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const frame = parseInt(element.dataset.frame as NonNullable<string>);

    // 外部APIを起動
    const externalLayer    = new ExternalLayer(workSpace, movieClip, layer);
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // 単体選択の外部APIを実行
    externalTimeline
        .selectedLayers(externalLayer.index);

    // 最初に選択したフレームとレイヤーをセット
    timelineLayerFrameFirstSelectedService(frame, layer);

    // フレーム選択イベントを登録
    window.addEventListener(EventType.MOUSE_MOVE,
        timelineLayerFrameMouseMoveEventUseCase
    );
};