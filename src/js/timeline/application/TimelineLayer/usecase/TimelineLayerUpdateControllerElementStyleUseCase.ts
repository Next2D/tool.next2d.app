import { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerUpdateLockIconStyleService } from "../service/TimelineLayerUpdateLockIconStyleService";
import { execute as timelineLayerUpdateColorStyleService } from "../service/TimelineLayerUpdateColorStyleService";
import { execute as timelineLayerDisableIconStyleService } from "../service/TimelineLayerDisableIconStyleService";
import { execute as timelineLayerUpdateLightIconStyleService } from "../service/TimelineLayerUpdateLightIconStyleService";

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
    // レイヤーカラーをセット
    timelineLayerUpdateColorStyleService(layer.id, layer.color);

    // レイヤーのハイライト情報を更新
    timelineLayerUpdateLightIconStyleService(layer.id, layer.light);

    // レイヤーの表示・非表示情報を更新
    timelineLayerDisableIconStyleService(layer.id, layer.disable);

    // ロックアイコンの表示情報を更新
    timelineLayerUpdateLockIconStyleService(layer.id, layer.lock);
};