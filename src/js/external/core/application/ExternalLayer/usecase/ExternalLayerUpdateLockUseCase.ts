import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as externalLayerUpdateLockHistoryObjectService } from "../service/ExternalLayerUpdateLockHistoryObjectService";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description レイヤーのロック情報を更新
 *              Update layer lock information
 *
 * @param {WorkSpace} work_space
 * @param {MovieClip} movie_clip
 * @param {Layer} layer
 * @param {boolean} value
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

    const historyObject = externalLayerUpdateLockHistoryObjectService(
        work_space.id, movie_clip.id, externalLayer.index, value
    );

    // 値を更新
    layer.lock = value;

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};