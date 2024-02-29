import { execute as timelineAreaInitializeRegisterEventUseCase } from "../application/TimelineArea/usecase/TimelineAreaInitializeRegisterEventUseCase";
import { execute as timelineAdjustmentInitializeRegisterEventUseCase } from "../application/TimelineAdjustment/usecase/TimelineAdjustmentInitializeRegisterEventUseCase";
import { execute as timelineScrollXRegisterEventUseCase } from "../application/TimelineScroll/usecase/TimelineScrollXRegisterEventUseCase";
import { execute as timelineScrollYRegisterEventUseCase } from "../application/TimelineScroll/usecase/TimelineScrollYRegisterEventUseCase";
import { execute as timelineToolInitializeRegisterEventUseCase } from "@/timeline/application/TimelineTool/usecase/TimelineToolInitializeRegisterEventUseCase";
import { execute as timelineMarkerInitializeRegisterEventUseCase } from "@/timeline/application/TimelineMarker/usecase/TimelineMarkerInitializeRegisterEventUseCase";
import { execute as timelineSceneListInitializeRegisterEventUseCase } from "@/timeline/application/TimelineSceneList/usecase/TimelineSceneListInitializeRegisterEventUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { timelineMarker } from "@/timeline/domain/model/TimelineMarker";

/**
 * @description 初期起動対象の配列
 *              Array of initial startup targets
 *
 * @private
 */
const models: Array<any> = [
    timelineHeader,
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

    // タイムラインエリアの初期イベントの登録
    timelineAreaInitializeRegisterEventUseCase();

    // タイムラインの各種ツールのイベント登録
    timelineToolInitializeRegisterEventUseCase();

    // タイムラインの親のシーン名一覧ボタンのイベント登録
    timelineSceneListInitializeRegisterEventUseCase();

    // タイムラインの幅と高さ調整のイベントを登録
    timelineAdjustmentInitializeRegisterEventUseCase();

    // タイムラインのx座標に移動するスクロールのイベント登録
    timelineScrollXRegisterEventUseCase();

    // タイムラインのy座標に移動するスクロールのイベント登録
    timelineScrollYRegisterEventUseCase();

    // マーカーのイベントの登録
    timelineMarkerInitializeRegisterEventUseCase();
};