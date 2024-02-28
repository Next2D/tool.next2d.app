import type { ShareInitializeSendObjectImpl } from "@/interface/ShareInitializeSendObjectImpl";
import { execute as workSpaceRestoreSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceRestoreSaveDataService";
import { execute as userDatabaseSaveShowModalUseCase } from "@/user/application/Database/usecase/UserDatabaseSaveShowModalUseCase";
import { execute as progressMenuShowService } from "@/menu/application/ProgressMenu/service/ProgressMenuShowService";
import { execute as shareGetS3FileRepository } from "@/share/domain/repository/ShareGetS3FileRepository";
import { execute as shareGetS3EndPointRepository } from "@/share/domain/repository/ShareGetS3EndPointRepository";
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
    await userDatabaseSaveShowModalUseCase();

    // 全てのプロジェクトを停止
    await $removeAllWorkSpace();

    // オーナーのデータの受け取り
    const url = await shareGetS3EndPointRepository(message.fileId, "get");
    const binary = await shareGetS3FileRepository(url);

    // 受け取ったプロジェクトを起動
    await workSpaceRestoreSaveDataService(binary, true);

    const workSpaces = $getAllWorkSpace();
    for (let idx: number = 0; idx < workSpaces.length; ++idx) {
        const workSpace = workSpaces[idx];
        workSpace.initialize();
    }

    await $getCurrentWorkSpace().run();
};