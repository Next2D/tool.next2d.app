import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalMovieClipCreateLayerUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipCreateLayerUseCase";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/application/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description 新規レイヤー追加ユースケース
 *              New Layer Add Use Case
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} [index = 0]
 * @param  {string} [name = ""]
 * @param  {string} [color = ""]
 * @param  {boolean} [receiver = false]
 * @return {ExternalLayer | null}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    index: number = 0,
    name: string = "",
    color: string = "",
    layer_id: number = -1,
    receiver: boolean = false
): ExternalLayer | null => {

    // フレーム選択を初期化
    movie_clip.clearSelectedFrame();

    // 新規レイヤーを追加
    const layer = externalMovieClipCreateLayerUseCase(
        work_space,
        movie_clip,
        index, name, color, layer_id
    );

    if (!layer) {
        return null;
    }

    // 履歴を登録
    timelineToolLayerAddHistoryUseCase(
        work_space, movie_clip, layer, receiver
    );

    return new ExternalLayer(
        work_space, movie_clip, layer
    );
};