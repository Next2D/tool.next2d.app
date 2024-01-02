import { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "../service/TimelineLayerControllerUpdateLockIconStyleService";
import { execute as timelineLayerControllerUpdateColorElementService } from "../service/TimelineLayerControllerUpdateColorElementService";
import { execute as timelineLayerControllerUpdateDisableIconStyleService } from "../service/TimelineLayerControllerUpdateDisableIconStyleService";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "../service/TimelineLayerControllerUpdateLightIconElementService";
import { execute as timelineLayerControllerUpdateNameElementService } from "../service/TimelineLayerControllerUpdateNameElementService";

/**
 * @description Layerオブジェクトの状態に合わせて、表示Elementの情報を更新
 *              Update information on the display Element according to the state of the Layer object
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // レイヤー名の表示情報を更新
    timelineLayerControllerUpdateNameElementService(layer.id, layer.name);

    // レイヤーカラーの表示情報を更新
    timelineLayerControllerUpdateColorElementService(layer.id, layer.color);

    // レイヤーのハイライトの表示情報を更新
    timelineLayerControllerUpdateLightIconElementService(layer.id, layer.light);

    // レイヤーの表示・非表示の表示情報を更新
    timelineLayerControllerUpdateDisableIconStyleService(layer.id, layer.disable);

    // ロックアイコンの表示情報を更新
    timelineLayerControllerUpdateLockIconStyleService(layer.id, layer.lock);
};