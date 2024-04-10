import { Character } from "@/core/domain/model/Character";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import type { ExternalItemImpl } from "@/interface/ExternalItemImpl";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineLayerFrameAddKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/AddKeyframe/usecase/TimelineLayerFrameAddKeyframeHistoryUseCase";
import { execute as screenAreaAppendCharacterService } from "@/screen/application/ScreenArea/usecase/ScreenAreaAppendCharacterService";
import { $FOLDER_TYPE, $SOUND_TYPE } from "@/config/InstanceConfig";
import { b } from "vitest/dist/suite-a18diDsI.js";

/**
 * @description ライブラリのアイテムをMovieClipに追加
 *              Add a library item to MovieClip
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} x
 * @param  {number} y
 * @param  {string} path
 * @param  {boolean} [receiver=false]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    x: number,
    y: number,
    path: string,
    receiver: boolean = false
): Promise<void> => {

    // 追加するレイヤーをセット
    const layer = movie_clip.layers.length
        ? movie_clip.layers[0]
        : movie_clip.layers[0];

    if (!layer) {
        return ;
    }

    const externalLibrary = new ExternalLibrary(work_space);
    const item: ExternalItemImpl<any> | null = externalLibrary.getItem(path);
    if (!item) {
        return ;
    }

    // 音声とフォルダは追加できない
    switch (item.type) {

        case $SOUND_TYPE:
        case $FOLDER_TYPE:
            return ;

        default:
            break;

    }

    // 新規のDisplayObjectを作成
    const character = new Character();
    layer.addCharacter(character);
    character.loadExternalItem(item);
    character.x = x;
    character.y = y;

    // 空のキーフレームがあれば記録に残す
    let emptyCharacterIndex = -1;

    const frame = movie_clip.currentFrame;

    const activeCharacters = layer.getActiveCharacters(frame);
    if (activeCharacters.length) {
        // 既にアクティブなキャラクターがある場合は、そのキーフレームに含める
        const activeCharacter = activeCharacters[0];
        character.startFrame  = activeCharacter.startFrame;
        character.endFrame    = activeCharacter.endFrame;
        character.depth       = activeCharacters.length;
    } else {
        // 空のキーフレームがある場合は情報を引き継いで、空のキーフレームを削除
        const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (activeEmptyCharacter) {
            character.startFrame = activeEmptyCharacter.startFrame;
            character.endFrame   = activeEmptyCharacter.endFrame;
            emptyCharacterIndex  = layer.emptyCharacters.indexOf(activeEmptyCharacter);
            layer.removeEmptyCharacter(activeEmptyCharacter);
        } else {
            // 新規のキーフレームレイヤーの最大フレーム以降に登録
            const maxFrame = layer.maxFrame;
            character.startFrame = maxFrame ? maxFrame : 1;
            character.endFrame   = frame + 1;
        }
    }

    // 履歴に登録
    timelineLayerFrameAddKeyframeHistoryUseCase(
        work_space, movie_clip,
        layer, character,
        emptyCharacterIndex, receiver
    );

    if (work_space.active && movie_clip.active) {

        const layerElement = timelineLayer.elements[layer.getDisplayIndex()] as NonNullable<HTMLElement>;
        if (!layerElement) {
            return ;
        }

        // フレームのstyleを更新
        timelineLayerFrameUpdateStyleService(
            work_space, movie_clip,
            layerElement.lastElementChild as NonNullable<HTMLElement>,
            $getLeftFrame()
        );

        // xスクロールの幅を更新
        timelineScrollUpdateWidthService();

        // スクリーンエリアにElementを追加
        await screenAreaAppendCharacterService(character, layer);
    }
};