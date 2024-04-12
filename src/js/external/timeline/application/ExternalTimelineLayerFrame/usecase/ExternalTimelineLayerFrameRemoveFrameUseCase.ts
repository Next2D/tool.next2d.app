import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerFrameForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameForwardKeyframeService";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as timelineLayerFrameRemoveEmptyFramesHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/RemoveEmptyFrames/usecase/TimelineLayerFrameRemoveEmptyFramesHistoryUseCase";

/**
 * @description 指定レイヤーの指定範囲のフレームを削除
 *              Delete the frames of the specified range of the specified layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} start_frame
 * @param  {number} [end_frame=0]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    start_frame: number,
    end_frame: number = 0
): void => {

    // 選択中のレイヤーがなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    // 終了フレームがなければ開始フレーム+1をセット
    if (!end_frame) {
        end_frame = start_frame + 1;
    }

    for (let idx = 0; idx < movie_clip.selectedLayers.length; idx++) {

        const layer = movie_clip.selectedLayers[idx];
        if (!layer) {
            continue;
        }

        let stopFrame = end_frame;
        for (let frame = start_frame; frame < stopFrame; ++frame) {

            const activeCharacters = layer.getActiveCharacters(frame);
            if (activeCharacters.length) {

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

                // 後方のキーフレームを前方へ移動
                // fixed logic
                externalTimelineLayerFrameForwardKeyframeService(
                    layer,
                    character.endFrame,
                    numFrames
                );

                // キーフレームの幅以上の場合はキーフレームを削除、それ以外は終了位置を更新
                if (numFrames === character.endFrame - character.startFrame) {
                    // キーフレームを削除
                    for (let idx = 0; idx < activeCharacters.length; ++idx) {
                        const activeCharacter = activeCharacters[idx];
                        layer.removeCharacter(activeCharacter);
                    }
                } else {
                    // 終了位置を更新
                    for (let idx = 0; idx < activeCharacters.length; ++idx) {
                        const activeCharacter = activeCharacters[idx];
                        activeCharacter.endFrame -= numFrames;
                    }
                }

                // キーフレームを跨いでいる場合は次のキーフレームの開始フレームをセット
                // キーフレームないであれば最終
                if (end_frame >= currentEndFrame) {
                    frame = start_frame - 1;
                    stopFrame -= numFrames;
                } else {
                    break;
                }

                continue;

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

                    // 後方のキーフレームを前方へ移動
                    // fixed logic
                    externalTimelineLayerFrameForwardKeyframeService(
                        layer,
                        activeEmptyCharacter.endFrame,
                        numFrames
                    );

                    /// 空のキーフレームの幅以上の場合はキーフレームを削除、それ以外は終了位置を更新
                    if (numFrames === activeEmptyCharacter.endFrame - activeEmptyCharacter.startFrame) {

                        // 履歴を登録

                        // 空のキーフレームを削除
                        layer.removeEmptyCharacter(activeEmptyCharacter);

                    } else {

                        const beforeEndFrame = activeEmptyCharacter.endFrame;

                        // 終了位置を更新
                        activeEmptyCharacter.endFrame -= numFrames;

                        // 履歴を登録
                        timelineLayerFrameRemoveEmptyFramesHistoryUseCase(
                            work_space,
                            movie_clip,
                            layer,
                            activeEmptyCharacter,
                            beforeEndFrame
                        );
                    }

                    // キーフレームを跨いでいる場合は次のキーフレームの開始フレームをセット
                    // キーフレームないであれば最終
                    if (end_frame >= currentEndFrame) {
                        frame = start_frame - 1;
                        stopFrame -= numFrames;
                    } else {
                        break;
                    }

                    continue;

                } else {
                    // ヒットがなければ終了
                    break;
                }
            }
        }

        if (work_space.active && movie_clip.active) {
            // タイムラインのレイヤー表示を更新
            timelineLayerAddFrameUpdateLayerStyleUseCase(work_space, movie_clip, layer);
        }
    }
};