import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as progressMenuHideService } from "@/menu/application/ProgressMenu/service/ProgressMenuHideService";
import { execute as progressMenuUpdateMessageService } from "@/menu/application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";
import { $removeWorkSpace } from "@/core/application/CoreUtil";
import { $replace } from "@/language/application/LanguageUtil";
import { $removeWorkSpaceCache } from "@/cache/CacheUtil";

/**
 * @description ワークスペースの削除処理のユースケース
 *              Workspace deletion process use case
 *
 * @params {WorkSpace} work_space
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (work_space: WorkSpace): Promise<void> =>
{
    const active = work_space.active;
    if (active) {

        // 停止処理を実行
        await work_space.stop();

        // 進行状況のテキストを更新
        progressMenuUpdateMessageService($replace("{{プロジェクトを閉じる}}"));
    }

    // キャッシュを削除
    $removeWorkSpaceCache(work_space.id);

    // タブを削除
    work_space.screenTab.remove();

    // プロジェクトを終了
    await $removeWorkSpace(work_space, active);

    // 自動保存を予約
    await userDatabaseAutoSaveReservationUseCase();

    // 進行状況画面を非表示にする
    progressMenuHideService();
};