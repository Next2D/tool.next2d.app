import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerControllerLayerNameUpdateHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerController/LayerName/usecase/TimelineLayerControllerLayerNameUpdateHistoryUseCase";
import { execute as timelineLayerControllerUpdateNameElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateNameElementService";

/**
 * @description 指定レイヤーの名前を変更
 *              Rename specified layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {string} name
 * @param  {boolean} [receiver = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    name: string,
    receiver: boolean = false
): void => {

    // 作業履歴を登録
    timelineLayerControllerLayerNameUpdateHistoryUseCase(
        work_space, movie_clip, layer, name, receiver
    );

    // 表示中ならElementを更新
    if (work_space.active && movie_clip.active) {
        timelineLayerControllerUpdateNameElementService(layer, name);
    }

    // 内部データを更新
    layer.name = name;
};