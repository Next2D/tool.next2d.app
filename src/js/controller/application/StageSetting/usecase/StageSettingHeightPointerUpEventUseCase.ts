import { EventType } from "@/tool/domain/event/EventType";
import { $setCursor } from "@/global/GlobalUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { stageSetting } from "@/controller/domain/model/StageSetting";
import { execute as stageSettingHeightPointerMoveEventUseCase } from "./StageSettingHeightPointerMoveEventUseCase";
import { $STAGE_WIDTH_ID } from "@/config/StageSettingConfig";
import {
    $getBeforeHeight,
    $getBeforeWidth,
    $setBeforeHeight,
    $setBeforeWidth
} from "../StagsSettingUtil";

/**
 * @description ステージの高さの数値変更のマウスアップイベント
 *              Mouse up event for stage height numerical changes
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // カーソルを変更
    $setCursor("auto");

    // イベントの伝播を止める
    event.stopPropagation();

    // 移動のイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        stageSettingHeightPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);

    const workSpace = $getCurrentWorkSpace();
    const stage = workSpace.stage;

    // 変更前の状態に戻す
    stage.height = $getBeforeHeight();

    // 変更前の値を初期化
    $setBeforeHeight(0);

    // 外部APIを起動して幅を更新
    const externalStage  = new ExternalStage(workSpace);
    await externalStage.setHeight(parseInt(element.value));

    if (stageSetting.lock) {

        // 変更前の状態に戻す
        stage.width = $getBeforeWidth();

        // 変更前の値を初期化
        $setBeforeWidth(0);

        const element: HTMLInputElement | null = document
            .getElementById($STAGE_WIDTH_ID) as HTMLInputElement;

        if (!element) {
            return ;
        }

        await externalStage.setWidth(parseInt(element.value));
    }

    // input要素のフォーカス
    element.focus();
};