import { $setCursor } from "@/global/GlobalUtil";
import { $getTimelineOffsetTop } from "@/timeline/application/TimelineArea/TimelineAreaUtil";
import { $TIMELINE_TOOL_HEIGHT_SIZE } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getMoveMode, $setMoveMode } from "../../TimelineUtil";
import { execute as timelineScrollUpdateScrollYUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollYUseCase";

/**
 * @description レイヤーコントローラーウィンドウのマウスムーブ処理関数
 *              Mouse move processing function for the layer controller window
 *
 * @param  {PointerEvent} event
 * @param  {boolean} [loop_mode = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    event: PointerEvent,
    loop_mode: boolean = false
): void => {

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("grabbing");

    const timelineAreaState = $getCurrentWorkSpace().timelineAreaState;

    const minPositionY = $getTimelineOffsetTop() + $TIMELINE_TOOL_HEIGHT_SIZE;
    const maxPositionY = minPositionY + timelineAreaState.height - $TIMELINE_TOOL_HEIGHT_SIZE - 12;

    // 移動範囲が上部を超えた場合の処理
    if (event.pageY < minPositionY) {
        requestAnimationFrame((): void =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // 上方向に移動
            if (!timelineScrollUpdateScrollYUseCase(-2)) {

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

    // 移動範囲が下部を超えた場合の処理
    if (event.pageY > maxPositionY) {
        requestAnimationFrame((): void =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // 下方向に移動
            if (!timelineScrollUpdateScrollYUseCase(2)) {

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

    $setMoveMode(false);
};