import type { Video } from "@/core/domain/model/Video";
import type { IVideoPublishJson } from "@/interface/IVideoPublishJson";
import { Video as DisplayVideo } from "@next2d/media";

/**
 * @description Next2D Playerの再生用JSONオブジェクトを生成する
 *              Create a JSON object for playback in Next2D Player
 *
 * @param  {Video} video
 * @return {object}
 * @method
 * @public
 */
export const execute = (video: Video): IVideoPublishJson =>
{
    const object: IVideoPublishJson = {
        "extends": DisplayVideo.namespace,
        "buffer": video.buffer ? Array.from(video.buffer) : [],
        "volume": video.volume,
        "loop": video.loop,
        "autoPlay": video.autoPlay
    };

    if (video.symbol) {
        object.symbol = video.symbol;
    }

    return object;
};