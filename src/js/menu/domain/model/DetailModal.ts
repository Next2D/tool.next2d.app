import { $DETAIL_MODAL_NAME } from "../../../config/MenuConfig";
import { EventType } from "../../../tool/domain/event/EventType";
import { BaseMenu } from "./BaseMenu";
import { execute as detailModalFadeInUseCase } from "../../application/DetailModal/usecase/DetailModalFadeInUseCase";
import { execute as detailModalFadeOutUseCase } from "../../application/DetailModal/usecase/DetailModalFadeOutUseCase";

/**
 * @description 説明モーダルの管理クラス
 *              Description Modal management class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class DetailModal extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($DETAIL_MODAL_NAME);
    }

    /**
     * @description メニュー位置を補正
     *              Correct menu position
     *
     * @return {HTMLElement}
     * @method
     * @public
     */
    move (element: HTMLElement): HTMLElement
    {
        element.style.left = `${this.offsetLeft}px`;
        element.style.top  = `${this.offsetTop}px`;
        return element;
    }

    /**
     * @description 指定Elementのタグ内にあるdataset.detailがあればイベントを登録
     *              Register an event if dataset.detail is in the tag of the specified Element
     *
     * @params  {HTMLElement} element
     * @returns {void}
     * @method
     * @public
     */
    registerFadeEvent (element: HTMLElement | Document): void
    {
        const elements = element
            .querySelectorAll("[data-detail]");

        const length: number = elements.length;
        for (let idx: number = 0; idx < length; ++idx) {

            const element: HTMLElement = elements[idx] as HTMLElement;

            element.addEventListener(EventType.MOUSE_OVER, detailModalFadeInUseCase);
            element.addEventListener(EventType.MOUSE_OUT,  detailModalFadeOutUseCase);
        }
    }
}