import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { Character } from "@/core/domain/model/Character";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { execute as externalSoundAreaAddSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaAddSoundUseCase"
import { execute as externalLayerAddCharacterUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerAddCharacterUseCase";
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
    const item = externalLibrary.getItem(path);
    if (!item) {
        return ;
    }

    // 音声とフォルダは追加できない
    switch (item.type) {

        case $SOUND_TYPE:
            await externalSoundAreaAddSoundUseCase(
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

        // 外部アイテムを読み込む
        // fixed logic
        character.libraryId = item.id;

        // 配置位置を設定
        // fixed logic
        character.x = dx;
        character.y = dy;

        const externalCharacter = new ExternalCharacter(
            work_space,
            movie_clip,
            layer,
            character
        );

        await externalLayerAddCharacterUseCase(
            work_space,
            movie_clip,
            layer,
            externalCharacter,
            0,
            receiver
        );
    }
};