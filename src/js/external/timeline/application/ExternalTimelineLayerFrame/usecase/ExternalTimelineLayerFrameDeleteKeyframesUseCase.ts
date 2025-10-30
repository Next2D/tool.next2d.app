import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameDeleteEmptyKeyframeUseCase } from "./ExternalTimelineLayerFrameDeleteEmptyKeyframeUseCase";
import { execute as externalTimelineLayerFrameDeleteKeyframeUseCase } from "./ExternalTimelineLayerFrameDeleteKeyframeUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as viewTimelineLayerFrameDeleteKeyFrameUseCase } from "@/view/application/usecase/ViewTimelineLayerFrameDeleteKeyFrameUseCase";

/**
 * @description 指定レイヤーの指定範囲のキーフレームを削除
 *              Delete the frames of the specified range of the specified layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} start_frame
 * @param  {number} [end_frame=0]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    start_frame: number,
    end_frame: number = 0
): Promise<void> => {

    // 選択中のレイヤーがなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    // 終了フレームがなければ開始フレーム+1をセット
    if (!end_frame) {
        end_frame = start_frame + 1;
    }

    let reload = false;
    for (let idx = 0; idx < movie_clip.selectedLayers.length; idx++) {

        const layer = movie_clip.selectedLayers[idx];
        if (!layer) {
            continue;
        }

        for (let frame = start_frame; frame < end_frame; ++frame) {

            const activeCharacters = layer.getActiveCharacters(frame);
            if (activeCharacters.length) {

                reload = true;

                const character = activeCharacters[0];
                if (character.startFrame !== frame) {
                    continue;
                }

                // キーフレームを削除
                await externalTimelineLayerFrameDeleteKeyframeUseCase(
                    work_space,
                    movie_clip,
                    layer,
                    activeCharacters
                );

                // キーフレームを跨いでいる場合は次のキーフレームの開始フレームをセット
                frame = character.endFrame - 1;
            } else {
                const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
                if (activeEmptyCharacter) {
                    if (activeEmptyCharacter.startFrame !== frame) {
                        continue;
                    }

                    // 空のキーフレームを削除
                    await externalTimelineLayerFrameDeleteEmptyKeyframeUseCase(
                        work_space,
                        movie_clip,
                        layer,
                        activeEmptyCharacter
                    );

                    // キーフレームを跨いでいる場合は次のキーフレームの開始フレームをセット
                    frame = activeEmptyCharacter.endFrame - 1;
                } else {
                    // ヒットがなければ終了
                    break;
                }
            }
        }

        // タイムラインのレイヤー表示を更新
        if (work_space.active && movie_clip.active) {
            timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);
        }
    }

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // Viewを更新
    viewTimelineLayerFrameDeleteKeyFrameUseCase(
        work_space,
        movie_clip,
        reload
    );
};