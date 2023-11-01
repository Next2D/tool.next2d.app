import { $createWorkSpace } from "../../../../controller/core/application/CoreUtil";
import { $allHideMenu } from "../../../../menu/application/MenuUtil";

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

    // プロジェクトを作成して、初期起動関数を実行
    $createWorkSpace().initialize();
};