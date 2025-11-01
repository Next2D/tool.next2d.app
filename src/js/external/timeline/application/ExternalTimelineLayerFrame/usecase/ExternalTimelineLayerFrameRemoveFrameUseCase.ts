import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameRemoveEmptyFramesUseCase } from "./ExternalTimelineLayerFrameRemoveEmptyFramesUseCase";
import { execute as externalTimelineLayerFrameRemoveKeyFramesUseCase } from "./ExternalTimelineLayerFrameRemoveKeyFramesUseCase";
import { execute as externalTimelineLayerFrameEraseEmptyKeyframeUseCase } from "./ExternalTimelineLayerFrameEraseEmptyKeyframeUseCase";
import { execute as externalTimelineLayerFrameEraseKeyframeUseCase } from "./ExternalTimelineLayerFrameEraseKeyframeUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description 指定レイヤーの指定範囲のフレームを削除
 *              Delete the frames of the specified range of the specified layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} start_frame
 * @param  {number} [end_frame=0]
 * @return {Promise<void>}
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

        let stopFrame = end_frame;
        for (let frame = start_frame; frame < stopFrame; ++frame) {

            const activeCharacters = layer.getActiveCharacters(frame);
            if (activeCharacters.length) {

                reload = true;

                // キーフレームがある場合はキーフレームを削除
                const character = activeCharacters[0];
                const currentEndFrame = character.endFrame;

                const endFrame = Math.min(
                    character.endFrame,
                    stopFrame
                );

                const startFrame = Math.max(
                    frame,
                    character.startFrame
                );

                // 削除するフレーム数を算出
                const numFrames = endFrame - startFrame;

                // キーフレームの幅以上の場合はキーフレームを削除、それ以外は終了位置を更新
                if (numFrames === character.endFrame - character.startFrame) {
                    // キーフレームのフレームを全て削除
                    await externalTimelineLayerFrameEraseKeyframeUseCase(
                        work_space,
                        movie_clip,
                        layer,
                        activeCharacters
                    );
                } else {
                    // キーフレームのフレーム削除実行
                    await externalTimelineLayerFrameRemoveKeyFramesUseCase(
                        work_space,
                        movie_clip,
                        layer,
                        activeCharacters,
                        numFrames
                    );
                }

                // キーフレームを跨いでいる場合は次のキーフレームの開始フレームをセット
                // キーフレームないであれば最終
                if (end_frame >= currentEndFrame) {
                    frame = start_frame - 1;
                    stopFrame -= numFrames;
                    continue;
                } else {
                    break;
                }

            } else {

                const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
                if (activeEmptyCharacter) {
                    // 変更前の最終フレームをセット
                    const currentEndFrame = activeEmptyCharacter.endFrame;

                    const endFrame = Math.min(
                        activeEmptyCharacter.endFrame,
                        stopFrame
                    );

                    const startFrame = Math.max(
                        frame,
                        activeEmptyCharacter.startFrame
                    );

                    // 削除するフレーム数を算出
                    const numFrames = endFrame - startFrame;

                    /// 空のキーフレームの幅以上の場合はキーフレームを削除、それ以外は終了位置を更新
                    if (numFrames === activeEmptyCharacter.endFrame - activeEmptyCharacter.startFrame) {
                        // 空のキーフレームのフレームを全て削除
                        await externalTimelineLayerFrameEraseEmptyKeyframeUseCase(
                            work_space,
                            movie_clip,
                            layer,
                            activeEmptyCharacter
                        );
                    } else {
                        // 空のキーフレームのフレーム削除実行
                        await externalTimelineLayerFrameRemoveEmptyFramesUseCase(
                            work_space,
                            movie_clip,
                            layer,
                            activeEmptyCharacter,
                            numFrames
                        );
                    }

                    // キーフレームを跨いでいる場合は次のキーフレームの開始フレームをセット
                    // キーフレームないであれば最終
                    if (end_frame >= currentEndFrame) {
                        frame = start_frame - 1;
                        stopFrame -= numFrames;
                        continue;
                    } else {
                        break;
                    }

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

    if (!work_space.active) {
        return ;
    }

    if (movie_clip.active) {
        if (reload) {
            await screenAreaRedrawUseCase(movie_clip);
        }
    } else {
        await screenAreaRedrawUseCase(movie_clip);
    }
};