import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { IBlendMode } from "@/interface/IBlendMode";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as instanceUpdateBlendModeService } from "@/core/application/Instance/service/InstanceUpdateBlendModeService";
import { execute as blendModeSettingUpdateSelectElementService } from "@/controller/application/BlendModeSetting/service/BlendModeSettingUpdateSelectElementService";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";

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
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    blend_mode: IBlendMode
): void => {

    // アクティブでない場合は何もしない
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

    // Elementの更新
    const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
    if (!element) {
        return ;
    }

    // Elementの更新
    instanceUpdateBlendModeService(element, blend_mode);

    // 選択中のElementがない場合は何もしない
    if (!movie_clip.selectedDepths.size
        || !movie_clip.isSingleSelectedOfDisplayObject()
        || !screenAreaIsCharacterSelectedService(movie_clip, layer, character)
    ) {
        return ;
    }

    // ブレンドモードの選択状態を更新
    blendModeSettingUpdateSelectElementService(blend_mode);
};