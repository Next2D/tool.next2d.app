import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as screenDisplayObjectSelectedMoveElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectSelectedMoveElementUseCase";
import { execute as targetRectMoveElementService } from "@/screen/application/TargetRect/service/TargetRectMoveElementService";
import { execute as screenStandardPointMoveElementService } from "@/screen/application/StandardPoint/service/ScreenStandardPointMoveElementService";
import { execute as screenReferencePointMoveElementService } from "@/screen/application/ReferencePoint/service/ScreenReferencePointMoveElementService";
import { $globalToLocal } from "@/screen/application/DisplayObject/DisplayObjectUtil";

/**
 * @description 変形エリアのx座標の値操作のマウスムーブイベント
 *              Mouse move event for value operation of x-coordinate of deformation area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // カーソルを変更
    $setCursor("ew-resize");

    // 移動する量がない場合は終了
    if (!event.movementX) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame(async (): Promise<void> =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示を更新
        const value = Math.round(parseFloat(element.value) * 10000) / 10000;
        const movementX = event.movementX;
        const x = $clamp(
            value + Math.round($globalToLocal(movementX).x * 10000) / 10000,
            -Number.MAX_VALUE, Number.MAX_VALUE
        );
        element.value = `${x}`;

        // マウスで移動した量を更新
        transformSetting.x += x - value;

        // スクリーンで選択中のElementを移動
        await screenDisplayObjectSelectedMoveElementUseCase(
            movementX, 0
        );

        // 選択範囲のElementを移動
        targetRectMoveElementService(
            movementX, 0
        );

        // MovieClipの基準点のElementを移動
        screenStandardPointMoveElementService(
            movementX, 0
        );

        // 変形の基準点を移動
        screenReferencePointMoveElementService(
            movementX, 0
        );
    });
};