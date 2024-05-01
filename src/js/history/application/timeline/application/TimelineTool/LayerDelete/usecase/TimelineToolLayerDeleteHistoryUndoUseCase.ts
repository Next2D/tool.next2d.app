import type { LayerSaveObjectImpl } from "@/interface/LayerSaveObjectImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalLayerUpdateReloadUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateReloadUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $GUIDE_IN_MODE, $GUIDE_MODE, $MASK_IN_MODE, $MASK_MODE } from "@/config/LayerModeConfig";
import { LayerModeImpl } from "@/interface/LayerModeImpl";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenAreaHideTargetRectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaHideTargetRectElementService";

/**
 * @description 削除したレイヤーを元の配置に元に戻す
 *              Restore deleted layers to their original placement
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {array} indexes
 * @param  {object} layer_object
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number,
    indexes: number[],
    layer_object: LayerSaveObjectImpl
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // 表示されているElementを初期化、内部データに変更なし
    externalTimeline.deactivatedAllLayers();

    // Layerオブジェクトの内部情報に再登録
    const layer = movieClip.createLayer(layer_object.id);
    layer.load(layer_object);
    movieClip.setLayer(layer, index);

    let mode: LayerModeImpl = 0;
    switch (layer.mode) {

        case $MASK_MODE:
            mode = $MASK_IN_MODE;
            break;

        case $GUIDE_MODE:
            mode = $GUIDE_IN_MODE;
            break;

        default:
            break;
    }

    // 子レイヤーの再登録
    for (let idx = 0; idx < indexes.length; ++idx) {

        const childLayer = movieClip.getLayer(indexes[idx]);
        if (!childLayer) {
            continue;
        }

        // 子レイヤーに変更
        childLayer.mode = mode;
        childLayer.parentId = layer.id;
    }

    // レイヤー更新によるタイムラインの再描画
    if (workSpace.active && movieClip.active) {
        externalLayerUpdateReloadUseCase();

        // スクリーンの選択範囲elementを非表示
        screenAreaHideTargetRectElementService();

        const activeCharacters = layer.getActiveCharacters(movieClip.currentFrame);
        if (activeCharacters.length) {
            await screenAreaRedrawUseCase(movieClip);
        }
    }
};