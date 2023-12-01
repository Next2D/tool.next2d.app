import { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerUpdateLockIconStyleService } from "../service/TimelineLayerUpdateLockIconStyleService";

/**
 * @description Layerの状態に合わせてElementのstyleを更新
 *              Update Element style according to the state of the Layer
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // ロックアイコンの表示情報を更新
    timelineLayerUpdateLockIconStyleService(layer.id, layer.lock);
};