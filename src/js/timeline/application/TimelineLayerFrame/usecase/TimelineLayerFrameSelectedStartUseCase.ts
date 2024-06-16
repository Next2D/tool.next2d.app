import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerFramePointerMoveEventUseCase } from "./TimelineLayerFramePointerMoveEventUseCase";
import { execute as timelineLayerFramePointerUpEventUseCase } from "./TimelineLayerFramePointerUpEventUseCase";

/**
 * @description 複数フレームの選択の開始関数、windowにmoveイベントを登録する
 *              Start function for multiple frame selection, register move event in window
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} frame
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    frame: number,
    frames: number[],
    event: PointerEvent
): Promise<void> => {

    // 外部APIを起動
    const externalLayer    = new ExternalLayer(work_space, movie_clip, layer);
    const externalTimeline = new ExternalTimeline(work_space, movie_clip);

    // 指定レイヤーを選択状態に更新
    // fixed logic
    externalTimeline
        .selectedLayers([externalLayer.index]);

    // 指定フレームを選択状態に更新
    await externalTimeline.selectedFrames(frames);

    // 最初に選択したフレームとレイヤーをセット
    movie_clip.selectedFrameObject.start = frame;
    movie_clip.selectedFrameObject.end   = frame;

    // フレーム選択イベントを登録
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.MOUSE_MOVE,
        timelineLayerFramePointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        timelineLayerFramePointerUpEventUseCase,
        { "passive": false }
    );
};