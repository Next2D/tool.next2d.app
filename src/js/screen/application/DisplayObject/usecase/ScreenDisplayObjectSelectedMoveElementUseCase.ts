import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as screenDisplayObjectUpdateMaskInCanvasStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService";
import { transformSetting } from "@/controller/domain/model/TransformSetting";

/**
 * @description スクリーンで選択中のElementを移動する
 *              Move the selected Element on the screen
 *
 * @param  {number} [movement_x=0]
 * @param  {number} [movement_y=0]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    movement_x: number = 0,
    movement_y: number = 0
): Promise<void> => {

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
    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue ;
        }

        // 選択中のElementを取得して移動
        const elements = element.querySelectorAll(`.layer-id-${layer.id}`);
        for (let idx = 0; idx < depths.length; ++idx) {

            const depth = depths[idx];

            const node = elements[depth] as HTMLElement;
            if (!node) {
                continue ;
            }

            if (movement_x) {
                node.style.left = `${node.offsetLeft + movement_x}px`;
            }
            if (movement_y) {
                node.style.top = `${node.offsetTop + movement_y}px`;
            }

            // マスクの子レイヤーの場合はマスクのstyleを更新
            if (layer.parentId === -1) {
                continue ;
            }

            const character = layer.getCharacter(frame, depth);
            if (!character) {
                continue ;
            }

            // マスクのstyleを更新
            await screenDisplayObjectUpdateMaskInCanvasStyleService(
                node, layer,
                character.x + transformSetting.x,
                character.y + transformSetting.y
            );
        }
    }
};