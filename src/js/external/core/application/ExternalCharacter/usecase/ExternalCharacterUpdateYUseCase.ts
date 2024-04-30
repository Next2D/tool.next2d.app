import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenAreaMoveDisplayObjectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaMoveDisplayObjectElementService";
import { execute as screenAreaMoveTargetRectElementUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaMoveTargetRectElementUseCase";
import { execute as characterUpdateYHistoryUseCase } from "@/history/application/core/application/Character/UpdateY/usecase/CharacterUpdateYHistoryUseCase";

/**
 * @description DisplayObjectのx座標を更新
 *              Update the x coordinate of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} y
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    y: number,
    receiver: boolean = false
): void => {

    // 変更前のx座標を取得
    const beforeY = character.y;

    // 変更がなければ何もしない
    if (beforeY === y) {
        return ;
    }

    character.y = y;

    // 履歴を登録
    characterUpdateYHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeY,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {

        // 移動したElementを移動
        screenAreaMoveDisplayObjectElementService(layer, character);

        // 選択範囲のElementを移動
        screenAreaMoveTargetRectElementUseCase(movie_clip);
    }
};