import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as screenDisplayObjectSelectedMoveElementService } from "../service/ScreenDisplayObjectSelectedMoveElementService";
import { $SCREEN_TARGET_RECT_ID } from "@/config/ScreenConfig";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";

/**
 * @description DisplayObjectの移動処理関数
 *              Function to move DisplayObject
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        // 選択中のElementを移動
        screenDisplayObjectSelectedMoveElementService(
            event.movementX, event.movementY
        );

        // 選択範囲も移動
        const rectElement: HTMLElement | null = document
            .getElementById($SCREEN_TARGET_RECT_ID);

        if (!rectElement) {
            return ;
        }

        // プロパティーの値を更新
        transformSettingUpdateXElementService(rectElement.offsetLeft - $getScreenOffsetLeft());
        transformSettingUpdateYElementService(rectElement.offsetTop  - $getScreenOffsetTop());
    });
};