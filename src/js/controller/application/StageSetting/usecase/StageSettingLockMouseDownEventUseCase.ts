import { stageSetting } from "@/controller/domain/model/StageSetting";

/**
 * @description ステージエリアのロックボタンのマウスダウンイベントユースケース
 *              Mouse down event use case for the lock button of the stage area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // フラグの切り替え
    stageSetting.lock = !stageSetting.lock;

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const iconElement = element.firstElementChild as HTMLElement;
    iconElement.setAttribute("class", stageSetting.lock ? "active" : "disable");
};