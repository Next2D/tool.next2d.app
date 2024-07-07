import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";

/**
 * @description スクリーンで選択中のElementを移動する
 *              Move the selected Element on the screen
 *
 * @param  {number} [movement_x=0]
 * @param  {number} [movement_y=0]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movement_x: number = 0,
    movement_y: number = 0
): void => {

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 選択中のelementがない場合は何もしない
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    // 選択中のElementを移動
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

            if (movement_x) {
                node.style.left = `${node.offsetLeft + movement_x}px`;
            }
            if (movement_y) {
                node.style.top = `${node.offsetTop + movement_y}px`;
            }
        }
    }
};