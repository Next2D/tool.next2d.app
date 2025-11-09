import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRemoveDisplayObjectElementService } from "@/screen/application/ScreenArea/usecase/ScreenAreaRemoveDisplayObjectElementUseCase";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as propertyAreaShowDefaultSettingItemUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaShowDefaultSettingItemUseCase";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as screenDisplayObjectInactvieElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectInactvieElementService";
import { execute as screenDisplayObjectAllSelectedActiveUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectAllSelectedActiveUseCase";

/**
 * @description キーフレーム追加処理を元に戻す
 *              Undo the process of adding a keyframe
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_ndex
 * @param  {object} character_save_object
 * @param  {number} empty_character_index
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_ndex: number,
    character_save_object: ICharacterSaveObject,
    empty_character_index: number
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    // レイヤーを抜き出し
    const layer = movieClip.getLayer(layer_ndex);
    if (!layer) {
        return ;
    }

    const character = layer.getCharacter(
        character_save_object.startFrame,
        character_save_object.depth
    );
    if (!character) {
        return ;
    }

    // 空のキーフレームに上書きした場合は、空のキーフレームを追加
    if (empty_character_index > -1) {
        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = character.startFrame;
        emptyCharacter.endFrame   = character.endFrame;
        layer.addEmptyCharacter(emptyCharacter);
    }

    // アクティブならタイムラインを再描画
    // fixed logic
    if (workSpace.active && movieClip.active) {
        // スクリーンに追加したElementを削除
        screenAreaRemoveDisplayObjectElementService(character.id);

        for (const [index, depths] of movieClip.selectedDepths) {
            const layer = movieClip.getLayer(index);
            if (!layer) {
                continue;
            }
            screenDisplayObjectInactvieElementService(layer, depths);
        }
    }

    // 追加したDisplahyObjectを削除
    // fixed logic
    layer.removeCharacter(character);

    // 選択状態を解除
    movieClip.clearSelectedDepths();

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    if (!workSpace.active) {
        return ;
    }

    // 変形の中心点の表示を更新
    screenReferencePointDeployElementUseCase();

    // 選択範囲のElementの表示を更新
    targetRectUpdateElementUseCase();

    // アクティブならタイムラインを再描画
    // fixed logic
    if (movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movieClip, layer);

        // 親の基準点の表示を更新
        screenStandardPointDeployElementUseCase();

        // プロパティーエリアのデフォルト設定項目を表示
        await propertyAreaShowDefaultSettingItemUseCase(movieClip);
    } else {

        const movieClip = workSpace.scene;
        await screenAreaRedrawUseCase(movieClip);

        // 再描画したので、選択中のElementをアクティブにする
        // fixed logic
        screenDisplayObjectAllSelectedActiveUseCase(movieClip);
    }
};