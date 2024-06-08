import { $STAGE_DEFAULT_FPS } from "@/config/StageSettingConfig";
import { $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description ステージのフレームレートの値操作のマウスムーブイベント
 *              Mouse move event for value operation of stage frame rate
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("ew-resize");

    if (!event.movementX) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        const currentValue = parseInt(element.value);

        const value = Math.max(1, Math.min(
            currentValue + event.movementX,
            $STAGE_DEFAULT_FPS
        ));

        if (value !== currentValue) {
            element.value = `${value}`;
            $getCurrentWorkSpace().stage.fps = value;
        }
    });
};