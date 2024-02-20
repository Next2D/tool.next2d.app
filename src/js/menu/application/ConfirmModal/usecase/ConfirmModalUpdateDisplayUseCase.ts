import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as confirmModalFileToElementService } from "../service/ConfirmModalFileToElementService";
import { $poolCanvas } from "@/global/GlobalUtil";
import {
    $CONFIRM_MODAL_AFTER_PREVIEW_ID,
    $CONFIRM_MODAL_BEFORE_PREVIEW_ID,
    $CONFIRM_MODAL_FILE_NAME_ID
} from "@/config/ConfirmModalConfig";

/**
 * @description 確認モーダルの表示を更新
 *              Updated display of confirmation modal
 *
 * @param  {File} file
 * @param  {Instance} instance
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    file: File,
    instance: InstanceImpl<any>
): void => {

    const nameElement: HTMLInputElement | null = document
        .getElementById($CONFIRM_MODAL_FILE_NAME_ID) as HTMLInputElement;

    if (!nameElement) {
        return ;
    }

    const beforePreviewElement: HTMLInputElement | null = document
        .getElementById($CONFIRM_MODAL_BEFORE_PREVIEW_ID) as HTMLInputElement;

    if (!beforePreviewElement) {
        return ;
    }

    const afterPreviewElement: HTMLInputElement | null = document
        .getElementById($CONFIRM_MODAL_AFTER_PREVIEW_ID) as HTMLInputElement;

    if (!afterPreviewElement) {
        return ;
    }

    // 名前をセット
    nameElement.value = instance.name;
    nameElement.focus();

    // 表示をリセット
    while (beforePreviewElement.firstElementChild) {
        const element = beforePreviewElement.firstElementChild;
        if (element instanceof HTMLCanvasElement) {
            $poolCanvas(element);
        }
        element.remove();
    }
    while (afterPreviewElement.firstElementChild) {
        const element = afterPreviewElement.firstElementChild;
        if (element instanceof HTMLCanvasElement) {
            $poolCanvas(element);
        }
        element.remove();
    }

    // 読み込むFileをプレビューエリアに表示
    confirmModalFileToElementService(file)
        .then((element): void =>
        {
            if (!element) {
                return ;
            }
            beforePreviewElement.appendChild(element);
        });

    // 現在のinstanceをプレビューエリアに表示
    instance
        .getHTMLElement()
        .then((element: any): void =>
        {
            afterPreviewElement
                .appendChild(element as NonNullable<HTMLElement>);
        });
};