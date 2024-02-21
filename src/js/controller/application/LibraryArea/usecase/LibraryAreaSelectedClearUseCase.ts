import { execute as libraryAreaAllClearElementService } from "../service/LibraryAreaAllClearElementService";
import { execute as libraryPreviewAreaClearDisplayService } from "@/controller/application/LibraryPreviewArea/service/LibraryPreviewAreaClearDisplayService";
import { libraryArea } from "@/controller/domain/model/LibraryArea";

/**
 * @description ライブラリエリアの選択状態を全て初期化
 *              Initialize all selection states in the library area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 選択表示のElementを初期化
    libraryAreaAllClearElementService();

    // プレビューエリアを初期化
    libraryPreviewAreaClearDisplayService();

    // 選択情報を初期化
    // fixed logic
    libraryArea.clear();
};