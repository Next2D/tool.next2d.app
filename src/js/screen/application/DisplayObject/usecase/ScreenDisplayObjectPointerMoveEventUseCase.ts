import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as screenDisplayObjectSelectedMoveElementUseCase } from "./ScreenDisplayObjectSelectedMoveElementUseCase";
import { execute as screenStandardPointMoveElementService } from "@/screen/application/StandardPoint/service/ScreenStandardPointMoveElementService";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as targetRectMoveElementService } from "@/screen/application/TargetRect/service/TargetRectMoveElementService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getPointerId } from "../DisplayObjectUtil";

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

    requestAnimationFrame(async (): Promise<void> =>
    {
        if ($getPointerId() !== event.pointerId) {
            return ;
        }

        // メニューを非表示
        $allHideMenu();

        const workSpace = $getCurrentWorkSpace();
        const scale = workSpace.scale;

        // マウスで移動した量を更新
        const x = event.movementX;
        const y = event.movementY;

        // マウスで移動した量を更新
        transformSetting.x += x;
        transformSetting.y += y;

        // 選択中のElementを移動
        await screenDisplayObjectSelectedMoveElementUseCase(x, y);

        // MovieClipの基準点のElementを移動
        screenStandardPointMoveElementService(x, y);

        // 選択範囲のElementを移動
        targetRectMoveElementService(x, y);

        // プロパティーの値を更新
        transformSettingUpdateXElementService(
            transformSetting.tempPosition.x + transformSetting.x / scale
        );
        transformSettingUpdateYElementService(
            transformSetting.tempPosition.y + transformSetting.y / scale
        );
    });
};