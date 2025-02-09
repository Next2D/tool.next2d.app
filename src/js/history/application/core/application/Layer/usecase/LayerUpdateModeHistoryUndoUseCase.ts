import type { IInstance } from "@/interface/IInstance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ILayerMode } from "@/interface/ILayerMode";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerControllerUpdateIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateIconElementService";
import { execute as screenDisplayObjectMaskLockUpdateElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectMaskLockUpdateElementService";
import { execute as screenDisplayObjectUpdateLayerMaskInElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectUpdateLayerMaskInElementUseCase";
import { execute as screenDisplayObjectUpdateDisabledElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectUpdateDisabledElementUseCase";
import {
    $GUIDE_IN_MODE,
    $GUIDE_MODE,
    $MASK_IN_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

/**
 * @description レイヤーモードを変更前に戻す
 *              Revert the layer mode to the previous state
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} before_mode
 * @param  {number} before_parent_id
 * @param  {array} indexes
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number,
    before_mode: ILayerMode,
    before_parent_id: number,
    indexes: number[]
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: IInstance<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    // 元の色に戻す
    const mode = layer.mode;
    layer.mode = before_mode;
    layer.parentId = before_parent_id;

    // 子レイヤーを元に戻す
    for (let idx = 0; idx < indexes.length; ++idx) {

        const childLayer = movieClip.getLayer(indexes[idx]);
        if (!childLayer) {
            continue;
        }

        childLayer.parentId = layer.id;

        switch (before_mode) {

            case $MASK_MODE:
                childLayer.mode = $MASK_IN_MODE;
                break;

            case $GUIDE_MODE:
                childLayer.mode = $GUIDE_IN_MODE;
                break;

            default:
                break;

        }

        // 子レイヤーのアイコンの表示を更新
        if (workSpace.active && movieClip.active) {
            // 子レイヤーのアイコンを更新
            timelineLayerControllerUpdateIconElementService(childLayer);

            // 親のレイヤーがマスクレイヤーなら、子レイヤーのマスクスタイルを更新
            if (layer.mode === $MASK_MODE && layer.lock) {
                await screenDisplayObjectUpdateLayerMaskInElementUseCase(movieClip, childLayer);
            }
        }
    }

    // 起動中ならライブラリエリアの表示を更新
    // アクティブな場合のみ処理を行う
    if (workSpace.active && movieClip.active) {
        // アイコンの表示を更新
        timelineLayerControllerUpdateIconElementService(layer);

        // ノーマルレイヤーからロック中のマスクレイヤーに変換する際は描画を更新
        if (layer.mode === $MASK_MODE && layer.lock) {
            // マスクレイヤーのDisplayObjectのElemnet表示を更新
            await screenDisplayObjectMaskLockUpdateElementService(layer);
        }

        // ロック中のマスクレイヤーからノーマルレイヤーに変換する際は描画を更新
        if (mode === $MASK_MODE && layer.lock) {
            await screenDisplayObjectUpdateDisabledElementUseCase(movieClip, layer);
        }
    }
};