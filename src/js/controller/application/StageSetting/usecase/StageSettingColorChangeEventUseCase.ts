import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";

/**
 * @description ステージの背景色を変更
 *              Change the background color of the stage
 *
 * @param  {Event} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    // 親のイベントを止める
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 外部APIを起動
    const externalStage = new ExternalStage($getCurrentWorkSpace());

    // 背景色を変更
    externalStage.bgColor = element.value;
};