import { EventType } from "@/tool/domain/event/EventType";
import { $setCursor } from "@/global/GlobalUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { stageSetting } from "@/controller/domain/model/StageSetting";
import { execute as stageSettingWidthWindowMouseMoveEventUseCase } from "./StageSettingWidthWindowMouseMoveEventUseCase";
import {
    $STAGE_HEIGHT_ID,
    $STAGE_WIDTH_ID
} from "@/config/StageSettingConfig";
import {
    $getBeforeHeight,
    $getBeforeWidth,
    $setBeforeHeight,
    $setBeforeWidth
} from "../StagsSettingUtil";

/**
 * @description ステージ幅の数値変更のマウスアップイベント
 *              Mouse up event for stage width numerical changes
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("auto");

    // windowのイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        stageSettingWidthWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);

    const workSpace = $getCurrentWorkSpace();
    const stage = workSpace.stage;

    // 変更前の状態に戻す
    stage.width = $getBeforeWidth();

    // 変更前の値を初期化
    $setBeforeWidth(0);

    const element: HTMLInputElement | null = document
        .getElementById($STAGE_WIDTH_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    // 外部APIを起動して幅を更新
    const externalStage = new ExternalStage(workSpace);
    externalStage.width = parseInt(element.value);

    if (stageSetting.lock) {

        // 変更前の状態に戻す
        stage.height = $getBeforeHeight();

        // 変更前の値を初期化
        $setBeforeHeight(0);

        const element: HTMLInputElement | null = document
            .getElementById($STAGE_HEIGHT_ID) as HTMLInputElement;

        if (!element) {
            return ;
        }

        externalStage.height = parseInt(element.value);
    }

    // input要素のフォーカス
    element.focus();
};