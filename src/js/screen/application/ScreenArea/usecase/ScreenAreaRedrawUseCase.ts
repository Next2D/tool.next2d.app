import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as screenAreaAppendCharacterService } from "../service/ScreenAreaAppendCharacterService";
import { $MASK_MODE } from "@/config/LayerModeConfig";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { EventType } from "@/tool/domain/event/EventType";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getCacheCanvas } from "@/cache/CacheUtil";
import { $setReDrawState } from "../ScreenAreaUtil";

/**
 * @description スクリーンエリアを再描画
 *              Redraw screen area
 *
 * @return {Promise}
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

    const elements = element.querySelectorAll(".display-object");
    for (let idx = 0; idx < elements.length; idx++) {
        elements[idx].remove();
    }

    // 再描画状態を設定
    $setReDrawState(true);

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    let maskStyle = "";
    let masked = false;
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
            // マスク終了、マスクフラグを解除
            masked = false;
            maskStyle = "";
            continue;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        if (!activeCharacters.length) {
            continue;
        }

        if (!masked && layer.parentId > -1) {
            const maskLayer = movieClip.getLayerById(layer.parentId);
            if (maskLayer && maskLayer.lock) {
                // マスク用のスタイルを初期化
                masked = true;

                const activeCharacters = maskLayer.getActiveCharacters(frame);
                if (activeCharacters.length) {
                    const character = activeCharacters[0];
                    const instance = workSpace.getLibrary(character.libraryId);
                    if (instance) {
                        const cacheKey = character.cacheKey;

                        let canvas = $getCacheCanvas(workSpace.id, instance.id, cacheKey);
                        if (!canvas) {
                            canvas = await instance.getHTMLElement();
                            if (!canvas) {
                                continue;
                            }

                            // キャッシュに保存
                            // $setCacheCanvas(workSpace.id, instance.id, cacheKey, canvas);
                        }

                        const base64 = canvas.toDataURL();
                        const scale = window.devicePixelRatio;
                        const width  = canvas.width / scale;
                        const height = canvas.height / scale;

                        // マスク用のスタイルを生成
                        maskStyle += `mask: url(${base64}), none;`;
                        maskStyle += `-webkit-mask: url(${base64}), none;`;
                        maskStyle += `mask-size: ${width}px ${height}px;`;
                        maskStyle += `-webkit-mask-size: ${width}px ${height}px;`;
                        maskStyle += "mask-repeat: no-repeat;";
                        maskStyle += "-webkit-mask-repeat: no-repeat;";
                        maskStyle += `mask-position: ${0}px ${0}px;`;
                        maskStyle += `-webkit-mask-position: ${0}px ${0}px;`;
                    }
                }
            }
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