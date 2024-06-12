import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $TIMELINE_LAYER_CONTROLLER_WIDTH } from "@/config/TimelineConfig";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { $TOOL_AERA_WIDTH } from "@/config/ToolConfig";
import { $setCursor } from "@/global/GlobalUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import {
    $getMaxFrame,
    $getMoveMode,
    $setMoveMode
} from "../../TimelineUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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

    // メニューを全て非表示にする
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;
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
        requestAnimationFrame(async (): Promise<void> =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // カーソルを変更
            $setCursor("ew-resize");

            // 外部APIを起動
            const externalTimeline = new ExternalTimeline(
                workSpace, workSpace.scene
            );

            // 選択したフレームに切り替える
            const frame = Math.min(scene.currentFrame + 1, $getMaxFrame());
            await externalTimeline.changeFrame(frame);

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
        requestAnimationFrame(async (): Promise<void> =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // カーソルを変更
            $setCursor("ew-resize");

            // 外部APIを起動
            const externalTimeline = new ExternalTimeline(
                workSpace, workSpace.scene
            );

            // 選択したフレームに切り替える
            const frame = Math.max(scene.currentFrame - 1, 1);
            await externalTimeline.changeFrame(frame);

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

    // カーソルを変更
    $setCursor("ew-resize");

    // マウスヒットしたフレームに移動
    requestAnimationFrame(async (): Promise<void> =>
    {
        const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
        if (!element) {
            return ;
        }

        let frame: string | undefined = element.dataset.frame as string;
        if (!frame) {
            const parentElement = element.parentElement as HTMLElement;
            if (parentElement) {
                frame = parentElement.dataset.frame as string;
            }

            if (!frame) {
                return ;
            }
        }

        // 外部APIを起動
        const externalTimeline = new ExternalTimeline(
            workSpace, workSpace.scene
        );

        // 選択したフレームに切り替える
        await externalTimeline.changeFrame(parseInt(frame));
    });
};