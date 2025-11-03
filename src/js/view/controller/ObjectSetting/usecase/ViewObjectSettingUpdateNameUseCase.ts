import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { execute as objectSettingUpdateNameService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateNameService";

/**
 * @description インスタンス名を更新した際のViewエリアの表示要素を更新
 *              Update the display elements in the View area when the instance name is updated
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character
): Promise<void> => {

    if (!work_space.active
        || !movie_clip.active
        || !movie_clip.isSingleSelectedOfDisplayObject()
        || !screenAreaIsCharacterSelectedService(movie_clip, layer, character)
    ) {
        return ;
    }

    // アクティブなら表示を更新
    objectSettingUpdateNameService(character.name);
};