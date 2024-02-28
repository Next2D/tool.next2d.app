import type { MenuImpl } from "@/interface/MenuImpl";
import type { ConfirmModal } from "@/menu/domain/model/ConfirmModal";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import { $CONFIRM_MODAL_FILE_NAME_ID } from "@/config/ConfirmModalConfig";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as detailModalCustomFadeInUseCase } from "@/menu/application/DetailModal/usecase/DetailModalCustomFadeInUseCase";
import { execute as confirmModalFileOverWritingUseCase } from "./ConfirmModalFileOverWritingUseCase";
import { $ERROR_EMPTY_FILE_NAME_TEXT } from "@/config/ErrorTextConfig";

/**
 * @description 単体のアイテムの重複を上書きする
 *              Override duplicates of single items
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const menu: MenuImpl<ConfirmModal> = $getMenu($CONFIRM_MODAL_NAME);
    if (!menu) {
        return ;
    }

    const inputElement: HTMLInputElement | null = document
        .getElementById($CONFIRM_MODAL_FILE_NAME_ID) as HTMLInputElement;

    if (!inputElement) {
        return ;
    }

    // 名前が空の時はエラーテキストを表示
    if (!inputElement.value) {

        const element: HTMLElement | null = document
            .getElementById($CONFIRM_MODAL_NAME);

        if (!element) {
            return ;
        }

        const modalElement = element.firstElementChild as NonNullable<HTMLElement>;

        const offsetX = modalElement.offsetLeft - modalElement.clientWidth / 2;
        const offsetY = modalElement.offsetTop  - modalElement.clientHeight / 2;

        detailModalCustomFadeInUseCase(
            $ERROR_EMPTY_FILE_NAME_TEXT,
            offsetX + inputElement.offsetLeft + 25,
            offsetY + inputElement.offsetTop - inputElement.clientHeight + 5
        );

        return ;
    }

    switch (true) {

        // 単体のFileを上書く
        case menu.fileObject !== null:
            {
                const file = menu.fileObject.file;
                const path = menu.fileObject.path;
                const names = file.name.split(".");
                names.pop();

                const name = names.join(".");
                if (inputElement.value === name) {
                    // 名前が一緒なら上書き
                    await confirmModalFileOverWritingUseCase(file, path);
                } else {
                    // 名前が異なる場合は通常の追加処理
                    const externalLibrary = new ExternalLibrary($getCurrentWorkSpace());
                    await externalLibrary
                        .importFile(file, inputElement.value, path);
                }

                // 次のオブジェクトに移動
                menu.setupFileObject();
            }
            break;

        default:
            break;
    }
};