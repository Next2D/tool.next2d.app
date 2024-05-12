import { EventType } from "@/tool/domain/event/EventType";
import { execute as arrowToolStageRectWindowMouseMoveEventUseCase } from "./ArrowToolStageRectWindowMouseMoveEventUseCase";
import { execute as stageRectHideService } from "@/screen/application/StageRect/service/StageRectHideService";
import { $SCREEN_STAGE_AREA_ID, $SCREEN_STAGE_RECT_ID } from "@/config/ScreenConfig";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description 範囲選択のマウスアップイベントの実行関数
 *              Execution function of the mouse-up event of the range selection
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を停止
    event.stopPropagation();
    event.preventDefault();

    // windowイベントを解除
    window.removeEventListener(EventType.MOUSE_MOVE, arrowToolStageRectWindowMouseMoveEventUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);

    // 範囲選択のElementを表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_RECT_ID);

    if (!element) {
        return ;
    }

    const width  = element.clientWidth;
    const height = element.clientHeight;
    if (!width || !height) {
        // 範囲選択のElementを非表示
        stageRectHideService();
        return ;
    }

    const left    = element.offsetLeft;
    const top     = element.offsetTop;
    const right   = left + width;
    const bottom  = top  + height;

    // 範囲選択のElementを非表示
    stageRectHideService();

    const stageAreaElement = document.getElementById($SCREEN_STAGE_AREA_ID);
    if (!stageAreaElement) {

        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const externalScreen = new ExternalScreen(workSpace, movieClip);

    const elements = stageAreaElement.querySelectorAll(".display-object");
    for (let idx = 0; idx < elements.length; ++idx) {

        const node = elements[idx] as HTMLElement;
        if (!node) {
            continue ;
        }

        const rect = node.getBoundingClientRect();
        switch (true) {

            case rect.bottom < top:
            case rect.top    > bottom:
            case rect.right  < left:
            case rect.left   > right:
                continue;

            default:
                break;

        }

        const layer = movieClip.getLayerById(parseInt(node.dataset.layerId as string));
        if (!layer) {
            continue ;
        }

        const externalLayer = new ExternalLayer(workSpace, movieClip, layer);

        // 範囲選択の対象のDisplayObjectを選択
        externalScreen
            .selectDisplayObjects(
                externalLayer.index,
                [parseInt(node.dataset.depth as string)],
                true
            );
    }
};