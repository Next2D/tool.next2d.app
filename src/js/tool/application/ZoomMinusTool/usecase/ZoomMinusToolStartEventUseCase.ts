import { execute as screenStageAreaAllDisplayObjectInactiveService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaAllDisplayObjectInactiveService";
/**
 * @description ズームアウトツールの起動イベント
 *              Zoom out tool startup event
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 配置された全てのDisplayObjectのイベント有効化
    screenStageAreaAllDisplayObjectInactiveService();
};