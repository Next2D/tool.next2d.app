import { $PROGRESS_STATE_ID } from "@/config/ProgressMenuConfig";

/**
 * @description タスク進行管理のテキスト情報を更新
 *              Update text information for task progress management
 *
 * @params {string} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: string): void =>
{
    const element: HTMLElement | null = document
        .getElementById($PROGRESS_STATE_ID);

    if (!element) {
        return ;
    }

    element.textContent = `${message}`;
};