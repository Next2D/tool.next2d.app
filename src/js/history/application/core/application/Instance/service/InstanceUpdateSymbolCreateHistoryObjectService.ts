import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND } from "@/config/HistoryConfig";
import { Instance } from "@/core/domain/model/Instance";

/**
 * @description インスタンスのシンボル名更新の履歴用オブジェクトを作成
 *              Create object for history of instance symbol name updates
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {I} instance
 * @param  {string} before_name
 * @return {object}
 * @method
 * @public
 */
export const execute = <I extends Instance> (
    work_space_id: number,
    movie_clip: MovieClip,
    instance: I,
    before_name: string
): IHistoryObject => {

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