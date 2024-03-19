import { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "../service/TimelineLayerControllerUpdateLockIconElementService";
import { execute as timelineLayerControllerUpdateColorElementService } from "../service/TimelineLayerControllerUpdateColorElementService";
import { execute as timelineLayerControllerUpdateDisableIconStyleService } from "../service/TimelineLayerControllerUpdateDisableIconElementService";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "../service/TimelineLayerControllerUpdateLightIconElementService";
import { execute as timelineLayerControllerUpdateNameElementService } from "../service/TimelineLayerControllerUpdateNameElementService";
import { execute as timelineLayerControllerUpdateIconElementService } from "../service/TimelineLayerControllerUpdateIconElementService";

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
    // レイヤーアイコンの表示情報を更新
    timelineLayerControllerUpdateIconElementService(layer, 0, layer.mode);

    // レイヤー名の表示情報を更新
    timelineLayerControllerUpdateNameElementService(layer, layer.name);

    // レイヤーカラーの表示情報を更新
    timelineLayerControllerUpdateColorElementService(layer, layer.color);

    // レイヤーのハイライトの表示情報を更新
    timelineLayerControllerUpdateLightIconElementService(layer, layer.light);

    // レイヤーの表示・非表示の表示情報を更新
    timelineLayerControllerUpdateDisableIconStyleService(layer, layer.disable);

    // ロックアイコンの表示情報を更新
    timelineLayerControllerUpdateLockIconStyleService(layer, layer.lock);
};