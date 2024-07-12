import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as externalLayerUpdateLockHistoryObjectService } from "../service/ExternalLayerUpdateLockHistoryObjectService";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLockIconElementService";
import { execute as screenDisplayObjectChangeElementEventService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectChangeElementEventService";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as propertyAreaChangeDisplayUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaChangeDisplayUseCase";

/**
 * @description レイヤーのロック情報を更新
 *              Update layer lock information
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

    const historyObject = externalLayerUpdateLockHistoryObjectService(
        work_space.id, movie_clip.id, externalLayer.index, value
    );

    // 値を更新
    layer.lock = value;

    // ロックしたLayerの選択があれば解除
    if (value && movie_clip.selectedDepths.has(layer.id)) {
        movie_clip.selectedDepths.delete(layer.id);
    }

    // 表示中ならレイヤーの表示を更新
    if (work_space.active && movie_clip.active) {
        // Layerオブジェクトのロックアイコンの表示を更新
        timelineLayerControllerUpdateLockIconStyleService(layer);

        // スクリーンに配置された、DisplayObjectのElementを更新
        screenDisplayObjectChangeElementEventService(layer);

        // 選択範囲のElementの表示を更新
        targetRectUpdateElementUseCase();

        // MovieClipの基準点の表示を更新
        screenStandardPointDeployElementUseCase();

        // プロパティエリアの表示を更新
        propertyAreaChangeDisplayUseCase();
    }

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};