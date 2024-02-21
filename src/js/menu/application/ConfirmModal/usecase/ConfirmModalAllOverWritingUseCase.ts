import type { MenuImpl } from "@/interface/MenuImpl";
import type { ConfirmModal } from "@/menu/domain/model/ConfirmModal";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import { execute as confirmModalFileOverWritingUseCase } from "./ConfirmModalFileOverWritingUseCase";

/**
 * @description 全ての重複アイテムを上書きする
 *              Overwrite all duplicate items
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

    switch (true) {

        // Fileを全て上書く
        case menu.fileObject !== null:
            while (menu.fileObject !== null) {

                // 上書きを実行
                await confirmModalFileOverWritingUseCase(
                    menu.fileObject.file,
                    menu.fileObject.path
                );

                // 次のオブジェクトに移動
                menu.setupFileObject();
            }
            break;

        default:
            break;
    }
};