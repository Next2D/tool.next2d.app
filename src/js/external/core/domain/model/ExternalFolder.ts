import { ExternalItem } from "./ExternalItem";
import { execute as libraryAreaUpdateFolderStateService } from "@/controller/application/LibraryArea/service/LibraryAreaUpdateFolderStateService";
import { $useSocket } from "@/share/ShareUtil";
import { execute as externalFolderStateCreateHistoryObjectServic } from "@/external/core/application/ExternalFolder/service/ExternalFolderStateCreateHistoryObjectServic";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as externalFolderCheckDuplicateService } from "@/external/core/application/ExternalFolder/service/ExternalFolderCheckDuplicateService";

/**
 * @extends {ExternalItem}
 * @class
 * @public
 */
export class ExternalFolder extends ExternalItem
{
    /**
     * @description フォルダを開けて、一覧を表示
     *              Open a folder and view the list
     *
     * @param  {boolean} [receiver = false]
     * @return {void}
     * @method
     * @public
     */
    open (receiver: boolean = false): void
    {
        this._$instance.mode = "open";

        // 起動中のプロジェクトなら表示を更新
        if (this._$workSpace.active) {
            // フォルダの表示を更新
            libraryAreaUpdateFolderStateService(this._$instance);

            // ライブラリを再描画
            libraryAreaReloadUseCase();
        }

        // 画面共有
        if (!receiver && $useSocket()) {
            const historyObject = externalFolderStateCreateHistoryObjectServic(
                this._$workSpace.id,
                this._$instance.id,
                "open"
            );
            shareSendService(historyObject);
        }
    }

    /**
     * @description フォルダを閉じて、一覧を非表示に
     *              Close the folder and hide the list
     *
     * @param  {boolean} [receiver = false]
     * @return {void}
     * @method
     * @public
     */
    close (receiver: boolean = false): void
    {
        this._$instance.mode = "close";

        // 起動中のプロジェクトなら表示を更新
        if (this._$workSpace.active) {
            // フォルダの表示を更新
            libraryAreaUpdateFolderStateService(this._$instance);

            // ライブラリを再描画
            libraryAreaReloadUseCase();
        }

        // 画面共有
        if (!receiver && $useSocket()) {
            const historyObject = externalFolderStateCreateHistoryObjectServic(
                this._$workSpace.id,
                this._$instance.id,
                "close"
            );
            shareSendService(historyObject);
        }
    }

    /**
     * @description 移動先のフォルダーが自分の親フォルダーかチェック
     *              Check if the destination folder is your parent folder
     *
     * @param  {number} parent_folder_id
     * @return {boolean}
     * @method
     * @public
     */
    checkDuplicate (parent_folder_id: number): boolean
    {
        return externalFolderCheckDuplicateService(
            this._$workSpace,
            this._$instance,
            parent_folder_id
        );
    }
}