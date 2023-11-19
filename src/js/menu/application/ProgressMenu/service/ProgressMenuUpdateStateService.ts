import { $PROGRESS_BAR_ID } from "@/config/ProgressMenuConfig";

/**
 * @description タスク進行管理のパーセント値を更新
 *              Update percentage values for task progress control
 *
 * @params {number} state
 * @return {void}
 * @method
 * @public
 */
export const execute = (state: number): void =>
{
    const element: HTMLProgressElement | null = document
        .getElementById($PROGRESS_BAR_ID) as HTMLProgressElement;

    if (!element) {
        return ;
    }

    element.value = state;
};