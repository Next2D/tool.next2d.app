import type { LayerSaveObjectImpl } from "@/interface/LayerSaveObjectImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalLayerUpdateReloadUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateReloadUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description 削除したレイヤーを元の配置に元に戻す
 *              Restore deleted layers to their original placement
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {object} layer_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
    layer_object: LayerSaveObjectImpl
): void => {

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
    const layer = movieClip.createLayer();
    layer.load(layer_object);
    movieClip.setLayer(layer, index);

    // レイヤー更新によるタイムラインの再描画
    if (workSpace.active && movieClip.active) {
        externalLayerUpdateReloadUseCase();
    }
};