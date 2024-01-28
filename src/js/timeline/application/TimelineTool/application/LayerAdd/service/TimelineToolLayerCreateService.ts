import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 引数の指定に準拠してレイヤーを作成、失敗時はnullを返却
 *              Create layers according to argument specification, return null on failure
 *
 * @param  {number} [work_space_id = 0]
 * @param  {number} [library_id = -1]
 * @param  {number} [index = -1]
 * @param  {string} [name = ""]
 * @param  {string} [color = ""]
 * @return {Layer}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
    name: string = "",
    color: string = ""
): Layer | null => {

    // 指定がなければ起動中のWorkSpaceを利用する
    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return null;
    }

    // 指定がなければ、アクティブなMovieClipを利用する
    const scene: InstanceImpl<MovieClip> = workSpace.getLibrary(library_id);
    if (!scene) {
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

    // 内部情報にレイヤーを追加
    scene.setLayer(newLayer, index);

    return newLayer;
};