import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "../../MenuUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { execute as externalLayerUpdateReloadUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateReloadUseCase";

/**
 * @description スクリーンの選択中のDisplayObjectをレイヤーに配分する
 *              Distribute the selected DisplayObject on the screen to layers
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

        // 移動するキャラクターを取得
        const characters = [];
        for (let idx = 1; idx < depths.length; idx++) {

            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue;
            }

            characters.push(character);
        }

        // キャラクターを新規レイヤーに移動
        const index = movieClip.layers.indexOf(layer);
        for (let idx = 0; idx < characters.length; idx++) {

            const character = characters[idx];
            if (!character) {
                continue;
            }

            // 新規レイヤーを追加
            const externalLayer = await externalTimeline.addNewLayer(index);
            if (!externalLayer) {
                continue;
            }

            // 現在のレイヤーからDisplayObjectを削除
            const externalCharacter = new ExternalCharacter(
                workSpace,
                movieClip,
                layer,
                character
            );
            await externalCharacter.delete();

            // 新規レイヤーにDisplayObjectを追加
            await externalLayer.addCharacter(externalCharacter);
        }
    }

    // タイムラインを再描画
    externalLayerUpdateReloadUseCase();
};