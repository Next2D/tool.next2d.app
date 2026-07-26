import type { Character } from "@/core/domain/model/Character";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 親のフレーム位置から、子MovieClipの再生フレームを算出
 *              Calculate the playback frame of the child MovieClip from the parent frame position
 *
 * @param  {MovieClip} movie_clip
 * @param  {Character} character
 * @param  {number} parent_frame
 * @return {number}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    character: Character,
    parent_frame: number = 1
): number => {

    const totalFrame = movie_clip.maxFrame - 1;
    const maxFrame   = parent_frame - character.startFrame + 1;

    let frame = 0;
    for (let idx = 0; idx < maxFrame; ++idx) {
        ++frame;
        if (totalFrame < frame) {
            frame = 1;
        }
    }

    return frame;
};
