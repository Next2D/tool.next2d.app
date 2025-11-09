import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "../../MenuUtil";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

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

    // レイヤーに配分
    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue;
        }

        for (let idx = 0; idx < depths.length; idx++) {

            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue;
            }

        }

        // タイムラインのレイヤーを再描画

    }

    // スクリーンを再描画
    await screenAreaRedrawUseCase(movieClip);
};