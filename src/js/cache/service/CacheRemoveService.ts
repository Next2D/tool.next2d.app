import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $removeLibraryCache } from "../CacheUtil";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";

/**
 * @description ライブラリIDに紐づくキャッシュを削除
 *              Remove all caches related to the library ID
 *
 * @param {WorkSpace} work_space
 * @param {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    library_id: number
): void => {

    const instance = work_space.getLibrary(library_id);
    if (!instance) {
        return ;
    }

    // 指定のライブラリIDのキャッシュを全て削除
    $removeLibraryCache(work_space.id, library_id);

    for (const instance of work_space.libraries.values()) {
        if (instance.type !== $MOVIE_CLIP_TYPE) {
            continue ;
        }

        const layers = (instance as MovieClip).layers;
        for (let idx = 0; idx < layers.length; idx++) {
            const layer = layers[idx];
            if (!layer) {
                continue;
            }

            const characters = layer.characters;
            for (let idx = 0; idx < characters.length; idx++) {
                const character = characters[idx];
                if (!character) {
                    continue;
                }

                if (character.libraryId !== library_id) {
                    continue;
                }

                if (character.parentMovieClipId === -1) {
                    continue;
                }

                // 親のMovieClipのキャッシュを削除
                execute(work_space, character.parentMovieClipId);
            }
        }
    }
};