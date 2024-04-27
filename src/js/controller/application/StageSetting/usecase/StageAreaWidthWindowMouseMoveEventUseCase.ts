import { $STAGE_HEIGHT_ID, $STAGE_WIDTH_ID } from "@/config/StageSettingConfig";
import { stageSetting } from "@/controller/domain/model/StageSetting";
import { $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as stageChageStyleService  } from "@/core/application/Stage/service/StageChageStyleService";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";

/**
 * @description ステージエリアの値操作のマウスムーブイベント
 *              Mouse move event for value operation of stage area
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

    requestAnimationFrame((): void =>
    {
        const element: HTMLInputElement | null = document
            .getElementById($STAGE_WIDTH_ID) as HTMLInputElement;

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
            stage.width   = value;
        }

        // ロック時は高さも更新
        if (stageSetting.lock) {
            const element: HTMLInputElement | null = document
                .getElementById($STAGE_HEIGHT_ID) as HTMLInputElement;

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
                stage.height  = value;
            }
        }

        // ステージのスタイルを変更
        stageChageStyleService(stage);

        // ステージ背後のレイヤーを更新
        screenStageAreaUpdateSizeService(stage);
    });
};