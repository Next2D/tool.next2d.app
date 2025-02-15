import { $createWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description 新規のプロジェクトを追加
 *              Add new project
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 全てのメニューを非表示に
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // プロジェクトを作成して、初期起動関数を実行
    $createWorkSpace().initialize();
};