import { execute as screenStageAreaAllDisplayObjectInactiveService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaAllDisplayObjectInactiveService";
/**
 * @description ズームインツールの起動イベント
 *              Zoom in tool startup event
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