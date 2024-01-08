import { $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID } from "@/config/ControllerScriptAreaConfig";

/**
 * @description スクリプトエリアに表示されてるElementを全て削除して初期化
 *              Delete and initialize all Elements displayed in the Script Area.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element = document
        .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID);

    if (!element) {
        return;
    }

    // 表示リストを初期化
    const children = element.children;
    while (children.length) {
        children[0].remove();
    }
};