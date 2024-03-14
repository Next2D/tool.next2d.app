import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerFrameWindowMouseMoveEventUseCase } from "./TimelineLayerFrameWindowMouseMoveEventUseCase";
import { execute as timelineLayerFrameWindowMouseUpEventUseCase } from "./TimelineLayerFrameWindowMouseUpEventUseCase";

/**
 * @description 複数フレームの選択の開始関数、windowにmoveイベントを登録する
 *              Start function for multiple frame selection, register move event in window
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    frame: number
): void => {

    // 外部APIを起動
    const externalLayer    = new ExternalLayer(work_space, movie_clip, layer);
    const externalTimeline = new ExternalTimeline(work_space, movie_clip);

    // 指定レイヤーを選択状態に更新
    // fixed logic
    externalTimeline
        .selectedLayers([externalLayer.index]);

    // 指定フレームを選択状態に更新
    externalTimeline.selectedFrames([frame]);

    // 最初に選択したフレームとレイヤーをセット
    movie_clip.selectedFrameObject.start = frame;
    movie_clip.selectedFrameObject.end   = frame;

    // フレーム選択イベントを登録
    window.addEventListener(EventType.MOUSE_MOVE,
        timelineLayerFrameWindowMouseMoveEventUseCase
    );
    // 終了イベントを登録
    window.addEventListener(EventType.MOUSE_UP,
        timelineLayerFrameWindowMouseUpEventUseCase
    );
};