import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as screenDisplayObjectSelectedMoveElementUseCase } from "./ScreenDisplayObjectSelectedMoveElementUseCase";
import { execute as screenStandardPointMoveElementService } from "@/screen/application/StandardPoint/service/ScreenStandardPointMoveElementService";
import { execute as screenReferencePointMoveElementService } from "@/screen/application/ReferencePoint/service/ScreenReferencePointMoveElementService";
import { execute as targetRectMoveElementService } from "@/screen/application/TargetRect/service/TargetRectMoveElementService";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import {
    $getPointerId,
    $globalToLocal
} from "../DisplayObjectUtil";

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
    // 移動する量がない場合は終了
    if (!event.movementX && !event.movementY) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame(async (): Promise<void> =>
    {
        if ($getPointerId() !== event.pointerId) {
            return ;
        }

        // マウスで移動した量を更新
        const movementX = event.movementX;
        const movementY = event.movementY;

        const position = $globalToLocal(movementX, movementY);
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

        // 変形の基準点を移動
        screenReferencePointMoveElementService(movementX, movementY);

        // プロパティーの値を更新
        transformSettingUpdateXElementService(
            transformSetting.beforeX + transformSetting.x
        );
        transformSettingUpdateYElementService(
            transformSetting.beforeY + transformSetting.y
        );
    });
};