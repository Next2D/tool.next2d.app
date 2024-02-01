import { $TIMELINE_HEADER_ID } from "@/config/TimelineConfig";
import { execute as timelineHeaderFrameComponent } from "../component/TimelineHeaderFrameComponent";
import { execute as timelineHeaderFrameRegisterEventUseCase } from "./TimelineHeaderFrameRegisterEventUseCase";
import { $getLeftFrame } from "../../TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $STAGE_FPS_ID } from "@/config/StageSettingConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderUpdateDisplayElementService } from "../service/TimelineHeaderUpdateDisplayElementService";
import { execute as timelineHeaderUpdateLabelElementService } from "../service/TimelineHeaderUpdateLabelElementService";
import { execute as timelineHeaderUpdateScriptElementService } from "../service/TimelineHeaderUpdateScriptElementService";
import { execute as timelineHeaderUpdateSoundElementService } from "../service/TimelineHeaderUpdateSoundElementService";
import { execute as timelineHeaderUpdateFrameElementService } from "../service/TimelineHeaderUpdateFrameElementService";

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

    const workSpace = $getCurrentWorkSpace();
    const frameWidth = workSpace.timelineAreaState.frameWidth + 1;

    const elementCount: number = Math.ceil(timelineHeader.clientWidth / frameWidth);

    // Elementがなければ初期登録
    if (!element.children.length) {
        const lastFrame: number = elementCount + 1;
        for (let frame: number = 1; lastFrame >= frame; ++frame) {

            // フレームのタグを追加
            element.insertAdjacentHTML("beforeend", timelineHeaderFrameComponent(frame));

            const node: HTMLElement | null = element.lastElementChild as HTMLElement;
            if (!node) {
                continue;
            }

            // フレームのタグにイベントを登録
            timelineHeaderFrameRegisterEventUseCase(node);

            timelineHeader.elements.push(node);
        }
    }

    // 画面幅以上にelement数があれば削除
    if (element.children.length + 1 > elementCount) {
        const index = elementCount + 1;
        while (element.children.length > index) {
            const nodes = timelineHeader.elements.splice(index, 1);
            if (!nodes || !nodes.length) {
                break;
            }
            nodes[0].remove();
        }
    }

    // 画面幅のelement数が多ければ再登録
    if (elementCount > element.children.length) {

        const lastElement: HTMLElement | null = element.lastElementChild as HTMLElement;
        if (lastElement && lastElement.dataset.frame) {
            let frame: number = parseInt(lastElement.dataset.frame as string);

            const length: number = elementCount - element.children.length;
            for (let idx: number = 1; length >= idx; ++idx) {

                // elementを追加
                element.insertAdjacentHTML("beforeend",
                    timelineHeaderFrameComponent(frame++)
                );

                const node: HTMLElement | null = element.lastElementChild as HTMLElement;
                if (!node) {
                    continue;
                }

                // フレームのタグにイベントを登録
                timelineHeaderFrameRegisterEventUseCase(node);

                timelineHeader.elements.push(node);
            }
        }
    }

    const fpsElement: HTMLInputElement | null = document
        .getElementById($STAGE_FPS_ID) as HTMLInputElement;

    if (!fpsElement) {
        return ;
    }

    const fps: number   = parseInt(fpsElement.value);
    const frame: number = $getLeftFrame();

    const length: number = timelineHeader.elements.length;
    for (let idx: number = 0; length > idx; ++idx) {

        // 指定のフレーム番号をセット
        const currentFrame: number = frame + idx;

        // 対象のElementを更新
        const node: HTMLElement | undefined = timelineHeader.elements[idx] as HTMLElement;
        if (!node) {
            continue;
        }

        // 表示されてるフレームとズレていれば値を更新
        const nodeFrame: number = parseInt(node.dataset.frame as string);
        if (nodeFrame !== currentFrame) {
            node.setAttribute("data-frame", `${currentFrame}`);
        }

        // 表示Elementを更新
        timelineHeaderUpdateDisplayElementService(node, currentFrame, fps);

        // ラベルElementを更新
        timelineHeaderUpdateLabelElementService(node, currentFrame);

        // スクリプトElementを更新
        timelineHeaderUpdateScriptElementService(node, currentFrame);

        // サウンドElementを更新
        timelineHeaderUpdateSoundElementService(node, currentFrame);

        // フレーム数Elementを更新
        timelineHeaderUpdateFrameElementService(node, currentFrame);
    }
};