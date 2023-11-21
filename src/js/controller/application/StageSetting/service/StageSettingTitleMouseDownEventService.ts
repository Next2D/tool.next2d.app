import {
    $STAGE_SETTING_ID,
    $STAGE_SETTING_TITLE_ID
} from "@/config/StageSettingConfig";

/**
 * @description ステージ設定のタイトルタップの実行関数
 *              Execution function of the title tap in the stage setup
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const element: HTMLElement | null = document
        .getElementById($STAGE_SETTING_TITLE_ID);

    if (!element) {
        return ;
    }

    const targetElement: HTMLElement | null = document
        .getElementById(`${$STAGE_SETTING_ID}-view-area`);

    if (!targetElement) {
        return ;
    }

    const iconElement = element.children[0] as NonNullable<HTMLElement>;
    if (iconElement.classList.contains("active")) {
        // 表示を隠す
        iconElement.classList.remove("active");
        iconElement.classList.add("disable");
        targetElement.style.display = "none";
    } else {
        // 表示する
        iconElement.classList.remove("disable");
        iconElement.classList.add("active");
        targetElement.style.display = "";
    }
};