import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as libraryAreaAllClearElementService } from "../service/LibraryAreaAllClearElementService";
import { libraryArea } from "@/controller/domain/model/LibraryArea";

export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // 全てのメニューを非表示に更新
    $allHideMenu();

    // 選択表示のElementを初期化
    libraryAreaAllClearElementService();

    // 選択情報を初期化
    libraryArea.clear();
};