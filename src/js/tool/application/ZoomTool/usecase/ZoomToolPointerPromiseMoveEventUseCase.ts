import { $ZOOM_MAX_VALUE, $ZOOM_MIN_VALUE } from "@/config/ZoomConfig";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as zoomToolRealodWorkSpaceUseCase } from "./ZoomToolRealodWorkSpaceUseCase";

/**
 * @description ズームinuputの値操作のマウスムーブイベント
 *              Mouse move event for value operation of zoom input
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // カーソルを変更
    $setCursor("ew-resize");

    // 移動する量がない場合は終了
    if (!event.movementX) {
        return ;
    }

    await new Promise<void>((resolve): void =>
    {
        requestAnimationFrame(async (): Promise<void> =>
        {
            const element = event.target as HTMLInputElement;
            if (!element) {
                return resolve();
            }

            // 表示を更新
            const value = parseInt(element.value);
            const scale = $clamp(value + event.movementX, $ZOOM_MIN_VALUE, $ZOOM_MAX_VALUE);
            element.value = `${scale}`;

            await zoomToolRealodWorkSpaceUseCase(scale / 100);

            resolve();
        });
    });
};