import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Character } from "@/core/domain/model/Character";
import type { ISoundPublishObject } from "@/interface/ISoundPublishObject";
import type { IMovieClipPublishJson } from "@/interface/IMovieClipPublishJson";
import type { IActionSaveObject } from "@/interface/IActionSaveObject";
import type { Layer } from "@/core/domain/model/Layer";
import type { ICharacterPublishObject } from "@/interface/ICharacterPublishObject";
import type { IControllerPublishObject } from "@/interface/IControllerPublishObject";
import type { IPlaceObject } from "@/interface/IPlaceObject";
import type { IPlaceObjectMap } from "@/interface/IPlaceObjectMap";
import { minify } from "terser";
import {
    $GUIDE_MODE,
    $MASK_IN_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";
import { execute as userSettingObjectGetService } from "@/user/application/Setting/service/UserSettingObjectGetService";
import { execute as movieClipCreatePublishPlaceObjectService } from "../service/MovieClipCreatePublishPlaceObjectService";
import { $getUseLibraryIds } from "@/tool/application/PublishTool/PublishToolUtil";

/**
 * @description Next2D PlayerのMovieClipのインスタンスを生成する
 *              Create an instance of the MovieClip in Next2D Player
 *
 * @param  {MovieClip} movie_clip
 * @return {object}
 * @method
 * @public
 */
export const execute = async (movie_clip: MovieClip): Promise<IMovieClipPublishJson> =>
{
    const dictionary: ICharacterPublishObject[] = [];
    const controller: IControllerPublishObject = [];
    const placeMap: IPlaceObjectMap = [];
    const placeObjects: IPlaceObject[] = [];

    // 外部連携データ
    const userSettingObject = userSettingObjectGetService();
    const useLibraryIds = $getUseLibraryIds();

    // MovieClip内の最小フレームと最大フレームを取得
    const minFrame = movie_clip.minFrame;
    const maxFrame = movie_clip.maxFrame;

    // 描画対象のレイヤーをマスクを考慮して重ね順に並び替える
    const targetLayers: Layer[] = [];
    const maskDepthMap: Map<number, number> = new Map();
    const ignoreMap: Map<Character, Character> = new Map();
    const unionMap: Map<Character, number> = new Map();
    for (let idx = movie_clip.layers.length - 1; idx > -1; --idx) {

        const layer = movie_clip.layers[idx];
        if (!layer) {
            continue;
        }

        // 非表示レイヤー
        if (!userSettingObject.layer && layer.disable) {
            continue;
        }

        // ガイドレイヤーは書き出し対象外
        if (layer.mode === $GUIDE_MODE) {
            continue;
        }

        if (layer.mode === $MASK_IN_MODE) {

            // マスク本体のレイヤーを取得して描画対象として登録
            const parentLayer = movie_clip.getLayerById(layer.parentId);
            if (parentLayer && targetLayers.indexOf(parentLayer) === -1) {
                targetLayers.push(parentLayer);
            }

            // マップが存在しない場合は初期化
            if (!maskDepthMap.has(layer.parentId)) {
                maskDepthMap.set(layer.parentId, 1);
            }

            // depthの数を加算
            const depth = maskDepthMap.get(layer.parentId) as NonNullable<number>;
            maskDepthMap.set(layer.parentId, depth + layer.characters.length);
        }

        // 描画対象のレイヤーを追加
        targetLayers.push(layer);

        // レイヤーに配置されたキャラクターを昇順に並び替える
        const characters = layer.characters.slice();
        characters.sort((a, b) => a.startFrame - b.startFrame);

        // 前後がつながっているキャラクターを結合
        const characterMap: Map<number, Map<number, Character>> = new Map();

        // レイヤーに配置されたキャラクターをマッピング
        for (let idx = 0; characters.length > idx; ++idx) {

            const character = characters[idx];
            if (!character) {
                continue;
            }

            if (!characterMap.has(character.libraryId)) {
                characterMap.set(character.libraryId, new Map());
            }

            const map = characterMap.get(character.libraryId) as NonNullable<Map<number, Character>>;
            map.set(character.startFrame, character);
        }

        for (const map of characterMap.values()) {

            let size = map.size;
            if (2 > size) {
                continue;
            }

            const iterator = map.values();

            let character = iterator.next().value;
            if (!character) {
                continue;
            }

            let endFrame  = character.endFrame;
            unionMap.set(character, endFrame);

            while (size > 0) {

                size--;

                if (!map.has(endFrame)) {
                    character = iterator.next().value;
                    if (!character) {
                        continue;
                    }

                    if (ignoreMap.has(character)) {
                        continue;
                    }

                    endFrame = character.endFrame;
                    unionMap.set(character, endFrame);
                    continue;
                }

                const unionCharacter = map.get(endFrame) as NonNullable<Character>;
                if (ignoreMap.has(unionCharacter)) {
                    continue;
                }

                endFrame = unionCharacter.endFrame;

                if (!character) {
                    continue;
                }

                // 結合して最終フレームを更新
                unionMap.set(character, endFrame);

                // tag生成をスキップするためにマップに追加
                ignoreMap.set(unionCharacter, character);
            }

        }
    }

    const dictionaryIdMap: Map<Character, number> = new Map();
    const placeObjectIdMap: Map<Character, number> = new Map();
    for (let frame = minFrame; frame < maxFrame; ++frame) {

        let maskId = -1;
        let depth  = 0;
        let nextFrame = Number.MAX_VALUE;
        for (let idx = 0; idx < targetLayers.length; ++idx) {

            const layer = targetLayers[idx];
            if (!layer) {
                continue;
            }

            // マスク処理終了処理
            // fixed logic
            if (maskId > -1 && layer.id !== layer.parentId) {
                maskId = -1;
                depth += maskDepthMap.get(layer.id) as NonNullable<number>;
            }

            // マスクレイヤーの開始判定をセット
            // fixed logic
            if (maskDepthMap.has(layer.id) && maskId === -1) {
                maskId = layer.id;
            }

            const activeCharacters = layer.getActiveCharacters(frame);
            if (!activeCharacters.length) {
                const emptyCharacter = layer.getActiveEmptyCharacter(frame);
                if (emptyCharacter) {
                    nextFrame = Math.min(nextFrame, emptyCharacter.endFrame - 1);
                }
                continue;
            }

            // キャラクターを昇順に並び替える
            activeCharacters.sort((a, b) => a.depth - b.depth);
            for (let idx = 0; idx < activeCharacters.length; ++idx) {

                const character = activeCharacters[idx];
                if (!character) {
                    continue;
                }

                // 次のキーフレームで一番小さいフレームを取得
                nextFrame = Math.min(nextFrame, character.endFrame - 1);

                // 利用したライブラリIDを登録
                // fixed logic
                if (!useLibraryIds.has(character.libraryId)) {
                    useLibraryIds.set(character.libraryId, useLibraryIds.size + 1);
                }

                // フレームが存在しない場合は初期化
                if (!(frame in controller)) {
                    controller[frame] = [];
                }
                if (!(frame in placeMap)) {
                    placeMap[frame] = [];
                }

                switch (true) {

                    // 結合されたキャラクターの場合
                    case ignoreMap.has(character):
                        {
                            let isAddDepth = false;
                            const ignoreCharacter = ignoreMap.get(character) as NonNullable<Character>;
                            if (dictionaryIdMap.has(ignoreCharacter)) {
                                controller[frame][depth] = dictionaryIdMap.get(ignoreCharacter) as NonNullable<number>;
                                isAddDepth = true;
                            }

                            if (character.startFrame === frame) {
                                const placeObjectId = placeObjects.length;
                                placeMap[frame][depth] = placeObjectId;
                                placeObjectIdMap.set(character, placeObjectId);

                                placeObjects.push(
                                    movieClipCreatePublishPlaceObjectService(character)
                                );

                                isAddDepth = true;
                            } else {
                                if (placeObjectIdMap.has(character)) {
                                    placeMap[frame][depth] = placeObjectIdMap.get(character) as NonNullable<number>;
                                    isAddDepth = true;
                                }
                            }

                            if (isAddDepth) {
                                depth++;
                            }
                        }
                        break;

                    // 既に登録されたキャラクターの場合
                    case dictionaryIdMap.has(character):
                        controller[frame][depth] = dictionaryIdMap.get(character) as NonNullable<number>;
                        placeMap[frame][depth] = placeObjectIdMap.get(character) as NonNullable<number>;
                        depth++;
                        break;

                    // キーフレームのキャラクターの場合
                    case character.startFrame === frame:
                        {
                            // 必須パラメーターを設定
                            const dictionaryObject: ICharacterPublishObject = {
                                "characterId": useLibraryIds.get(character.libraryId) as NonNullable<number>,
                                "startFrame": character.startFrame,
                                "endFrame": unionMap.has(character)
                                    ? unionMap.get(character) as NonNullable<number>
                                    : character.endFrame
                            };

                            if (character.name) {
                                dictionaryObject.name = character.name;
                            }

                            if (layer.mode === $MASK_MODE) {
                                dictionaryObject.clipDepth = maskDepthMap.get(layer.id) as NonNullable<number> + depth;
                            }

                            const dictionaryId = dictionary.length;
                            dictionary.push(dictionaryObject);

                            controller[frame][depth] = dictionaryId;
                            dictionaryIdMap.set(character, dictionaryId);

                            const placeObjectId = placeObjects.length;
                            placeMap[frame][depth] = placeObjectId;
                            placeObjectIdMap.set(character, placeObjectId);

                            // PlaceObjectを生成
                            placeObjects.push(
                                movieClipCreatePublishPlaceObjectService(character)
                            );

                            depth++;
                        }
                        break;

                    default:
                        throw new Error("Invalid character");

                }
            }
        }

        // 次のキーフレームへ移動
        if (nextFrame !== Number.MAX_VALUE) {
            while (nextFrame > frame) {
                controller[frame + 1] = controller[frame].slice();
                placeMap[frame + 1] = placeMap[frame].slice();
                frame++;
            }
        }
    }

    const object: IMovieClipPublishJson = {
        "extends": next2d.display.MovieClip.namespace,
        "totalFrame": movie_clip.maxFrame,
        "dictionary": dictionary,
        "controller": controller,
        "placeMap": placeMap,
        "placeObjects": placeObjects
    };

    // シンボル名が設定されている場合は追加
    if (movie_clip.symbol) {
        object.symbol = movie_clip.symbol;
    }

    // アクションが設定されている場合は追加
    if (movie_clip.actions.size) {
        const actions: IActionSaveObject[] = [];
        for (const [frame, code] of movie_clip.actions) {
            const result = await minify(code);
            actions.push({
                "frame": frame,
                "action": result.code || ""
            });
        }

        object.actions = actions;
    }

    // サウンドが設定されている場合は追加
    if (movie_clip.sounds.size) {
        const sounds = [];
        for (const [frame, values] of movie_clip.sounds) {

            const object: ISoundPublishObject = {
                "frame": frame,
                "sound": []
            };

            for (let idx = 0; idx < values.length; ++idx) {

                const soundObject = values[idx];

                object.sound.push({
                    "characterId": soundObject.libraryId,
                    "volume":      soundObject.volume / 100,
                    "autoPlay":    soundObject.autoPlay,
                    "loopCount":   soundObject.loopCount
                });

            }

            sounds.push(object);
        }

        object.sounds = sounds;
    }

    // ラベルが設定されている場合は追加
    if (movie_clip.labels.size) {
        const labels = [];
        for (const [frame, name] of movie_clip.labels) {
            labels.push({
                "frame": frame,
                "name": name
            });
        }

        object.labels = labels;
    }

    return object;
};