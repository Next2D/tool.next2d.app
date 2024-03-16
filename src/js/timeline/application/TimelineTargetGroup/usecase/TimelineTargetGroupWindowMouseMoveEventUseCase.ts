import { $TIMELINE_LAYER_CONTROLLER_WIDTH, $TIMELINE_TARGET_GROUP_ID, $TIMELINE_TOOL_HEIGHT_SIZE } from "@/config/TimelineConfig";
import { $TOOL_AERA_WIDTH } from "@/config/ToolConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineGroup } from "@/timeline/domain/model/TimelineGroup";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { execute as timelineScrollUpdateScrollYUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollYUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $getMoveMode, $setMoveMode } from "../../TimelineUtil";
import { $getTimelineOffsetTop } from "../../TimelineArea/TimelineAreaUtil";

/**
 * @description グループウィンドウのマウスムーブイベント
 *              Mouse move event of group window
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
): void =>
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
    const frameHeight  = timelineAreaState.frameHeight + 1;
    const baseWidth    = $TIMELINE_LAYER_CONTROLLER_WIDTH + offsetLeft;
    const minPositionX = baseWidth;
    const maxPositionX = timelineHeader.clientWidth + baseWidth;

    const minPositionY = $getTimelineOffsetTop() + $TIMELINE_TOOL_HEIGHT_SIZE;
    const maxPositionY = minPositionY + timelineAreaState.height - $TIMELINE_TOOL_HEIGHT_SIZE - 12; // 2pxは余白分

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

                timelineGroup.y -= 1;
                if (Math.abs(timelineGroup.y) > timelineAreaState.frameHeight) {
                    // 初期化
                    timelineGroup.y = 0;

                    // 移動した情報を記録
                    timelineGroup.moveY -= frameHeight;
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

                timelineGroup.y += 1;
                if (Math.abs(timelineGroup.y) > timelineAreaState.frameHeight) {
                    // 初期化
                    timelineGroup.y = 0;

                    // 移動した情報を記録
                    timelineGroup.moveY += frameHeight;
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

                timelineGroup.x -= 1;
                if (Math.abs(timelineGroup.x) > timelineAreaState.frameWidth) {
                    // 初期化
                    timelineGroup.x = 0;

                    // 移動した情報を記録
                    timelineGroup.moveX -= frameWidth;
                }

                execute(event, true);
            }
        });

        return ;
    }

    // 移動範囲が右側を超えた場合の処理
    if (event.pageX > maxPositionX) {

        requestAnimationFrame((): void =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

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

                timelineGroup.x += 1;
                if (Math.abs(timelineGroup.x) > timelineAreaState.frameWidth) {
                    // 初期化
                    timelineGroup.x = 0;

                    // 移動した情報を記録
                    timelineGroup.moveX += frameWidth;
                }

                execute(event, true);
            }
        });

        return ;
    }

    // 自動移動モード終了
    $setMoveMode(false);

    timelineGroup.x += event.pageX - timelineGroup.pageX;
    timelineGroup.y += event.pageY - timelineGroup.pageY;
    timelineGroup.pageX = event.pageX;
    timelineGroup.pageY = event.pageY;

    requestAnimationFrame((): void =>
    {
        const timelineAreaState = $getCurrentWorkSpace().timelineAreaState;

        // x軸の移動処理
        if (Math.abs(timelineGroup.x) > timelineAreaState.frameWidth) {

            const direction = timelineGroup.x > 0 ? 1 : -1;

            // 移動した情報を記録
            const scale = Math.round(Math.abs(timelineGroup.x) / frameWidth);
            const dx = frameWidth * scale * direction;
            timelineGroup.moveX += dx;

            // 初期化
            timelineGroup.x = 0;

            // 表示を更新
            const element: HTMLElement | null = document
                .getElementById($TIMELINE_TARGET_GROUP_ID);

            if (element) {
                const offsetLeft = element.offsetLeft + dx;
                switch (true) {

                    // 最大値が右側を超えた場合
                    case maxPositionX < offsetLeft + element.clientWidth:
                        timelineScrollUpdateScrollXUseCase(frameWidth);
                        break;

                    // 最小値が左側を超えた場合
                    case minPositionX > offsetLeft:
                        timelineScrollUpdateScrollXUseCase(-frameWidth);
                        break;

                    default:
                        element.style.left = `${offsetLeft}px`;
                        break;

                }
            }
        }

        // y軸の移動処理
        if (Math.abs(timelineGroup.y) > timelineAreaState.frameHeight) {

            const direction = timelineGroup.y > 0 ? 1 : -1;

            // 移動した情報を記録
            const scale = Math.round(Math.abs(timelineGroup.y) / frameHeight);
            const dy = frameHeight * scale * direction;
            timelineGroup.moveY += dy;

            // 初期化
            timelineGroup.y = 0;

            // 表示を更新
            const element: HTMLElement | null = document
                .getElementById($TIMELINE_TARGET_GROUP_ID);

            if (element) {

                const offsetLeft = element.offsetTop + dy;
                switch (true) {

                    case maxPositionY < offsetLeft + element.clientHeight:
                        timelineScrollUpdateScrollYUseCase(frameHeight);
                        break;

                    case minPositionY > offsetLeft:
                        timelineScrollUpdateScrollYUseCase(-frameHeight);
                        break;

                    default:
                        element.style.top = `${element.offsetTop + dy}px`;
                        break;

                }
            }
        }
    });
};