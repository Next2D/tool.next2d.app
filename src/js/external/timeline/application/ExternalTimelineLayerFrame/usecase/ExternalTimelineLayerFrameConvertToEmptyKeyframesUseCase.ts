import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { $convertFrameObject } from "@/timeline/application/TimelineUtil";
import { execute as externalTimelineLayerFrameGetPrevBlankFrameObjectService } from "../service/ExternalTimelineLayerFrameGetPrevBlankFrameObjectService";

/**
 * @description 選択中のレイヤーに空のキーフレームを追加
 *              Add an empty keyframe to the selected layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} start_frame
 * @param  {number} end_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    start_frame: number,
    end_frame: number = 0
): void =>
{
    // レイヤーが何も選択されてなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    const frameObject = $convertFrameObject(start_frame, end_frame);

    // 昇順に並び替えたレイヤー配列を取得
    const selectedLayers = movie_clip.getCloneAndSortSelectedLayers();
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];
        if (!layer) {
            continue;
        }

        // 1フレーム目より先のフレームにキーフレームを追加する場合
        if (frameObject.start > 1) {
            // 追加するフレームより前のフレームにキーフレームがあるか確認
            const prevFrameObject = externalTimelineLayerFrameGetPrevBlankFrameObjectService(layer, frameObject.start);

            // 空白のフレームがあれば空のキーフレームで埋める
            if (prevFrameObject) {
                const emptyCharacter = new EmptyCharacter();
                emptyCharacter.startFrame = prevFrameObject.start;
                emptyCharacter.endFrame   = frameObject.start;
                layer.addEmptyCharacter(emptyCharacter);

                // TODO 履歴に追加
            }
        }

        for (let frame = frameObject.start; frame < frameObject.end; ++frame) {
            const emptyCharacter = new EmptyCharacter();
            emptyCharacter.startFrame = frame;
            emptyCharacter.endFrame   = frame + 1;
            layer.addEmptyCharacter(emptyCharacter);

            // TODO 履歴に追加
        }

        console.log(layer);
    }
};