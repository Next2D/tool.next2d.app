import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as screenDisplayObjectSelectedMoveElementService } from "../service/ScreenDisplayObjectSelectedMoveElementService";
import { execute as screenDisplayObjectSelectedMoveStandardPointElementService } from "../service/ScreenDisplayObjectSelectedMoveStandardPointElementService";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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
        // メニューを非表示
        $allHideMenu();

        // 選択中のElementを移動
        screenDisplayObjectSelectedMoveElementService(
            event.movementX, event.movementY
        );

        // MovieClipの基準点のElementを移動
        screenDisplayObjectSelectedMoveStandardPointElementService(
            event.movementX, event.movementY
        );

        // プロパティーの値を更新
        transformSettingUpdateXElementService(
            transformSetting.tempPosition.x + transformSetting.x
        );
        transformSettingUpdateYElementService(
            transformSetting.tempPosition.y + transformSetting.y
        );
    });
};