import { $ZOOM_MAX_VALUE, $ZOOM_MIN_VALUE } from "@/config/ZoomConfig";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as zoomToolRealodWorkSpaceUseCase } from "./ZoomToolRealodWorkSpaceUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description ズームinuputの値操作のマウスムーブイベント
 *              Mouse move event for value operation of zoom input
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
        const value = parseInt(element.value);
        const scale = $clamp(value + event.movementX, $ZOOM_MIN_VALUE, $ZOOM_MAX_VALUE);
        element.value = `${scale}`;

        await zoomToolRealodWorkSpaceUseCase(scale / 100);
    });
};