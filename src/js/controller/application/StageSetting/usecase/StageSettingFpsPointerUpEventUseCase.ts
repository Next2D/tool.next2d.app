import { EventType } from "@/tool/domain/event/EventType";
import { $setCursor } from "@/global/GlobalUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as stageSettingFpsWindowMouseMoveEventUseCase } from "./StageSettingFpsPointerMoveEventUseCase";
import {
    $getBeforeFps,
    $setBeforeFps
} from "../StagsSettingUtil";

/**
 * @description ステージのフレームレートの数値変更のマウスアップイベント
 *              Mouse up event for stage frame rate numerical changes
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 移動のイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        stageSettingFpsWindowMouseMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);

    const workSpace = $getCurrentWorkSpace();
    const stage = workSpace.stage;

    // 変更前の状態に戻す
    // fixed logic
    stage.fps = $getBeforeFps();

    // 変更前の値を初期化
    // fixed logic
    $setBeforeFps(0);

    // 外部APIを起動して幅を更新
    const externalStage = new ExternalStage(workSpace);
    await externalStage.setFps(parseInt(element.value));

    // input要素のフォーカス
    element.focus();
};