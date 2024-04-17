import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as propertyAreaSoundAreaRebuildSettingAreaUseCase } from "./PropertyAreaSoundAreaRebuildSettingAreaUseCase";

/**
 * @description サウンド設定の削除アイコンのクリック処理
 *              Click processing of the delete icon of the sound setting
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const sounds = movieClip.getSound(movieClip.currentFrame);
    if (!sounds) {
        return ;
    }

    // 指定のサウンドを削除
    const index = parseInt(element.dataset.index as string);
    sounds.splice(index, 1);

    // サウンド設定エリアを再構築
    propertyAreaSoundAreaRebuildSettingAreaUseCase();
};