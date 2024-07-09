import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as screenDisplayObjectSelectedMoveElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectSelectedMoveElementService";
import { execute as targetRectMoveElementService } from "@/screen/application/TargetRect/service/TargetRectMoveElementService";
import { execute as screenStandardPointMoveElementService } from "@/screen/application/StandardPoint/service/ScreenStandardPointMoveElementService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("ew-resize");

    // 移動する量がない場合は終了
    if (!event.movementX) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示を更新
        const workSpace = $getCurrentWorkSpace();
        const value = parseFloat(parseFloat(element.value).toFixed(2));
        const movementX = parseFloat(event.movementX.toFixed(2));
        const dy = parseFloat((movementX / workSpace.scale).toFixed(2));
        const y = $clamp(value + dy, -Number.MAX_VALUE, Number.MAX_VALUE);
        element.value = `${y}`;

        // マウスで移動した量を更新
        transformSetting.y += movementX;

        // スクリーンで選択中のElementを移動
        screenDisplayObjectSelectedMoveElementService(
            0, movementX
        );

        // 選択範囲のElementを移動
        targetRectMoveElementService(
            0, movementX
        );

        // MovieClipの基準点のElementを移動
        screenStandardPointMoveElementService(
            0, movementX
        );
    });
};