import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as externalLayerUpdateDisableHistoryObjectService } from "../service/ExternalLayerUpdateDisableHistoryObjectService";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as timelineLayerControllerUpdateDisableIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateDisableIconElementService";
import { execute as screenDisplayObjectUpdateDisabledElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectUpdateDisabledElementUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as propertyAreaChangeDisplayUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaChangeDisplayUseCase";
import { execute as screenDisplayObjectUpdateLayerMaskInElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectUpdateLayerMaskInElementUseCase";

/**
 * @description レイヤーの表示情報を更新
 *              Update layer display information
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
    const historyObject = externalLayerUpdateDisableHistoryObjectService(
        work_space.id, movie_clip.id, index, value
    );

    // 内部情報を更新
    layer.disable = value;

    // ロックしたLayerの選択があれば解除
    if (value && movie_clip.selectedDepths.has(index)) {
        movie_clip.selectedDepths.delete(index);
    }

    // 表示中ならレイヤーの表示を更新
    if (work_space.active && movie_clip.active) {

        // レイヤーの表示Elementを更新
        timelineLayerControllerUpdateDisableIconElementService(layer);

        // 選択範囲のElementの表示を更新
        targetRectUpdateElementUseCase();

        // MovieClipの基準点の表示を更新
        screenStandardPointDeployElementUseCase();

        // 変形の中心点の表示を更新
        screenReferencePointDeployElementUseCase();

        // プロパティエリアの表示を更新
        await propertyAreaChangeDisplayUseCase();

        // 非表示にしたアイテムを表示・非表示に合わせて更新
        await screenDisplayObjectUpdateDisabledElementUseCase(movie_clip, layer);

        // マスクの子レイヤーなら、表示を更新
        await screenDisplayObjectUpdateLayerMaskInElementUseCase(movie_clip, layer);
    }

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};