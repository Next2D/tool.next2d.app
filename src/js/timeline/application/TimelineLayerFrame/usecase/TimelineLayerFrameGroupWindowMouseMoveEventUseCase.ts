import { $TIMELINE_TARGET_GROUP_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineGroup } from "@/timeline/domain/model/TimelineGroup";

/**
 * @description グループウィンドウのマウスムーブイベント
 *              Mouse move event of group window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    timelineGroup.x += event.movementX;
    timelineGroup.y += event.movementY;

    requestAnimationFrame((): void =>
    {
        const timelineAreaState = $getCurrentWorkSpace().timelineAreaState;

        // x軸の移動処理
        if (Math.abs(timelineGroup.x) > timelineAreaState.frameWidth) {

            const direction = timelineGroup.x > 0 ? 1 : -1;

            // 初期化
            timelineGroup.x = 0;

            // 移動した情報を記録
            const dx = (timelineAreaState.frameWidth + 1) * direction;
            timelineGroup.moveX += dx;

            // 表示を更新
            const element: HTMLElement | null = document
                .getElementById($TIMELINE_TARGET_GROUP_ID);

            if (element) {
                element.style.left = `${element.offsetLeft + dx}px`;
            }
        }

        // y軸の移動処理
        if (Math.abs(timelineGroup.y) > timelineAreaState.frameHeight) {

            const direction = timelineGroup.y > 0 ? 1 : -1;

            // 移動した情報を記録
            const dy = (timelineAreaState.frameHeight + 1) * direction;
            timelineGroup.moveY += dy;

            // 初期化
            timelineGroup.y = 0;

            // 表示を更新
            const element: HTMLElement | null = document
                .getElementById($TIMELINE_TARGET_GROUP_ID);

            if (element) {
                element.style.top = `${element.offsetTop + dy}px`;
            }
        }
    });
};