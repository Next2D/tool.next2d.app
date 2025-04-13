import { $STAGE_WIDTH_ID } from "@/config/StageSettingConfig";
import { stageSetting } from "@/controller/domain/model/StageSetting";
import { $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as stageStyleUpdateSizeService } from "@/core/application/Stage/service/StageStyleUpdateSizeService";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";
import { execute as screenScrollResizeService } from "@/screen/application/ScreenScroll/service/ScreenScrollResizeService";

/**
 * @description タイマーID
 *              Timer ID
 *
 * @member {number}
 * @default -1
 * @private
 */
let $timerId: number = -1;

/**
 * @description ステージ高さの値操作のマウスムーブイベント
 *              Mouse move event for value operation of stage height
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
    $setCursor("ew-resize");

    if (!event.movementX) {
        return ;
    }

    cancelAnimationFrame($timerId);
    $timerId = requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        const stage = $getCurrentWorkSpace().stage;

        const currentValue = parseInt(element.value);

        const value = Math.max(1, Math.min(
            currentValue + event.movementX,
            Number.MAX_VALUE
        ));

        if (value !== currentValue) {
            element.value = `${value}`;
            stage.height  = value;
        }

        // ロック時は高さも更新
        if (stageSetting.lock) {
            const element: HTMLInputElement | null = document
                .getElementById($STAGE_WIDTH_ID) as HTMLInputElement;

            if (!element) {
                return ;
            }

            const currentValue = parseInt(element.value);

            const value = Math.max(1, Math.min(
                currentValue + event.movementX,
                Number.MAX_VALUE
            ));

            if (value !== currentValue) {
                element.value = `${value}`;
                stage.width   = value;
            }
        }

        // ステージのスタイルを変更
        stageStyleUpdateSizeService(stageSetting.lock ? stage.width : 0, stage.height);

        // ステージ背後のレイヤーを更新
        screenStageAreaUpdateSizeService(stage);

        // スクリーンのスクロールバーのサイズを更新
        screenScrollResizeService();
    });
};