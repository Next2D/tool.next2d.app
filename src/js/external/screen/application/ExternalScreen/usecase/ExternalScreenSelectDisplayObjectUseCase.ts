import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as controllerAreaShowSingleSettingUseCase } from "@/controller/application/ControllerArea/usecase/ControllerAreaShowSingleSettingUseCase";
import { execute as targetRectMoveElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectMoveElementUseCase";

/**
 * @description DisplayObjectを選択状態に更新
 *              Update the DisplayObject to the selected state
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} layer_index
 * @param  {array} depths
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer_index: number,
    depths: number[]
): void => {

    const layer = movie_clip.getLayer(layer_index);
    if (!layer) {
        return;
    }

    // 選択中のdepthがあれば重複を除いてマージ
    if (movie_clip.selectedDepths.has(layer_index)) {
        const selectedDepths = movie_clip.selectedDepths.get(layer_index) as NonNullable<number[]>;
        depths = Array.from(new Set([...depths, ...selectedDepths]));
    }

    // 選択範囲のdepthを追加
    movie_clip.selectedDepths.set(layer_index, depths);

    // 表示がアクティブなら表示を更新
    if (work_space.active && movie_clip.active) {

        // 表示範囲を更新
        targetRectMoveElementUseCase(movie_clip);

        // コントローラー表示を更新
        if (depths.length === 1) {
            const character = layer.getCharacter(movie_clip.currentFrame, depths[0]);
            if (!character) {
                return ;
            }
            // 単一選択時のコントローラー表示を更新
            controllerAreaShowSingleSettingUseCase(character.libraryId);
        } else {
            // TODO
        }
    }
};