import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as externalLayerUpdateLockHistoryObjectService } from "../service/ExternalLayerUpdateLockHistoryObjectService";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLockIconElementService";
import { execute as screenDisplayObjectChangeElementClassService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectChangeElementClassService";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as propertyAreaChangeDisplayUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaChangeDisplayUseCase";
import { execute as screenDisplayObjectMaskLockUpdateElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectMaskLockUpdateElementService";
import { execute as screenDisplayObjectUpdateLayerMaskElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectUpdateLayerMaskElementUseCase";

/**
 * @description レイヤーのロック情報を更新
 *              Update layer lock information
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {boolean} value
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    value: boolean,
    receiver: boolean = false
): Promise<void> => {

    // 外部APIを起動
    const externalLayer = new ExternalLayer(
        work_space, movie_clip, layer
    );

    const index = externalLayer.index;
    const historyObject = externalLayerUpdateLockHistoryObjectService(
        work_space.id, movie_clip.id, index, value
    );

    // 値を更新
    layer.lock = value;

    // ロックしたLayerの選択があれば解除
    if (value && movie_clip.selectedDepths.has(index)) {
        movie_clip.selectedDepths.delete(index);
    }

    // 表示中ならレイヤーの表示を更新
    if (work_space.active && movie_clip.active) {
        // Layerオブジェクトのロックアイコンの表示を更新
        timelineLayerControllerUpdateLockIconStyleService(layer);

        // スクリーンに配置された、DisplayObjectのElement classを更新
        screenDisplayObjectChangeElementClassService(layer);

        // 選択範囲のElementの表示を更新
        targetRectUpdateElementUseCase();

        // MovieClipの基準点の表示を更新
        screenStandardPointDeployElementUseCase();

        // プロパティエリアの表示を更新
        await propertyAreaChangeDisplayUseCase();

        // マスクレイヤーなら、子レイヤーの表示を更新
        await screenDisplayObjectMaskLockUpdateElementService(layer);

        // マスクインのレイヤーのDisplayObjectのElemnet表示を更新
        await screenDisplayObjectUpdateLayerMaskElementUseCase(layer);
    }

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};