import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { IBlendMode } from "@/interface/IBlendMode";
import { execute as screenAreaGetElementFromCharacterIdService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromCharacterIdService";
import { execute as instanceUpdateBlendModeService } from "@/core/application/Instance/service/InstanceUpdateBlendModeService";
import { execute as blendModeSettingUpdateSelectElementService } from "@/controller/application/BlendModeSetting/service/BlendModeSettingUpdateSelectElementService";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description 選択中のElementのブレンドモードを更新する
 *              Update the blend mode value of the selected Element
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {IBlendMode} blend_mode
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    blend_mode: IBlendMode
): Promise<void> => {

    if (!work_space.active) {
        return ;
    }

    // アクティブでない場合は何もしない
    if (movie_clip.active) {
        // Elementの更新
        const element = screenAreaGetElementFromCharacterIdService(character.id);
        if (!element) {
            return ;
        }

        const container = element.querySelector(".canvas-container") as HTMLDivElement;
        if (!container) {
            return ;
        }

        // Elementの更新
        instanceUpdateBlendModeService(container, blend_mode);

        // 選択中のElementがない場合は何もしない
        if (!movie_clip.selectedDepths.size
            || !movie_clip.isSingleSelectedOfDisplayObject()
            || !screenAreaIsCharacterSelectedService(movie_clip, layer, character)
        ) {
            return ;
        }

        // ブレンドモードの選択状態を更新
        blendModeSettingUpdateSelectElementService(blend_mode);
    } else {
        await screenAreaRedrawUseCase(work_space.scene);
    }
};