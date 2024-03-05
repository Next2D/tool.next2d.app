import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND } from "@/config/HistoryConfig";

/**
 * @description インスタンスのシンボル名更新の履歴用オブジェクトを作成
 *              Create object for history of instance symbol name updates
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Instance} instance
 * @param  {string} before_name
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    instance: InstanceImpl<any>,
    before_name: string
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            instance.id,
            before_name,
            instance.symbol
        ],
        "args": [
            instance.name,
            instance.symbol
        ]
    };
};