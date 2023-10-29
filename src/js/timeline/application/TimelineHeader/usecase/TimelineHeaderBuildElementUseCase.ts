import { $TIMELINE_HEADER_ID } from "../../../../config/TimelineConfig";
import { $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { execute as timelineHeaderFrameComponent } from "../component/TimelineHeaderFrameComponent";
import { execute as timelineHeaderFrameRegisterEvent } from "./TimelineHeaderFrameRegisterEvent";
import {
    $getTimelineFrameWidth,
    timelineHeader
} from "../../TimelineUtil";
import type { MovieClip } from "../../../../core/domain/model/MovieClip";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

/**
 * @description タイムラインのヘッダーをスクロール位置の合わせて構築
 *              Build the timeline header to match the scroll position
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_HEADER_ID);

    if (!element) {
        return ;
    }

    const workSpace: WorkSpace | null = $getCurrentWorkSpace();
    if (!workSpace) {
        return ;
    }

    const scene: MovieClip = workSpace.scene;

    const timelineFrameWidth: number = $getTimelineFrameWidth();
    const elementCount: number = timelineHeader.clientWidth / (timelineFrameWidth + 1) | 0;

    // Elementがなければ初期登録
    if (!element.children.length) {
        const lastFrame: number = elementCount + 1;
        for (let frame = 1; lastFrame >= frame; ++frame) {

            // フレームのタグを追加
            element.insertAdjacentHTML("beforeend", timelineHeaderFrameComponent(frame));

            const node: HTMLElement | null = element.lastElementChild as HTMLElement;
            if (!node) {
                continue;
            }

            // フレームのタグにイベントを登録
            timelineHeaderFrameRegisterEvent(node);
        }
    }
};