import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as propertyAreaChangeDisplayUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaChangeDisplayUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";

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
    if (!layer || layer.lock) {
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
        targetRectUpdateElementUseCase();

        // プロパティエリアの表示を更新
        propertyAreaChangeDisplayUseCase();

        // MovieClipなら基準点を配置
        screenStandardPointDeployElementUseCase();
    }
};