import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ILayerMode } from "@/interface/ILayerMode";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { $MASK_MODE } from "@/config/LayerModeConfig";
import { execute as timelineLayerControllerUpdateIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateIconElementService";
import { execute as screenDisplayObjectUpdateDisabledElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectUpdateDisabledElementUseCase";
import { execute as screenDisplayObjectAllResetMaskStyleUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllResetMaskStyleUseCase";
import { execute as screenDisplayObjectMaskLockUpdateElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectMaskLockUpdateElementUseCase";

/**
 * @description レイヤーモードを変更後に戻す
 *              Revert the layer mode to the previous state
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} after_mode
 * @param  {number} after_parent_id
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number,
    after_mode: ILayerMode,
    after_parent_id: number
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    // 元の色に戻す
    const beforeMode = layer.mode;
    layer.mode = after_mode;
    layer.parentId = after_parent_id;

    // 親レイヤーを変更する時は子レイヤーを初期化
    let idx = movieClip.layers.indexOf(layer) + 1;
    for (; idx < movieClip.layers.length; ++idx) {

        const childLayer = movieClip.getLayer(idx);
        if (!childLayer || childLayer.parentId !== layer.id) {
            break;
        }

        childLayer.clearRelation();

        if (workSpace.active && movieClip.active) {
            // 子レイヤーのアイコンの表示を更新
            timelineLayerControllerUpdateIconElementService(childLayer);

            // マスクレイヤーからノーマルレイヤーに変換する際は子レイヤーのマスクスタイルをリセット
            screenDisplayObjectAllResetMaskStyleUseCase(movieClip, childLayer);
        }
    }

    // 起動中ならライブラリエリアの表示を更新
    // アクティブな場合のみ処理を行う
    if (workSpace.active && movieClip.active) {
        // アイコンの表示を更新
        timelineLayerControllerUpdateIconElementService(layer);

        // ロック中のマスクレイヤーからノーマルレイヤーに変換する際は描画を更新
        if (beforeMode === $MASK_MODE && layer.lock) {
            // マスクレイヤーをノーマルレイヤーに更新
            await screenDisplayObjectUpdateDisabledElementUseCase(movieClip, layer);
        }

        // ノーマルレイヤーからロック中のマスクレイヤーに変換する際は描画を更新
        if (layer.mode === $MASK_MODE && layer.lock) {
            await screenDisplayObjectMaskLockUpdateElementUseCase(layer);
        }
    }
};