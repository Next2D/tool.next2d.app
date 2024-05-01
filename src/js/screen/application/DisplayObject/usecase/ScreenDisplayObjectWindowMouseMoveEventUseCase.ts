import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getMovePositon } from "../../../../tool/application/ToolUtil";
import {
    $SCREEN_STAGE_AREA_ID,
    $SCREEN_TARGET_RECT_ID
} from "@/config/ScreenConfig";

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
    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const element: HTMLElement | null = document
            .getElementById($SCREEN_STAGE_AREA_ID);

        if (!element) {
            return ;
        }

        const workSpace = $getCurrentWorkSpace();
        const movieClip = workSpace.scene;

        for (const [layerIndex, depths] of movieClip.selectedDepths) {

            const layer = movieClip.getLayer(layerIndex);
            if (!layer) {
                continue ;
            }

            // 選択中のElementを取得して移動
            const elements = element.querySelectorAll(`.layer-id-${layer.id}`);
            for (let idx = 0; idx < depths.length; ++idx) {

                const node = elements[depths[idx]] as HTMLElement;
                if (!node) {
                    continue ;
                }

                node.style.left = `${node.offsetLeft + event.movementX}px`;
                node.style.top  = `${node.offsetTop  + event.movementY}px`;
            }
        }

        // 選択範囲も移動
        const rectElement: HTMLElement | null = document
            .getElementById($SCREEN_TARGET_RECT_ID);

        if (!rectElement) {
            return ;
        }

        rectElement.style.left = `${rectElement.offsetLeft + event.movementX}px`;
        rectElement.style.top  = `${rectElement.offsetTop  + event.movementY}px`;

        // マウスで移動した量を更新
        const movePosition = $getMovePositon();
        movePosition.x += event.movementX;
        movePosition.y += event.movementY;
    });
};