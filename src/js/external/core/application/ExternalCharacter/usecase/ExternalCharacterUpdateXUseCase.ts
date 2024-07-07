import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenAreaMoveDisplayObjectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaMoveDisplayObjectElementService";
import { execute as targetRectMoveElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectMoveElementUseCase";
import { execute as characterUpdateXHistoryUseCase } from "@/history/application/core/application/Character/UpdateX/usecase/CharacterUpdateXHistoryUseCase";
import { execute as screenStandardPointMoveElementService } from "@/screen/application/StandardPoint/service/ScreenStandardPointMoveElementService";

/**
 * @description DisplayObjectのx座標を更新
 *              Update the x coordinate of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} x
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
    x: number,
    receiver: boolean = false
): void => {

    // 変更前のx座標を取得
    const beforeX = character.x;

    // 変更がなければ何もしない
    if (beforeX === x) {
        return ;
    }

    // 内部データを更新
    character.x = x;

    // 中心点も移動量に合わせて移動
    character.referencePosition.x += x - beforeX;

    // 履歴を登録
    characterUpdateXHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeX,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        // 表示Elementを移動
        screenAreaMoveDisplayObjectElementService(layer, character);

        // 選択範囲のElementを移動
        targetRectMoveElementUseCase();

        // MovieClipの基準点のElementを移動
        screenStandardPointMoveElementService(
            x - beforeX, 0
        );
    }
};