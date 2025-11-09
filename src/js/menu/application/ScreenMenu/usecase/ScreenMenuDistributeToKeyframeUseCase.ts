import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "../../MenuUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description スクリーンの選択中のDisplayObjectをキーフレームに配分する
 *              Distribute the selected DisplayObject on the screen to keyframes
 *
 * @param  {PointerEvent | KeyboardEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent | KeyboardEvent): Promise<void> =>
{
    // メニューを全て閉じる
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 選択中のMovieClipが無い場合は処理を終了
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 現在のフレームを取得
    const frame = movieClip.currentFrame;

    // ExternalTimelineを取得
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // レイヤーに配分
    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        // 選択中のDisoplayObjectが1つだけの場合はスキップ
        if (depths.length === 1) {
            continue;
        }

        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue;
        }

        // 昇順にソートして先頭以外を新規レイヤーに移動
        depths.sort((a, b) => a - b);

        const character = layer.getCharacter(frame, depths[0]);
        if (!character) {
            continue;
        }

        // 移動するキャラクターを取得
        const characters = [];
        for (let idx = 1; idx < depths.length; idx++) {

            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue;
            }

            characters.push(character);
        }

        // レイヤーAPIを取得
        const externalLayer = new ExternalLayer(workSpace, movieClip, layer);
        await externalTimeline
            .selectedLayers([externalLayer.index]);

        // 必要なフレーム数を追加
        if (character.startFrame + characters.length > character.endFrame - 1) {
            await externalTimeline
                .insertFrames(character.startFrame + characters.length - (character.endFrame - 1));
        } else {
            // フレーム数が多い場合は削除
            await externalTimeline
                .eraseFrames(
                    character.startFrame + characters.length,
                    character.endFrame - 1
                );
        }

        // 開始となるキーフレームをセット
        const keyframe = character.startFrame + 1;

        // 空のキーフレームを追加
        for (let idx = 0; idx < characters.length; idx++) {
            await externalTimeline
                .convertToEmptyKeyframes(keyframe + idx);
        }

        // キャラクターを移動
        for (let idx = 0; idx < characters.length; idx++) {

            const character = characters[idx];
            if (!character) {
                continue;
            }

            // 現在のレイヤーからDisplayObjectを削除
            const externalCharacter = new ExternalCharacter(
                workSpace,
                movieClip,
                layer,
                character
            );
            await externalCharacter.remove();

            // 新しいキーフレームにDisplayObjectを追加
            const frame = keyframe + idx;
            externalCharacter.startFrame = frame;
            externalCharacter.endFrame   = frame + 1;

            await externalLayer.addCharacter(externalCharacter);
        }
    }

    // キャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    // 画面を再描画
    await screenAreaRedrawUseCase(movieClip);
};