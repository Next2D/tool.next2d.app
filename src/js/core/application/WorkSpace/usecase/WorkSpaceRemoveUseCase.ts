import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as progressMenuShowService } from "@/menu/application/ProgressMenu/service/ProgressMenuShowService";
import { execute as progressMenuHideService } from "@/menu/application/ProgressMenu/service/ProgressMenuHideService";
import { execute as progressMenuUpdateMessageService } from "@/menu/application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { $removeWorkSpace } from "@/core/application/CoreUtil";
import { $replace } from "@/language/application/LanguageUtil";

/**
 * @description ワークスペースの削除処理のユースケース
 *              Workspace deletion process use case
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
        if (work_space.active) {
            // アクティブなプロジェクトならプログレバーを表示
            progressMenuShowService();

            // 進行状況のテキストを更新
            progressMenuUpdateMessageService($replace("{{プロジェクトを閉じる}}"));
        }

        // タブを削除
        work_space.screenTab.remove();

        // プロジェクトを終了
        $removeWorkSpace(work_space)
            .then((): void =>
            {
                // 進行状況画面を非表示にする
                progressMenuHideService();

                reslove();
            });
    });
};