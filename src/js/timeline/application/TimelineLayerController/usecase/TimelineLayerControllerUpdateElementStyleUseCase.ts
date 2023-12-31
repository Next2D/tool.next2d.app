import { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "../service/TimelineLayerControllerUpdateLockIconStyleService";
import { execute as timelineLayerControllerUpdateColorElementService } from "../service/TimelineLayerControllerUpdateColorElementService";
import { execute as timelineLayerControllerUpdateDisableIconStyleService } from "../service/TimelineLayerControllerUpdateDisableIconStyleService";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "../service/TimelineLayerControllerUpdateLightIconElementService";
import { execute as timelineLayerControllerUpdateNameElementService } from "../service/TimelineLayerControllerUpdateNameElementService";

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
    timelineLayerControllerUpdateNameElementService(layer.id, layer.name);

    // レイヤーカラーをセット
    timelineLayerControllerUpdateColorElementService(layer.id, layer.color);

    // レイヤーのハイライト情報を更新
    timelineLayerControllerUpdateLightIconElementService(layer.id, layer.light);

    // レイヤーの表示・非表示情報を更新
    timelineLayerControllerUpdateDisableIconStyleService(layer.id, layer.disable);

    // ロックアイコンの表示情報を更新
    timelineLayerControllerUpdateLockIconStyleService(layer.id, layer.lock);
};