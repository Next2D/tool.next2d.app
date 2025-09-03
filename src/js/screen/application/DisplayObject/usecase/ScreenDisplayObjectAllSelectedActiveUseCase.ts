import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenDisplayObjectActvieElementService } from "../service/ScreenDisplayObjectActvieElementService";

/**
 * @description すべての選択されたDisplayObjectをアクティブ表示にする
 *              Make all selected DisplayObjects active
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue;
        }

        screenDisplayObjectActvieElementService(layer, depths);
    }
};