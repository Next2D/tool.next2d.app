import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IExternalItem } from "@/interface/IExternalItem";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { Character } from "@/core/domain/model/Character";
import { execute as timelineLayerFrameAddKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/AddKeyframe/usecase/TimelineLayerFrameAddKeyframeHistoryUseCase";
import { execute as screenAreaAppendCharacterService } from "@/screen/application/ScreenArea/service/ScreenAreaAppendCharacterService";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalSoundAreaAddSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaAddSoundUseCase";
import {
    $FOLDER_TYPE,
    $SOUND_TYPE
} from "@/config/InstanceConfig";

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
    indexes: number[] = [],
    receiver: boolean = false
): Promise<void> => {

    const externalLibrary = new ExternalLibrary(work_space);
    const item: IExternalItem<any> | null = externalLibrary.getItem(path);
    if (!item) {
        return ;
    }

    // 音声とフォルダは追加できない
    switch (item.type) {

        case $SOUND_TYPE:
            externalSoundAreaAddSoundUseCase(
                work_space,
                movie_clip,
                movie_clip.currentFrame,
                path
            );
            return ;

        case $FOLDER_TYPE:
            return ;

        default:
            break;

    }

    const layers = [];

    // 追加するレイヤーをセット
    if (indexes.length) {

        // 昇順に並び替え
        indexes = indexes.sort((a: number, b: number): number =>
        {
            return a - b;
        });

        for (let idx = 0; idx < indexes.length; idx++) {
            const layer = movie_clip.getLayer(indexes[idx]);
            if (!layer) {
                continue;
            }

            layers.push(layer);
        }
    }

    if (!layers.length) {
        if (movie_clip.selectedLayers.length) {
            layers.push(...movie_clip.getCloneAndSortSelectedLayers());
        } else {
            layers.push(movie_clip.getLayer(0));
        }
    }

    const dx = parseFloat(x.toFixed(2));
    const dy = parseFloat(y.toFixed(2));
    for (let idx = 0; idx < layers.length; idx++) {

        const layer = layers[idx];
        // レイヤーがロックか非表示モードならスキップ
        if (!layer || layer.lock || layer.disable) {
            continue;
        }

        // 新規のDisplayObjectを作成
        const character = new Character();

        // 配置位置を設定
        character.x = dx;
        character.y = dy;

        // 中心点を中央に設定（初期値）
        character.referencePosition.x = dx + character.width  / 2;
        character.referencePosition.y = dy + character.height / 2;

        // 外部アイテムを読み込む
        character.loadExternalItem(item);

        // 空のキーフレームがあれば記録に残す
        let emptyCharacterIndex = -1;

        const frame = movie_clip.currentFrame;

        const activeCharacters = layer.getActiveCharacters(frame);
        if (activeCharacters.length) {
            // 既にアクティブなキャラクターがある場合は、そのキーフレームに含める
            character.startFrame = activeCharacters[0].startFrame;
            character.endFrame   = activeCharacters[0].endFrame;
            character.depth      = activeCharacters.length;
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

        // レイヤーに追加
        // fixed logic
        layer.addCharacter(character);

        // 履歴に登録
        timelineLayerFrameAddKeyframeHistoryUseCase(
            work_space, movie_clip,
            layer, character,
            emptyCharacterIndex, receiver
        );

        if (work_space.active && movie_clip.active) {

            // タイムラインのレイヤー表示を更新
            timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);

            // スクリーンエリアにElementを追加
            await screenAreaAppendCharacterService(character, layer);
        }
    }
};