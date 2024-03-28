import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { $GUIDE_IN_MODE, $GUIDE_IN_TYPE, $MASK_IN_MODE } from "@/config/LayerModeConfig";

/**
 * @description 引数の指定に準拠してレイヤーを作成、失敗時はnullを返却
 *              Create layers according to argument specification, return null on failure
 *
 * @param  {number} [work_space_id = 0]
 * @param  {number} [library_id = -1]
 * @param  {number} [index = -1]
 * @param  {string} [name = ""]
 * @param  {string} [color = ""]
 * @param  {string} [color = ""]
 * @param  {number} [layer_id = -1]
 * @return {Layer}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
    name: string = "",
    color: string = "",
    layer_id: number = -1
): Layer | null => {

    // 指定がなければ起動中のWorkSpaceを利用する
    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return null;
    }

    // 指定がなければ、アクティブなMovieClipを利用する
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return null;
    }

    // レイヤーを追加
    const newLayer = movieClip.createLayer(layer_id);

    // 引数で指定があれば内部情報を更新
    if (name) {
        newLayer.name = name;
    }
    if (color) {
        newLayer.color = color;
    }

    // 選択中のレイヤーが子レイヤーなら、親レイヤーを引き継ぐ
    const selectedLayer = movieClip.layers[index];
    switch (selectedLayer.mode) {

        case $MASK_IN_MODE:
        case $GUIDE_IN_MODE:
            newLayer.mode = selectedLayer.mode;
            newLayer.parentId = selectedLayer.parentId;
            break;

        default:
            break;

    }

    // 内部情報にレイヤーを追加
    movieClip.setLayer(newLayer, index);

    return newLayer;
};