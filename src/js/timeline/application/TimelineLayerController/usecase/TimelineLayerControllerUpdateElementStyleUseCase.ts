import { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "../service/TimelineLayerControllerUpdateLockIconStyleService";
import { execute as timelineLayerControllerUpdateColorStyleService } from "../service/TimelineLayerControllerUpdateColorStyleService";
import { execute as timelineLayerControllerDisableIconStyleService } from "../service/TimelineLayerControllerDisableIconStyleService";
import { execute as timelineLayerControllerUpdateLightIconStyleService } from "../service/TimelineLayerControllerUpdateLightIconStyleService";
import { execute as timelineLayerControllerUpdateNameTextStyleService } from "../service/TimelineLayerControllerUpdateNameTextStyleService";

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
    // レイヤー名をセット
    timelineLayerControllerUpdateNameTextStyleService(layer.id, layer.name);

    // レイヤーカラーをセット
    timelineLayerControllerUpdateColorStyleService(layer.id, layer.color);

    // レイヤーのハイライト情報を更新
    timelineLayerControllerUpdateLightIconStyleService(layer.id, layer.light);

    // レイヤーの表示・非表示情報を更新
    timelineLayerControllerDisableIconStyleService(layer.id, layer.disable);

    // ロックアイコンの表示情報を更新
    timelineLayerControllerUpdateLockIconStyleService(layer.id, layer.lock);
};