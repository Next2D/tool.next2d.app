import type { Video } from "@/core/domain/model/Video";
import type { VideoPublishJsonImpl } from "@/interface/VideoPublishJsonImpl";
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
export const execute = (video: Video): VideoPublishJsonImpl =>
{
    const object: VideoPublishJsonImpl = {
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