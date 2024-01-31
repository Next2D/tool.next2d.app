import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as externalLayerUpdateLightHistoryObjectService } from "../service/ExternalLayerUpdateLightHistoryObjectService";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLightIconElementService";

/**
 * @description レイヤーのハイライト表示を更新
 *              Updated layer highlighting
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {boolean} value
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    value: boolean,
    receiver: boolean = false
): void => {

    // 外部APIを起動
    const externalLayer = new ExternalLayer(
        work_space, movie_clip, layer
    );

    const historyObject = externalLayerUpdateLightHistoryObjectService(
        work_space.id, movie_clip.id, externalLayer.index, value
    );

    // 内部情報を更新
    layer.light = value;

    // 表示中ならレイヤーの表示を更新
    if (work_space.active && movie_clip.active) {
        timelineLayerControllerUpdateLightIconElementService(layer, value);
    }

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};