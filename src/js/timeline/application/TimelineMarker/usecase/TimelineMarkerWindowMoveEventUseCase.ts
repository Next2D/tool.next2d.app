import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineMarkerMovePositionService } from "../service/TimelineMarkerMovePositionService";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $TIMELINE_LAYER_CONTROLLER_WIDTH } from "@/config/TimelineConfig";
import { execute as timelineHeaderUpdateScrollXUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderUpdateScrollXUseCase";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import {
    $getLeftFrame,
    $getMaxFrame,
    $getMoveMode,
    $setMoveMode
} from "../../TimelineUtil";
import { $TOOL_AERA_WIDTH } from "@/config/ToolConfig";

/**
 * @description マーカーのムーブイベントの処理関数
 *              Marker move event handling function
 *
 * @param  {PointerEvent} event
 * @param  {boolean} [loop_mode = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent, loop_mode: boolean = false): void =>
{
    // 他のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    const workSpace = $getCurrentWorkSpace();
    const timelineAreaState = workSpace.timelineAreaState;

    let offsetLeft = timelineAreaState.offsetLeft;
    if (timelineAreaState.state === "fixed") {
        offsetLeft = workSpace.toolAreaState.state === "fixed" ? $TOOL_AERA_WIDTH : 0;
    }

    const baseWidth = $TIMELINE_LAYER_CONTROLLER_WIDTH + offsetLeft;
    const minPositionX = baseWidth + timelineAreaState.frameWidth;
    const maxPositionX = timelineHeader.clientWidth + baseWidth - timelineAreaState.frameWidth / 2;

    // 移動範囲が右側を超えた場合の処理
    if (event.pageX > maxPositionX) {

        if (!loop_mode && !$getMoveMode()) {

            const width   = timelineAreaState.frameWidth + 1;
            const scrollX = Math.floor(workSpace.scene.scrollX / width) * width;

            workSpace.scene.scrollX = scrollX;

            timelineFrameUpdateFrameElementService(
                $getLeftFrame() + Math.floor(timelineHeader.clientWidth / width)
            );

        }

        // 右方向に移動
        if (timelineHeaderUpdateScrollXUseCase(timelineAreaState.frameWidth + 1) === -1) {

            // 自動移動モード終了
            $setMoveMode(false);

            return ;
        }

        // フレームをプラスに移動
        timelineFrameUpdateFrameElementService(
            Math.min(timelineFrame.currentFrame + 1, $getMaxFrame())
        );

        if (loop_mode || !$getMoveMode()) {

            // 自動移動モードを開始にセット
            $setMoveMode(true);

            requestAnimationFrame((): void =>
            {
                if (!$getMoveMode()) {
                    return ;
                }
                execute(event, true);
            });
        }

        return ;
    }

    // 移動範囲が左側を超えた場合の処理
    if (event.pageX < minPositionX) {

        if (!loop_mode && !$getMoveMode()) {

            const width   = timelineAreaState.frameWidth + 1;
            const scrollX = Math.floor(workSpace.scene.scrollX / width) * width;

            workSpace.scene.scrollX = scrollX;

            timelineFrameUpdateFrameElementService(
                $getLeftFrame()
            );

        }

        // 左方向に移動
        if (timelineHeaderUpdateScrollXUseCase(-(timelineAreaState.frameWidth + 1)) === -1) {

            // 自動移動モード終了
            $setMoveMode(false);

            // フレームをマイナスに移動
            timelineFrameUpdateFrameElementService(1);

            return ;
        }

        // フレームをマイナスに移動
        timelineFrameUpdateFrameElementService(
            Math.max(timelineFrame.currentFrame - 1, 1)
        );

        if (loop_mode || !$getMoveMode()) {

            // 自動移動モードを開始にセット
            $setMoveMode(true);

            requestAnimationFrame((): void =>
            {
                if (!$getMoveMode()) {
                    return ;
                }
                execute(event, true);
            });
        }

        return ;
    }

    // 自動移動モード終了
    $setMoveMode(false);

    // マウスヒットしたフレームに移動
    requestAnimationFrame((): void =>
    {
        const element: HTMLElement | null = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        // マウスで指定したElementのフレームをセット
        const frame: string | undefined = element.dataset.frame as string;
        if (!frame) {
            return ;
        }

        // フレームの表示を更新
        timelineFrameUpdateFrameElementService(parseInt(frame));

        // マーカーを移動
        timelineMarkerMovePositionService();
    });
};