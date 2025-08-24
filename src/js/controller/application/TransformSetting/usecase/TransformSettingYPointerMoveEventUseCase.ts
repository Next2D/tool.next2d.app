import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as screenDisplayObjectSelectedMoveElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectSelectedMoveElementUseCase";
import { execute as targetRectMoveElementService } from "@/screen/application/TargetRect/service/TargetRectMoveElementService";
import { execute as screenStandardPointMoveElementService } from "@/screen/application/StandardPoint/service/ScreenStandardPointMoveElementService";
import { execute as screenReferencePointMoveElementService } from "@/screen/application/ReferencePoint/service/ScreenReferencePointMoveElementService";
import { $globalToLocal } from "@/screen/application/DisplayObject/DisplayObjectUtil";

/**
 * @description 変形エリアのy座標の値操作のマウスムーブイベント
 *              Mouse move event for value operation of y-coordinate of deformation area
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
        const value = Math.round(parseFloat(element.value) * 100) / 100;
        const movementY = event.movementX;
        const y = $clamp(
            Math.round((value + $globalToLocal(0, movementY).y) * 100) / 100,
            Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
        );
        element.value = `${y}`;

        // マウスで移動した量を更新
        transformSetting.y += y - value;

        // スクリーンで選択中のElementを移動
        await screenDisplayObjectSelectedMoveElementUseCase(
            0, movementY
        );

        // 選択範囲のElementを移動
        targetRectMoveElementService(
            0, movementY
        );

        // MovieClipの基準点のElementを移動
        screenStandardPointMoveElementService(
            0, movementY
        );

        // 変形の基準点を移動
        screenReferencePointMoveElementService(
            0, movementY
        );
    });
};