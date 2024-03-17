import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "../../TimelineUtil";
import { $getTimelineOffsetTop } from "@/timeline/application/TimelineArea/TimelineAreaUtil";
import { execute as timelineTargetGroupRegisterEventUseCase } from "./TimelineTargetGroupRegisterEventUseCase";
import { $TOOL_AERA_WIDTH } from "@/config/ToolConfig";
import { timelineGroup } from "@/timeline/domain/model/TimelineGroup";
import {
    $TIMELINE_TARGET_GROUP_ID,
    $TIMELINE_TOOL_HEIGHT_SIZE
} from "@/config/TimelineConfig";

/**
 * @description 選択したフレームのグループをアクティブにする
 *              Activate a group of selected frames
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (page_x: number, page_y: number): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_TARGET_GROUP_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // グループのサイズを設定する
    const timelineAreaState = workSpace.timelineAreaState;
    const frameRange = movieClip.selectedEndFrame - movieClip.selectedStartFrame;
    const width  = frameRange * (timelineAreaState.frameWidth + 1) - 5;
    const height = movieClip.selectedLayers.length * (timelineAreaState.frameHeight + 1) - 5;

    // 選択中のレイヤーの中で最も上にあるレイヤーを取得する
    let index = Number.MAX_VALUE;
    for (let idx = 0; idx < movieClip.selectedLayers.length; idx++) {
        const layer = movieClip.selectedLayers[idx];
        index = Math.min(index, movieClip.layers.indexOf(layer));
    }

    const layer = movieClip.layers[index];
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;
    if (!frameElement) {
        return ;
    }

    // indexから対象のレイヤーを取得する
    const frameIndex = movieClip.selectedStartFrame - $getLeftFrame();
    const selectedFrameElement: HTMLElement | undefined = frameElement.children[frameIndex] as HTMLElement;
    if (!selectedFrameElement) {
        return ;
    }

    // 移動情報を初期化
    timelineGroup.clear();
    timelineGroup.pageX = page_x;
    timelineGroup.pageY = page_y;

    // windowイベントを登録する
    timelineTargetGroupRegisterEventUseCase();

    // x座標
    const offsetTop = selectedFrameElement.offsetTop
        + $getTimelineOffsetTop()
        + $TIMELINE_TOOL_HEIGHT_SIZE;

    // y座標
    let offsetLeft = selectedFrameElement.offsetLeft;
    offsetLeft += timelineAreaState.state === "fixed"
        ? $TOOL_AERA_WIDTH + 2
        : timelineAreaState.offsetLeft + 1;

    // グループの座標とサイズを設定する
    let style = `width: ${width}px;`;
    style += `height: ${height}px;`;
    style += `left: ${offsetLeft}px;`;
    style += `top: ${offsetTop}px;`;
    element.setAttribute("style", style);
};