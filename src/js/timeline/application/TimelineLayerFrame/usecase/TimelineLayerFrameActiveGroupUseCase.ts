import { $TIMELINE_TARGET_GROUP_ID, $TIMELINE_TOOL_HEIGHT_SIZE } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "../../TimelineUtil";
import { $getTimelineOffsetTop } from "../../TimelineArea/TimelineAreaUtil";
import { execute as timelineLayerFrameGroupRegisterEventUseCase } from "./TimelineLayerFrameGroupRegisterEventUseCase";
import { $TOOL_AERA_WIDTH } from "@/config/ToolConfig";

/**
 * @description 選択したフレームのグループをアクティブにする
 *              Activate a group of selected frames
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_TARGET_GROUP_ID);

    if (!element) {
        return ;
    }

    // windowイベントを登録する
    timelineLayerFrameGroupRegisterEventUseCase();

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