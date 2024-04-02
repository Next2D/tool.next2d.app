import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $getLayerFromElement } from "../../TimelineUtil";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description 指定のフレームElementのStyleを更新
 *              Update the Style of the specified Frame Element
 *
 * @param  {WorkSpace} work_spcae
 * @param  {MovieClip} movie_clip
 * @param  {HTMLElement} element
 * @param  {number} left_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_spcae: WorkSpace,
    movie_clip: MovieClip,
    element: HTMLElement,
    left_frame: number
): void => {

    const layer = $getLayerFromElement(element);
    if (!layer) {
        return;
    }

    // 外部APIを起動
    const externalLayer = new ExternalLayer(work_spcae, movie_clip, layer);

    const startFrame = movie_clip.selectedStartFrame;
    const endFrame   = movie_clip.selectedEndFrame;

    const children: HTMLCollection = element.children;
    const length: number = children.length;
    for (let idx = 0; idx < length; ++idx) {

        const node: HTMLElement | undefined = children[idx] as HTMLElement;
        if (!node) {
            continue;
        }

        const frame = left_frame + idx;

        const classValues = [];
        classValues.push("frame");

        // 5フーレム毎のポインタークラスをセット
        if (frame % 5 === 0) {
            classValues.push("frame-pointer");
        }

        // アクティブフレームのクラスをセット
        if (externalLayer.isSelected()
            && startFrame > 0
            && frame >= startFrame
            && endFrame > frame
        ) {
            classValues.push("frame-active");
        }

        const emptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (emptyCharacter) {

            switch (true) {

                case emptyCharacter.startFrame === frame:
                    classValues.push("empty-key-frame");
                    if (emptyCharacter.endFrame - emptyCharacter.startFrame > 1) {
                        classValues.push("empty-key-frame-join");
                    }
                    break;

                case emptyCharacter.endFrame - 1 === frame:
                    classValues.push("empty-space-frame-end");
                    break;

                default:
                    classValues.push("empty-space-frame");
                    break;

            }

        }

        node.setAttribute("data-frame", `${frame}`);
        node.setAttribute("class", classValues.join(" "));
    }
};