import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";

/**
 * @description 指定したDisplayObjectのElementをStageAreaから削除
 *              Remove the Element of the specified DisplayObject from the StageArea
 *
 * @param  {number} layer_id
 * @param  {number} depth
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, depth: number): void =>
{
    const element = screenAreaGetElementFromLayerIdAndDepthService(layer_id, depth);
    if (!element) {
        return ;
    }

    // elementを削除
    element.remove();
};