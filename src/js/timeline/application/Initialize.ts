import type { TimelineHeader } from "../domain/model/TimelineHeader";
import type { TimelineFrame } from "../domain/model/TimelineFrame";
import type { TimelineMarker } from "../domain/model/TimelineMarker";
import type { TimelineLayer } from "../domain/model/TimelineLayer";
import { execute as timelineAreaInitializeRegisterEventUseCase } from "../application/TimelineArea/usecase/TimelineAreaInitializeRegisterEventUseCase";
import { execute as timelineAdjustmentInitializeRegisterEventUseCase } from "../application/TimelineAdjustment/usecase/TimelineAdjustmentInitializeRegisterEventUseCase";
import {
    timelineHeader,
    timelineFrame,
    timelineLayer,
    timelineMarker
} from "./TimelineUtil";

/**
 * @description 起動対象のToolクラスの配列
 *              Array of Tool classes to be invoked
 *
 * @private
 */
const models: Array<TimelineHeader | TimelineFrame | TimelineMarker | TimelineLayer> = [
    timelineHeader,
    timelineFrame,
    timelineLayer,
    timelineMarker
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

    // タイムラインの初期イベントの登録
    timelineAreaInitializeRegisterEventUseCase();

    // タイムラインの幅と高さ調整のイベントを登録
    timelineAdjustmentInitializeRegisterEventUseCase();
};