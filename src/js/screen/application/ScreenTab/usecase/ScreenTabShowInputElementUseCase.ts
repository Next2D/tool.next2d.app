import { execute as screenTabGetTextElementService } from "../service/ScreenTabGetTextElementService";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";
import { execute as screenTabActiveStyleService } from "../service/ScreenTabActiveStyleService";
import { $allHideMenu } from "../../../../menu/application/MenuUtil";
/**
 * @description 指定IDのElementを編集モードに変更する
 *              Changes the Element with the specified ID to edit mode.
 *
 * @params {number} id
 * @return {void}
 * @method
 * @public
 */
export const execute = (id: number): void =>
{
    const textElement: HTMLElement | null = screenTabGetTextElementService(id);
    if (!textElement) {
        return ;
    }

    const tabElement: HTMLElement | null = screenTabGetElementService(id);
    if (!tabElement) {
        return ;
    }

    // メニュー表示があれば全て非表示にする
    $allHideMenu();

    // 編集モードにstyleを更新
    screenTabActiveStyleService(textElement, tabElement);

    // focus
    textElement.focus();
};