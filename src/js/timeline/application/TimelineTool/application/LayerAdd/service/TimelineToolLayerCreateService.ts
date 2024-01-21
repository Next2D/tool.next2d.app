import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import {
    $getCurrentWorkSpace,
    $getWorkSpace
} from "@/core/application/CoreUtil";

/**
 * @description 引数の指定に準拠してレイヤーを作成、失敗時はnullを返却
 *              Create layers according to argument specification, return null on failure
 *
 * @param  {number} [work_space_id = 0]
 * @param  {number} [library_id = -1]
 * @param  {string} [name = ""]
 * @param  {number} [target_index = -1]
 * @param  {string} [color = ""]
 * @return {Layer}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number = 0,
    library_id: number = -1,
    name: string = "",
    target_index: number = -1,
    color: string = ""
): Layer | null => {

    // 指定がなければ起動中のWorkSpaceを利用する
    const workSpace = work_space_id
        ? $getCurrentWorkSpace()
        : $getWorkSpace(work_space_id);

    if (!workSpace) {
        return null;
    }

    // 指定がなければ、アクティブなMovieClipを利用する
    const scene: InstanceImpl<MovieClip>  = library_id === -1
        ? workSpace.scene
        : workSpace.getLibrary(library_id);

    if (!scene) {
        return null;
    }

    // 選択中のレイヤーがなければ上位のレイヤーを利用する
    const targetLayers = timelineLayer.targetLayers;
    const selectedLayer: Layer | null = !targetLayers.size
        ? scene.layers[0]
        : scene.getLayer(targetLayers.keys().next().value);

    if (!selectedLayer) {
        return null;
    }

    // レイヤーを追加
    const newLayer = scene.createLayer();

    // 引数で指定があれば内部情報を更新
    if (name) {
        newLayer.name = name;
    }
    if (color) {
        newLayer.color = color;
    }

    // 挿入するindexの指定がなければ選択中のレイヤーの上位のindexをセット
    const index = target_index === -1
        ? scene.layers.indexOf(selectedLayer)
        : target_index;

    // 内部情報にレイヤーを追加
    scene.setLayer(newLayer, index);

    return newLayer;
};