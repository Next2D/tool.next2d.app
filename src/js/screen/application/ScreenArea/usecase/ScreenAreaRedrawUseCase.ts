import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { $MASK_MODE } from "@/config/LayerModeConfig";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { EventType } from "@/tool/domain/event/EventType";
import { $setDeactivated, $setReDrawState } from "../ScreenAreaUtil";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { execute as screenAreaAppendCharacterService } from "../service/ScreenAreaAppendCharacterService";
import { execute as screenAreaParentRedrawUseCase } from "./ScreenAreaParentRedrawUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description スクリーンエリアを再描画
 *              Redraw screen area
 *
 * @param  {MovieClip} movie_clip
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (movie_clip: MovieClip): Promise<void> =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    // 既存のElementを削除
    const elements = element.querySelectorAll(".display-object");
    for (let idx = 0; idx < elements.length; idx++) {
        elements[idx].remove();
    }

    // 再描画状態を設定
    $setReDrawState(true);

    // 先祖のMovieClipがある場合は半透明にして配置
    if (timelineSceneList.parents.length) {

        const parentObjects = timelineSceneList.parents.slice();
        timelineSceneList.parents.length = 0;

        // イベント無効化・半透明指定
        $setDeactivated(true);

        // 先祖のMovieClipを半透明で描画
        const workSpace = $getCurrentWorkSpace();

        // 現在のシーンを保存
        const scene = workSpace.scene;

        for (let idx = 0; idx < parentObjects.length; ++idx) {
            const parentObject = parentObjects[idx];

            if (!parentObject.selectCharacter) {
                timelineSceneList.parents.push(parentObject);
                continue;
            }

            const movieClip = workSpace.getLibrary(parentObject.parentLibraryId) as MovieClip;
            if (!movieClip) {
                timelineSceneList.parents.push(parentObject);
                continue;
            }

            // シーンを切り替え
            workSpace.scene = movieClip;
            await screenAreaParentRedrawUseCase(
                movieClip, parentObject.selectCharacter
            );

            // 階層を再保存
            timelineSceneList.parents.push(parentObject);
        }

        // 元のシーンに戻す
        workSpace.scene = scene;

        // イベント無効化・半透明指定解除
        $setDeactivated(false);
    }

    const frame  = movie_clip.currentFrame;
    const layers = movie_clip.layers;
    for (let idx = layers.length - 1; idx > -1; --idx) {

        const layer = layers[idx];
        if (!layer) {
            continue;
        }

        // 非表示の場合はスキップ
        if (layer.disable) {
            continue;
        }

        // マスクの親レイヤーでロックされている場合はスキップ
        if (layer.mode === $MASK_MODE && layer.lock) {
            continue;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        if (!activeCharacters.length) {
            continue;
        }

        // 昇順に並ぶかえ
        const characters = activeCharacters
            .sort((a, b) => a.depth < b.depth ? -1 : 1);

        for (let idx = 0; idx < characters.length; ++idx) {

            const character = characters[idx];
            if (!character) {
                continue;
            }

            await screenAreaAppendCharacterService(character, layer);
        }
    }

    // 再描画状態を設定
    $setReDrawState(false);

    // 再生中ではない場合はツールのイベントを発火
    if (timelineHeader.stopFlag) {
        const tool = $getActiveTool();
        if (tool) {
            tool.dispatchEvent(EventType.START);
        }
    }
};