import { $createWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description 新規のプロジェクトを追加
 *              Add new project
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    event.stopPropagation();
    event.preventDefault();

    // 全てのメニューを非表示に
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // プロジェクトを作成して、初期起動関数を実行
    $createWorkSpace().initialize();

    // 自動保存予約
    await userDatabaseAutoSaveReservationUseCase();
};