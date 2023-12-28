import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineMarkerMovePositionService } from "../service/TimelineMarkerMovePositionService";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $TIMELINE_LAYER_CONTROLLER_WIDTH } from "@/config/TimelineConfig";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import {
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

    const frameWidth   = timelineAreaState.frameWidth + 1;
    const baseWidth    = $TIMELINE_LAYER_CONTROLLER_WIDTH + offsetLeft;
    const minPositionX = baseWidth;
    const maxPositionX = timelineHeader.clientWidth + baseWidth;

    // 移動範囲が右側を超えた場合の処理
    if (event.pageX > maxPositionX) {
        requestAnimationFrame((): void =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // フレームをプラスに移動
            timelineFrameUpdateFrameElementService(
                Math.min(timelineFrame.currentFrame + 1, $getMaxFrame())
            );

            // 右方向に移動
            if (!timelineScrollUpdateScrollXUseCase(frameWidth)) {

                // 自動移動モード終了
                $setMoveMode(false);

                return ;
            }

            if (loop_mode || !$getMoveMode()) {

                // 自動移動モードを開始にセット
                if (!loop_mode) {
                    $setMoveMode(true);
                }

                execute(event, true);
            }
        });

        return ;
    }

    // 移動範囲が左側を超えた場合の処理
    if (event.pageX < minPositionX) {
        requestAnimationFrame((): void =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // フレームをマイナスに移動
            timelineFrameUpdateFrameElementService(
                Math.max(timelineFrame.currentFrame - 1, 1)
            );

            // 左方向に移動
            if (!timelineScrollUpdateScrollXUseCase(-frameWidth)) {

                // 自動移動モード終了
                $setMoveMode(false);

                return ;
            }

            if (loop_mode || !$getMoveMode()) {

                // 自動移動モードを開始にセット
                if (!loop_mode) {
                    $setMoveMode(true);
                }

                execute(event, true);
            }
        });

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