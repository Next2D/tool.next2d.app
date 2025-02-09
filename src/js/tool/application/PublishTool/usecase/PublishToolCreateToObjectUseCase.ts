import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getUseLibraryIds } from "../PublishToolUtil";
import type { IPublishObject } from "@/interface/IPublishObject";

/**
 * @description 指定のMovieClipをRootにして、現在のWorkSpaceのライブラリアイテムを書き出す
 *              Root the specified MovieClip and export the library items in the current WorkSpace.
 *
 * @param  {MovieClip} movie_clip
 * @return {object}
 * @method
 * @public
 */
export const execute = async (movie_clip: MovieClip): Promise<IPublishObject> =>
{
    const workSpace = $getCurrentWorkSpace();

    // root objectを作成
    const root = await movie_clip.toPublish();
    const characters = [root];

    // シンボルは全て書き出す
    const useLibraryIds = $getUseLibraryIds();
    const completedIds = new Map();
    const symbols: Map<string, number> = new Map();
    for (const [libraryId, instance] of workSpace.libraries) {

        if (useLibraryIds.has(libraryId)) {
            continue;
        }

        if (!instance.symbol) {
            continue;
        }

        const object = await instance.toPublish();

        const characterId = useLibraryIds.size + 1;
        characters[characterId] = object;
        useLibraryIds.set(libraryId, characterId);
        symbols.set(instance.symbol, characterId);

        // 書き出し完了のマップに登録
        completedIds.set(libraryId, true);
    }

    // 書き出し対象のライブラリアイテムを全て書き出し
    for (;;) {

        const size = useLibraryIds.size;
        for (const [libraryId, characterId] of useLibraryIds) {

            // 書き出し完了したアイテムはスキップ
            if (completedIds.has(libraryId)) {
                continue;
            }

            const instance = workSpace.getLibrary(libraryId);
            if (!instance) {
                continue;
            }

            const object = await instance.toPublish();
            characters[characterId] = object;

            // 書き出し完了のマップに登録
            completedIds.set(libraryId, true);
        }

        if (size === useLibraryIds.size) {
            break;
        }
    }

    const stage = workSpace.stage;
    return {
        "type": "json",
        "stage": {
            "width": stage.width,
            "height": stage.height,
            "fps": stage.fps,
            "bgColor": stage.bgColor
        },
        "characters": characters,
        "symbols": Array.from(symbols)
    };
};