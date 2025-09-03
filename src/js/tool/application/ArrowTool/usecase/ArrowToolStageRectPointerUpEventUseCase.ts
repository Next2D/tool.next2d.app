import { EventType } from "@/tool/domain/event/EventType";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as arrowToolStageRectPointerMoveEventUseCase } from "./ArrowToolStageRectPointerMoveEventUseCase";
import { execute as stageRectHideService } from "@/screen/application/StageRect/service/StageRectHideService";
import { execute as arrowToolCreateAxesService } from "../service/ArrowToolCreateAxesService";
import { execute as arrowToolProjectOntoAxisService } from "../service/ArrowToolProjectOntoAxisService";
import {
    $SCREEN_STAGE_AREA_ID,
    $SCREEN_STAGE_RECT_ID
} from "@/config/ScreenConfig";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";

/**
 * @description 範囲選択のマウスアップイベントの実行関数
 *              Execution function of the mouse-up event of the range selection
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // ポインターイベントを解除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        arrowToolStageRectPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 範囲選択のElementを表示
    const rectElement: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_RECT_ID);

    if (!rectElement) {
        stageRectHideService();
        return ;
    }

    const stageAreaElement = document.getElementById($SCREEN_STAGE_AREA_ID);
    if (!stageAreaElement) {
        stageRectHideService();
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const scale = workSpace.scale;
    const width  = rectElement.clientWidth / scale;
    const height = rectElement.clientHeight / scale;
    if (!width && !height) {
        stageRectHideService();
        return ;
    }

    const left   = (rectElement.offsetLeft - $getScreenOffsetLeft()) / scale;
    const top    = (rectElement.offsetTop - $getScreenOffsetTop()) / scale;
    const right  = left + width;
    const bottom = top  + height;
    const rect = [
        {
            "x": left,
            "y": top
        },
        {
            "x": right,
            "y": top
        },
        {
            "x": right,
            "y": bottom
        },
        {
            "x": left,
            "y": bottom
        }
    ];

    // fixed logic 範囲選択の座標情報を取得してから非表示にする
    stageRectHideService();

    const movieClip = workSpace.scene;
    const externalScreen = new ExternalScreen(workSpace, movieClip);

    const frame = movieClip.currentFrame;
    for (let idx = 0; movieClip.layers.length > idx; ++idx) {

        const layer = movieClip.layers[idx];
        if (!layer || layer.lock) {
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

            const rawBounds = character.getRawBounds();
            if (!rawBounds) {
                continue;
            }

            const matrix = character.matrix;
            const characterRect = [
                {
                    "x": rawBounds.xMin * matrix[0] + rawBounds.yMin * matrix[2] + matrix[4],
                    "y": rawBounds.xMin * matrix[1] + rawBounds.yMin * matrix[3] + matrix[5]
                },
                {
                    "x": rawBounds.xMax * matrix[0] + rawBounds.yMin * matrix[2] + matrix[4],
                    "y": rawBounds.xMax * matrix[1] + rawBounds.yMin * matrix[3] + matrix[5]
                },
                {
                    "x": rawBounds.xMax * matrix[0] + rawBounds.yMax * matrix[2] + matrix[4],
                    "y": rawBounds.xMax * matrix[1] + rawBounds.yMax * matrix[3] + matrix[5]
                },
                {
                    "x": rawBounds.xMin * matrix[0] + rawBounds.yMax * matrix[2] + matrix[4],
                    "y": rawBounds.xMin * matrix[1] + rawBounds.yMax * matrix[3] + matrix[5]
                }
            ];

            const axes = arrowToolCreateAxesService(characterRect);

            let done = false;
            for (let idx = 0; idx < axes.length; ++idx) {
                const [ax, ay] = axes[idx];
                const a = arrowToolProjectOntoAxisService(rect, ax, ay);
                const b = arrowToolProjectOntoAxisService(characterRect, ax, ay);
                if (a[1] < b[0] || b[1] < a[0]) {
                    done = true;
                    break;
                }
            }

            if (done) {
                continue;
            }

            depths.push(character.depth);
        }

        if (!depths.length) {
            continue ;
        }

        const externalLayer = new ExternalLayer(workSpace, movieClip, layer);

        // 範囲選択の対象のDisplayObjectを選択
        await externalScreen
            .selectDisplayObjects(
                externalLayer.index,
                depths,
                true
            );

    }
};