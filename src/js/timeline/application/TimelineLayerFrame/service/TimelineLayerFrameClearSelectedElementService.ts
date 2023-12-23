import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 選択中のフレームElementを非アクティブに更新してマップデータを初期化
 *              Update selected frame Element to inactive and initialize map data
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const targetFrames = timelineLayer.targetFrames;
    for (const elements of targetFrames.values()) {
        for (let idx: number = 0; idx < elements.length; ++idx) {
            const element = elements[idx];
            element.classList.remove("frame-active");
        }
    }

    // 初期化
    targetFrames.clear();
};