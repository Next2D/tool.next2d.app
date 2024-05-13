import { execute as screenStageAreaAllDisplayObjectActiveService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaAllDisplayObjectActiveService";

/**
 * @description 矢印ツールの起動イベント
 *              Arrow tool startup event
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 配置された全てのDisplayObjectのイベント有効化
    screenStageAreaAllDisplayObjectActiveService();
};