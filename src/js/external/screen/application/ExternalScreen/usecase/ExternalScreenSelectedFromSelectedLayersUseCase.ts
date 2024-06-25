import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalScreenClaerSelectedDisplayObjectUseCase } from "./ExternalScreenClaerSelectedDisplayObjectUseCase";
import { execute as externalScreenSelectDisplayObjectUseCase } from "./ExternalScreenSelectDisplayObjectUseCase";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as propertyAreaShowDefaultSettingItemUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaShowDefaultSettingItemUseCase";

/**
 * @description 選択中のレイヤーからDisplayObjectを算出して選択状態に更新
 *              Calculate the DisplayObject from the selected layer and update the selection state
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {array} [frames=null]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frames: number[] | null = null
): void => {

    // 一度選択状態を初期化
    externalScreenClaerSelectedDisplayObjectUseCase(
        work_space,
        movie_clip
    );

    const selectedLayers = movie_clip.selectedLayers;
    if (!selectedLayers.length) {
        return ;
    }

    // 現在のフレームを取得
    const currentFrame = movie_clip.currentFrame;

    // 指定フレームをセット
    let frame = movie_clip.currentFrame;
    if (frames) {
        frame = frames.length > 1
            ? movie_clip.selectedFrameObject.end
            : frames[0];

        if (!frame) {
            frame = frames[0];
        }

        movie_clip.currentFrame = frame;
    }

    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];
        if (!layer) {
            continue;
        }

        // アクティブなキャラクターを取得
        const activeCharacters = layer.getActiveCharacters(frame);
        if (!activeCharacters.length) {
            // DisplayObjectが存在しない場合はプロパティーエリアはデフォルト設定を表示
            propertyAreaShowDefaultSettingItemUseCase(movie_clip);
            continue ;
        }

        const depths = [];
        for (let idx = 0; idx < activeCharacters.length; ++idx) {
            const character = activeCharacters[idx];
            if (!character) {
                continue ;
            }
            depths.push(character.depth);
        }

        const externalLayer = new ExternalLayer(
            work_space,
            movie_clip,
            layer
        );

        // 選択状態に更新
        externalScreenSelectDisplayObjectUseCase(
            work_space,
            movie_clip,
            externalLayer.index,
            depths
        );
    }

    // 後続処理のためにフレームを戻す
    movie_clip.currentFrame = currentFrame;
};