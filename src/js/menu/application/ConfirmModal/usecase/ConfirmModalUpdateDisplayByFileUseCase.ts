import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as confirmModalFileToElementUseCase } from "./ConfirmModalFileToElementUseCase";
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
    confirmModalFileToElementUseCase(file)
        .then((element): void =>
        {
            if (!element) {
                return ;
            }

            element.classList.add("preview-center");
            afterPreviewElement.appendChild(element);
        });

    // 現在のinstanceをプレビューエリアに表示
    instance
        .getHTMLElement()
        .then((element: HTMLElement | null): void =>
        {
            if (!element) {
                return ;
            }

            element.classList.add("preview-center");
            beforePreviewElement.appendChild(element);
        });
};