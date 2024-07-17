import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as screenDisplayObjectSelectedMoveElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectSelectedMoveElementUseCase";
import { execute as targetRectMoveElementService } from "@/screen/application/TargetRect/service/TargetRectMoveElementService";
import { execute as screenStandardPointMoveElementService } from "@/screen/application/StandardPoint/service/ScreenStandardPointMoveElementService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("ew-resize");

    // 移動する量がない場合は終了
    if (!event.movementX) {
        return ;
    }

    requestAnimationFrame(async (): Promise<void> =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示を更新
        const workSpace = $getCurrentWorkSpace();
        const value = parseFloat(parseFloat(element.value).toFixed(2));
        const movementX = parseFloat(event.movementX.toFixed(2));
        const dx = parseFloat((movementX / workSpace.scale).toFixed(2));
        const x = $clamp(value + dx, -Number.MAX_VALUE, Number.MAX_VALUE);
        element.value = `${x}`;

        // マウスで移動した量を更新
        transformSetting.x += movementX;

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
    });
};