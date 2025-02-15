import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ILayerMode } from "@/interface/ILayerMode";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerControllerMoveLayerHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as screenAreaUpdateMovedLayerService } from "@/screen/application/ScreenArea/service/ScreenAreaUpdateMovedLayerService";
import { execute as screenDisplayObjectUpdateLayerMaskInElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectUpdateLayerMaskInElementUseCase";
import { execute as screenDisplayObjectAllResetMaskStyleUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllResetMaskStyleUseCase";
import { $MASK_IN_MODE } from "@/config/LayerModeConfig";

/**
 * @description レイヤー移動を実行
 *              Perform layer movement
 *
 * @param  {IShareReceiveMessage} message
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (message: IShareReceiveMessage): Promise<void> =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip = workSpace.getLibrary(libraryId) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const beforeIndex = message.data[2] as NonNullable<number>;
    const afterIndex  = message.data[3] as NonNullable<number>;

    const layer = movieClip.layers.splice(beforeIndex, 1)[0];

    // 更新前のデータをセット
    const beforeMode = layer.mode;
    const beforeParentId = layer.parentId;

    // データを更新
    layer.mode     = message.data[5] as NonNullable<ILayerMode>;
    layer.parentId = message.data[7] as NonNullable<number>;

    // レイヤーを移動
    movieClip.layers.splice(afterIndex, 0, layer);

    // 履歴に登録
    await timelineLayerControllerMoveLayerHistoryUseCase(
        workSpace,
        movieClip,
        layer,
        beforeIndex,
        afterIndex,
        message.data[4] as NonNullable<ILayerMode>,
        message.data[6] as NonNullable<number>,
        true
    );

    // レイヤーの再描画
    if (workSpace.active && movieClip.active) {
        // タイムラインのelementを再構築
        timelineLayerBuildElementUseCase();

        // スクリーンの表示を更新
        screenAreaUpdateMovedLayerService(layer);

        switch (true) {

            // マスクの子レイヤーの場合
            case layer.parentId > -1 && layer.mode === $MASK_IN_MODE:
                await screenDisplayObjectUpdateLayerMaskInElementUseCase(movieClip, layer);
                break;

            // 変更前がマスクの子レイヤーの場合
            case beforeParentId > -1 && beforeMode === $MASK_IN_MODE:
                screenDisplayObjectAllResetMaskStyleUseCase(movieClip, layer);
                break;

            default:
                break;

        }
    }
};