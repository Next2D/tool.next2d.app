import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import { Character } from "@/core/domain/model/Character";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as viewCharacterDeleteUseCase } from "@/view/core/Character/usecase/ViewCharacterDeleteUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description DisplayObject削除を変更前に戻す
 *              Reset the deletion of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {ICharacterSaveObject} character_save_object
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number,
    keyframe: number,
    character_save_object: ICharacterSaveObject
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    const character = new Character();
    character.load(character_save_object);
    layer.addCharacter(character);

    // キャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    const activeEmptyCharacter = layer.getActiveEmptyCharacter(keyframe);
    if (activeEmptyCharacter) {
        // 空のキーフレームを削除
        layer.removeEmptyCharacter(activeEmptyCharacter);

        // タイムラインを更新
        if (workSpace.active && movieClip.active) {
            timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);
        }
    }

    if (!workSpace.active) {
        return ;
    }

    // アクティブであれば、スクリーンにelementを追加して、タイムラインの表示を更新
    if (movieClip.active) {
        // スクリーンを再描画
        await screenAreaRedrawUseCase(movieClip);
    }

    // Viewの更新
    await viewCharacterDeleteUseCase(workSpace, movieClip);
};