import type { TimelineHeader } from "../domain/model/TimelineHeader";
import type { TimelineFrame } from "../domain/model/TimelineFrame";
import type { TimelineLayer } from "../domain/model/TimelineLayer";
import { execute as timelineAreaInitializeRegisterEventUseCase } from "../application/TimelineArea/usecase/TimelineAreaInitializeRegisterEventUseCase";
import { execute as timelineAdjustmentInitializeRegisterEventUseCase } from "../application/TimelineAdjustment/usecase/TimelineAdjustmentInitializeRegisterEventUseCase";
import { execute as timelineScrollXRegisterEventUseCase } from "../application/TimelineScroll/usecase/TimelineScrollXRegisterEventUseCase";
import { execute as timelineToolInitializeRegisterEventUseCase } from "@/timeline/application/TimelineTool/usecase/TimelineToolInitializeRegisterEventUseCase";
import {
    timelineHeader,
    timelineFrame,
    timelineLayer
} from "./TimelineUtil";

/**
 * @description 起動対象のToolクラスの配列
 *              Array of Tool classes to be invoked
 *
 * @private
 */
const models: Array<TimelineHeader | TimelineFrame | TimelineLayer> = [
    timelineHeader,
    timelineFrame,
    timelineLayer
];

/**
 * @description タイムラインの初期起動関数
 *              Initial startup function for timeline
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // 起動
    const promises: Promise<void>[] = [];
    for (let idx: number = 0; idx < models.length; ++idx) {
        promises.push(models[idx].initialize());
    }

    await Promise.all(promises);

    // タイムラインエリアの初期イベントの登録
    timelineAreaInitializeRegisterEventUseCase();

    // タイムラインの各種ツールのイベント登録
    timelineToolInitializeRegisterEventUseCase();

    // タイムラインの幅と高さ調整のイベントを登録
    timelineAdjustmentInitializeRegisterEventUseCase();

    // タイムラインのx座標に移動するスクロールのイベント登録
    timelineScrollXRegisterEventUseCase();
};