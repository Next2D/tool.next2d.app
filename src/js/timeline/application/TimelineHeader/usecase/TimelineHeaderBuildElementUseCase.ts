import { $TIMELINE_HEADER_ID } from "../../../../config/TimelineConfig";
import { execute as timelineHeaderFrameComponent } from "../component/TimelineHeaderFrameComponent";
import { execute as timelineHeaderFrameRegisterEventUseCase } from "./TimelineHeaderFrameRegisterEventUseCase";
import {
    $getLeftFrame,
    $getTimelineFrameWidth,
    timelineHeader
} from "../../TimelineUtil";
import { $STAGE_FPS_ID } from "../../../../config/StageSettingConfig";
import { $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import type { MovieClip } from "../../../../core/domain/model/MovieClip";

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

    // 画面幅以上にelement数があれば削除
    if (element.children.length + 1 > elementCount) {
        const index = elementCount + 1;
        while (element.children.length > index) {
            element.children[index].remove();
        }
    }

    // 画面幅のelement数が多ければ再登録
    if (elementCount > element.children.length) {

        const lastElement: HTMLElement | null = element.lastElementChild as HTMLElement;
        if (lastElement && lastElement.dataset.frame) {
            let frame: number = parseInt(lastElement.dataset.frame as string);

            const length: number = elementCount - element.children.length;
            for (let idx: number = 1; length >= idx; ++idx) {
                element.insertAdjacentHTML("beforeend", timelineHeaderFrameComponent(frame++));

                const node: HTMLElement | null = element.lastElementChild as HTMLElement;
                if (!node) {
                    continue;
                }

                // フレームのタグにイベントを登録
                timelineHeaderFrameRegisterEventUseCase(node);
            }
        }
    }

    const fpsElement: HTMLInputElement | null = document
        .getElementById($STAGE_FPS_ID) as HTMLInputElement;

    if (!fpsElement) {
        return ;
    }

    const workSpace: WorkSpace = $getCurrentWorkSpace();
    if (!workSpace) {
        return ;
    }

    const scene: MovieClip = workSpace.scene;

    const fps: number = parseInt(fpsElement.value);
    const frame: number = $getLeftFrame();
    let sec: number = Math.max(1, (frame / 24 | 0) + 1);

    const children: HTMLCollection = element.children;
    const length: number = children.length;
    for (let idx: number = 0; length > idx; ++idx) {

        // 指定のフレーム番号をセット
        const currentFrame: number = frame + idx;

        // 対象のElementを更新
        const node: HTMLElement | undefined = children[idx] as HTMLElement;
        if (!node) {
            continue;
        }

        // 表示されてるフレームとズレていれば値を更新
        const nodeFrame: number = parseInt(node.dataset.frame as string);
        if (nodeFrame !== currentFrame) {
            node.setAttribute("data-frame", `${currentFrame}`);
        }

        const nodeChildren: HTMLCollection = node.children;
        const length: number = nodeChildren.length;
        for (let idx: number = 0; length > idx; ++idx) {

            const node: HTMLElement | undefined = nodeChildren[idx] as HTMLElement;
            if (!node) {
                continue;
            }

            const nodeFrame: number = parseInt(node.dataset.frame as string);
            if (nodeFrame !== currentFrame) {
                node.setAttribute("data-frame", `${currentFrame}`);
            }

            switch (idx) {

                // display
                case 0:
                    if (currentFrame % 5 === 0) {
                        if (!node.classList.contains("frame-border-end")) {
                            node.setAttribute("class", "frame-border-end");
                        }
                    } else {
                        if (!node.classList.contains("frame-border")) {
                            node.setAttribute("class", "frame-border");
                        }
                    }

                    if (currentFrame % fps === 0 && fps > 4) {
                        const value: string = `${sec++}s`;
                        if (!node.textContent || node.textContent !== value) {
                            node.textContent = value;
                        }
                    } else {
                        if (node.textContent) {
                            node.textContent = "";
                        }
                    }
                    break;

                // label
                case 1:
                    if (scene.hasLabel(currentFrame)) {
                        if (!node.classList.contains("frame-border-box-marker")) {
                            node.setAttribute("class", "frame-border-box-marker");
                            node.textContent = scene.getLabel(currentFrame);
                        }
                    } else {
                        if (!node.classList.contains("frame-border-box")) {
                            node.setAttribute("class", "frame-border-box");
                            node.textContent = "";
                        }
                    }
                    break;

                // script
                case 2:
                    if (scene.hasAction(currentFrame)) {
                        if (!node.classList.contains("frame-border-box-action")) {
                            node.setAttribute("class", "frame-border-box-action");
                        }
                    } else {
                        if (!node.classList.contains("frame-border-box")) {
                            node.setAttribute("class", "frame-border-box");
                        }
                    }
                    break;

                // sound
                case 3:
                    if (scene.hasSound(currentFrame)) {
                        if (!node.classList.contains("frame-border-box-sound")) {
                            node.setAttribute("class", "frame-border-box-sound");
                        }
                    } else {
                        if (!node.classList.contains("frame-border-box")) {
                            node.setAttribute("class", "frame-border-box");
                        }
                    }
                    break;

                case 4:
                    if (currentFrame % 5 === 0) {
                        const value: string = `${currentFrame}`;
                        if (!node.textContent || node.textContent !== value) {
                            node.textContent = value;
                        }
                    } else {
                        if (node.textContent) {
                            node.textContent = "";
                        }
                    }
                    break;

                default:
                    break;

            }
        }

    }
};