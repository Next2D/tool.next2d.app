import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as screenDisplayObjectSelectedMoveElementUseCase } from "./ScreenDisplayObjectSelectedMoveElementUseCase";
import { execute as screenStandardPointMoveElementService } from "@/screen/application/StandardPoint/service/ScreenStandardPointMoveElementService";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import { execute as targetRectMoveElementService } from "@/screen/application/TargetRect/service/TargetRectMoveElementService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getPointerId, $globalToLocal } from "../DisplayObjectUtil";

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
    // メニューを非表示
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame(async (): Promise<void> =>
    {
        if ($getPointerId() !== event.pointerId) {
            return ;
        }

        // マウスで移動した量を更新
        const position = $globalToLocal(event.movementX, event.movementY);

        const movementX = event.movementX;
        const movementY = event.movementY;
        const x = position.x;
        const y = position.y;

        // マウスで移動した量を更新
        transformSetting.x += x;
        transformSetting.y += y;

        // 選択中のElementを移動
        await screenDisplayObjectSelectedMoveElementUseCase(movementX, movementY);

        // MovieClipの基準点のElementを移動
        screenStandardPointMoveElementService(movementX, movementY);

        // 選択範囲のElementを移動
        targetRectMoveElementService(movementX, movementY);

        // プロパティーの値を更新
        transformSettingUpdateXElementService(
            transformSetting.tempPosition.x + transformSetting.x
        );
        transformSettingUpdateYElementService(
            transformSetting.tempPosition.y + transformSetting.y
        );
    });
};