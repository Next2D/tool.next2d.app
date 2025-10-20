import { $createWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";
import { execute as workSpaceInitializeUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceInitializeUseCase";

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
    // 全てのメニューを非表示に
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // プロジェクトを作成して、初期起動関数を実行
    workSpaceInitializeUseCase($createWorkSpace());

    // 自動保存予約
    await userDatabaseAutoSaveReservationUseCase();
};