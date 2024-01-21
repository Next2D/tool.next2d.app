import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_TOOL_LAYER_ADD_COMMAND } from "@/config/HistoryConfig";

/**
 * @description タブ名変更の履歴用オブジェクトを作成
 *              Create object for history of tab name changes
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {Layer} layer
 * @param  {number} index
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    layer: Layer,
    index: number
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_TOOL_LAYER_ADD_COMMAND,
        "args": [
            work_space_id,
            movie_clip_id,
            layer.name,
            index,
            layer.color
        ]
    };
};