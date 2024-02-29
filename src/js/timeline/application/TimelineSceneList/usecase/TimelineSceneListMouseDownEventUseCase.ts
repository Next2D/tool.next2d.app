import { execute as sceneListMenuShowService } from "@/menu/application/SceneListMenu/service/SceneListMenuShowService";

/**
 * @description
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // イベントを中止
    event.stopPropagation();

    // メニューを表示する
    sceneListMenuShowService();
};