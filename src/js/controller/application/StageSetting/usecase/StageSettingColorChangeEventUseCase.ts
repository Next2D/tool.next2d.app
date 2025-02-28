import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";

/**
 * @description ステージの背景色を変更
 *              Change the background color of the stage
 *
 * @param  {Event} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: Event): Promise<void> =>
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
    await externalStage.setBgColor(element.value);
};