import { $allHideMenu } from "../../MenuUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description ヘッダーメニューのスクリプト追加ボタンの実行関数
 *              Execution function of the Add Script button in the header menu
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // メニューを非表示に更新
    $allHideMenu();

    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const workSpace = $getCurrentWorkSpace();

    // 外部APIを起動
    const externalLibrary = new ExternalLibrary(workSpace);
    externalLibrary.addNewFolder(`Folder_${workSpace.nextLibraryId}`);
};