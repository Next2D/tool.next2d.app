import { $TRANSFORM_OBJECT_Y_ID } from "@/config/TransformSettingConfig";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as screenDisplayObjectSelectedMoveElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectSelectedMoveElementService";

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
        const element: HTMLInputElement | null = document
            .getElementById($TRANSFORM_OBJECT_Y_ID) as HTMLInputElement;

        if (!element) {
            return ;
        }

        // 表示を更新
        const value = parseFloat(parseFloat(element.value).toFixed(2));
        const y = $clamp(value + event.movementX, -Number.MAX_VALUE, Number.MAX_VALUE);
        element.value = `${y}`;

        // スクリーンで選択中のElementを移動
        screenDisplayObjectSelectedMoveElementService(
            0, event.movementX
        );
    });
};