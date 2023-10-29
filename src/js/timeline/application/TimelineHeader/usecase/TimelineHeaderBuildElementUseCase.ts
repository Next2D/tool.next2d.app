import { $TIMELINE_HEADER_ID } from "../../../../config/TimelineConfig";
import { execute as timelineHeaderFrameComponent } from "../component/TimelineHeaderFrameComponent";
import { execute as timelineHeaderFrameRegisterEventUseCase } from "./TimelineHeaderFrameRegisterEventUseCase";
import {
    $getTimelineFrameWidth,
    timelineHeader
} from "../../TimelineUtil";

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
            timelineHeaderFrameRegisterEventUseCase(node);
        }
    }
};