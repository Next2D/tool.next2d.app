import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as characterUpdateNameHistoryUseCase } from "@/history/application/core/application/Character/UpdateName/usecase/CharacterUpdateNameHistoryUseCase";

/**
 * @description DisplayObjectの名前を更新
 *              Update the name of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {string} [name=""]
 * @param  {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    name: string = "",
    receiver: boolean = false
): Promise<void> => {

    const beforeName = character.name;
    if (beforeName === name) {
        return ;
    }

    // 名前を更新
    character.name = name;

    // 履歴を登録
    await characterUpdateNameHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeName,
        receiver
    );
};