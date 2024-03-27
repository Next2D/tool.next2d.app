import { $getLayerFromElement, $setMoveLayerMode } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAltSelectedUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAltSelectedUseCase";
import { execute as timelineLayerShiftSelectedUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerShiftSelectedUseCase";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { execute as timelineLayerControllerRegisterWindowEventUseCase } from "./TimelineLayerControllerRegisterWindowEventUseCase";
import { execute as timelineLayerControllerActiveExitIconElementService } from "../service/TimelineLayerControllerActiveExitIconElementService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameAllInactiveElementUseCase } from "@/timeline/application/TimelineLayerFrame/usecase/TimelineLayerFrameAllInactiveElementUseCase";

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

    // 選択中のフレームの表示を初期化
    for (let idx = 0; idx < movieClip.selectedLayers.length; ++idx) {

        const selectedLayer = movieClip.selectedLayers[idx];
        const layerElement = timelineLayer.elements[selectedLayer.getDisplayIndex()];
        if (!layerElement) {
            continue;
        }

        timelineLayerFrameAllInactiveElementUseCase(
            layerElement.lastElementChild as NonNullable<HTMLElement>,
            movieClip
        );
    }

    // フレーム選択を初期化
    movieClip.clearSelectedFrame();

    switch (true) {

        case event.altKey || event.metaKey:
            timelineLayerAltSelectedUseCase(movieClip, layer);
            break;

        case event.shiftKey:
            timelineLayerShiftSelectedUseCase(movieClip, layer);
            break;

        default:
            if (movieClip.selectedLayers.indexOf(layer) === -1) {
                // 外部APIを起動
                const externalLayer    = new ExternalLayer(workSpace, movieClip, layer);
                const externalTimeline = new ExternalTimeline(workSpace, movieClip);

                // 単体選択の外部APIを実行
                externalTimeline
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

    // レイヤーの移動イベントを登録
    timelineLayerControllerRegisterWindowEventUseCase();
};