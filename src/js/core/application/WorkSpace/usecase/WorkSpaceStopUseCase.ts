import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as progressMenuShowService } from "@/menu/application/ProgressMenu/service/ProgressMenuShowService";
import { execute as progressMenuUpdateMessageService } from "@/menu/application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { $replace } from "@/language/application/LanguageUtil";

/**
 * @description プロジェクトのを停止して、初期化
 *              Stop and initialize the project
 *
 * @params {WorkSpace} work_space
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace): Promise<void> =>
{
    return new Promise((reslove): void =>
    {
        // 進行状況画面を表示
        progressMenuShowService();

        // 進行状況のテキストを更新
        progressMenuUpdateMessageService($replace("Stop..."));

        // タブを非アクティブに更新
        work_space.screenTab.disable();

        // 終了
        reslove();
    });
};