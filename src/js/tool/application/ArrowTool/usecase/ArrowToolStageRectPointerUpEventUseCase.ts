import { EventType } from "@/tool/domain/event/EventType";
import { execute as arrowToolStageRectPointerMoveEventUseCase } from "./ArrowToolStageRectPointerMoveEventUseCase";
import { execute as stageRectHideService } from "@/screen/application/StageRect/service/StageRectHideService";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import {
    $SCREEN_STAGE_AREA_ID,
    $SCREEN_STAGE_RECT_ID
} from "@/config/ScreenConfig";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";

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

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // ポインターイベントを解除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE, arrowToolStageRectPointerMoveEventUseCase);
    element.removeEventListener(EventType.MOUSE_UP, execute);

    // 範囲選択のElementを表示
    const rectElement: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_RECT_ID);

    if (!rectElement) {
        stageRectHideService();
        return ;
    }

    const width  = rectElement.clientWidth;
    const height = rectElement.clientHeight;
    if (!width || !height) {
        // 範囲選択のElementを非表示
        stageRectHideService();
        return ;
    }

    const left    = rectElement.offsetLeft - $getScreenOffsetLeft();
    const top     = rectElement.offsetTop - $getScreenOffsetTop();
    const right   = left + width;
    const bottom  = top  + height;
    console.log(left, top, width, height);

    // 範囲選択のElementを非表示
    stageRectHideService();

    const stageAreaElement = document.getElementById($SCREEN_STAGE_AREA_ID);
    if (!stageAreaElement) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const externalScreen = new ExternalScreen(workSpace, movieClip);

    const frame = movieClip.currentFrame;
    for (let idx = 0; movieClip.layers.length > idx; ++idx) {

        const layer = movieClip.layers[idx];
        if (!layer) {
            continue ;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        if (!activeCharacters.length) {
            continue ;
        }

        const depths = [];
        for (let idx = 0; activeCharacters.length > idx; ++idx) {

            const character = activeCharacters[idx];
            if (!character) {
                continue ;
            }

            switch (true) {

                case character.y + character.height < top:
                case character.y > bottom:
                case character.x + character.width < left:
                case character.x > right:
                    continue;

                default:
                    break;

            }

            depths.push(character.depth);
        }

        if (!depths.length) {
            continue ;
        }

        const externalLayer = new ExternalLayer(workSpace, movieClip, layer);

        // 範囲選択の対象のDisplayObjectを選択
        externalScreen
            .selectDisplayObjects(
                externalLayer.index,
                depths,
                true
            );

    }
};