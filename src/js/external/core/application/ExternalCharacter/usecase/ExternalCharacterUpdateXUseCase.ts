import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenAreaMoveDisplayObjectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaMoveDisplayObjectElementService";
import { execute as screenAreaMoveTargetRectElementUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaMoveTargetRectElementUseCase";

/**
 * @description DisplayObjectのx座標を更新
 *              Update the x coordinate of DisplayObject
 *
 * @param {WorkSpace} work_space
 * @param {MovieClip} movie_clip
 * @param {Layer} layer
 * @param {Character} character
 * @param {number} x
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    x: number
): void => {

    // 変更前のx座標を取得
    const beforeX = character.x;
    character.x = x;

    // 履歴を登録

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        screenAreaMoveDisplayObjectElementService(layer, character);

        // 選択範囲のElementを移動
        screenAreaMoveTargetRectElementUseCase(movie_clip);
    }
};