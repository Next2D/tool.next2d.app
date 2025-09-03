import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as zoomToolRealodWorkSpaceUseCase } from "./ZoomToolRealodWorkSpaceUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenDisplayObjectAllSelectedActiveUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllSelectedActiveUseCase";
import {
    $ZOOM_MAX_VALUE,
    $ZOOM_MIN_VALUE
} from "@/config/ZoomConfig";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description ズームタイマーID
 *              Zoom timer ID
 *
 * @type {NodeJS.Timeout}
 * @private
 */
let $zoomTimerId: NodeJS.Timeout;

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

            await zoomToolRealodWorkSpaceUseCase(scale / 100, false);

            clearTimeout($zoomTimerId);
            $zoomTimerId = setTimeout(async (): Promise<void> =>
            {
                const workSpace = $getCurrentWorkSpace();
                await screenAreaRedrawUseCase(workSpace.scene);

                // 選択中のDisplayObjectをアクティブ表示にする
                screenDisplayObjectAllSelectedActiveUseCase();
            }, 100);

            resolve();
        });
    });
};