import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as viewCharacterDeleteUseCase } from "@/view/core/Character/usecase/ViewCharacterDeleteUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description DisplayObject削除を変更後に戻す
 *              Reset the deletion of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number,
    keyframe: number,
    depth: number
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

    const character = layer.getCharacter(keyframe, depth);
    if (!character) {
        return ;
    }

    // レイヤーからキャラクターを削除
    layer.removeCharacter(character);

    // キャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    // キーフレームが空で、空のキーフレームが存在しない場合は、空のキーフレームを追加
    const activeCharacters = layer.getActiveCharacters(keyframe);
    if (!activeCharacters.length) {

        const activeEmptyCharacter = layer
            .getActiveEmptyCharacter(keyframe);

        if (!activeEmptyCharacter) {

            const emptyCharacter = new EmptyCharacter();
            emptyCharacter.startFrame = character.startFrame;
            emptyCharacter.endFrame   = character.endFrame;
            layer.addEmptyCharacter(emptyCharacter);

            // タイムラインにフレームを追加
            if (workSpace.active && movieClip.active) {
                timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);
            }
        }
    }

    if (!workSpace.active) {
        return ;
    }

    if (movieClip.active) {

        // 選択を初期化
        movieClip.clearSelectedDepths();

        // スクリーンを再描画
        await screenAreaRedrawUseCase(movieClip);
    }

    // Viewを更新
    await viewCharacterDeleteUseCase(
        workSpace,
        movieClip
    );
};