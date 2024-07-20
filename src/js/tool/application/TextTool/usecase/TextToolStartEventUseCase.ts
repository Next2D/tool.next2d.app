import { execute as screenStageAreaAllDisplayObjectInactiveService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaAllDisplayObjectInactiveService";

/**
 * @description テキストツールの起動イベント
 *              Text tool startup event
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 配置された全てのDisplayObjectのイベント無効化
    screenStageAreaAllDisplayObjectInactiveService();
};