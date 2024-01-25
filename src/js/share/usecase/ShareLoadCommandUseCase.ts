import type { ShareInitializeSendObjectImpl } from "@/interface/ShareInitializeSendObjectImpl";
import { execute as workSpaceRestoreSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceRestoreSaveDataService";
import { execute as userDatabaseSaveUseCase } from "@/user/application/Database/usecase/UserDatabaseSaveUseCase";
import { execute as progressMenuShowService } from "@/menu/application/ProgressMenu/service/ProgressMenuShowService";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $loadedInitializeData } from "../ShareUtil";
import {
    $getAllWorkSpace,
    $getCurrentWorkSpace,
    $removeAllWorkSpace
} from "@/core/application/CoreUtil";

/**
 * @description オーナーのプロジェクトデータを受け取って起動、既存のプロジェクトは保存して終了
 *              Receives owner's project data and launches, existing projects are saved and closed
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = async (message: ShareInitializeSendObjectImpl): Promise<void> =>
{
    // 初回のロードを完了したかの判定を更新
    $loadedInitializeData();

    // 全てのメニューを終了
    $allHideMenu();

    // 進行メニューを表示
    progressMenuShowService();

    // オーナーのIDに合わせる
    WorkSpace.workSpaceId = message.workSpaceId;

    // 現在のプロジェクトデータを保存
    await userDatabaseSaveUseCase();

    // 全てのプロジェクトを停止
    await $removeAllWorkSpace();

    // 受け取ったプロジェクトを起動
    await workSpaceRestoreSaveDataService(message.data, true);

    const workSpaces = $getAllWorkSpace();
    for (let idx: number = 0; idx < workSpaces.length; ++idx) {
        const workSpace = workSpaces[idx];
        workSpace.initialize();
    }

    await $getCurrentWorkSpace().run();
};