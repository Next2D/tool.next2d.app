import type { TimelineHeader } from "../domain/model/TimelineHeader";
import type { TimelineFrame } from "../domain/model/TimelineFrame";
import {
    timelineHeader,
    timelineFrame
} from "./TimelineUtil";
import { execute as timelineAreaInitializeRegisterEventUseCase } from "../application/TimelineArea/usecase/TimelineAreaInitializeRegisterEventUseCase";
import { execute as timelineAreaInitializeSetActiveStateUseCase } from "../application/TimelineArea/usecase/TimelineAreaInitializeSetActiveStateUseCase";

/**
 * @description 起動対象のToolクラスの配列
 *              Array of Tool classes to be invoked
 *
 * @private
 */
const models: Array<TimelineHeader | TimelineFrame> = [
    timelineHeader,
    timelineFrame
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

    // 初期イベントの登録
    timelineAreaInitializeRegisterEventUseCase();

    // 初期起動時に保存データから移動状態を再構成
    timelineAreaInitializeSetActiveStateUseCase();
};