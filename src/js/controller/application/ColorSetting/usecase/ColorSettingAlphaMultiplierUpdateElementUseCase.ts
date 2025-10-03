import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";

/**
 * @description スクリーンで選択中のElementのalphaを更新する
 *              Update the alpha of the selected Element on the screen
 *
 * @param  {number} alpha
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (alpha: number): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 選択中のelementがない場合は何もしない
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue ;
        }

        for (let idx = 0; idx < depths.length; ++idx) {

            const depth = depths[idx];

            const node = screenAreaGetElementFromLayerIdAndDepthService(layer.id, depth);
            if (!node) {
                continue ;
            }

            const character = layer.getCharacter(frame, depth);
            if (!character) {
                continue ;
            }

            // alphaを更新
            character.colorTransform[3] = alpha / 100;

            const canvas = node.querySelector("canvas");
            if (canvas) {
                canvas.style.opacity = `${character.alpha}`;
            }
        }
    }
};