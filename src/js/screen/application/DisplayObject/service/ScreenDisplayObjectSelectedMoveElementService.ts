import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $SCREEN_STAGE_AREA_ID,
    $SCREEN_TARGET_RECT_ID
} from "@/config/ScreenConfig";
import { transformSetting } from "@/controller/domain/model/TransformSetting";

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

    const scale = workSpace.scale;

    // マウスで移動した量を更新
    transformSetting.x += movement_x / scale;
    transformSetting.y += movement_y / scale;

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

            node.style.left = `${node.offsetLeft + movement_x}px`;
            node.style.top  = `${node.offsetTop  + movement_y}px`;
        }
    }

    // 選択範囲も移動
    const rectElement: HTMLElement | null = document
        .getElementById($SCREEN_TARGET_RECT_ID);

    if (!rectElement) {
        return ;
    }

    const left = rectElement.offsetLeft + movement_x;
    const top  = rectElement.offsetTop  + movement_y;
    rectElement.style.left = `${left}px`;
    rectElement.style.top  = `${top}px`;
};