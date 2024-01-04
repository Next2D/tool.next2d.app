import { EventType } from "@/tool/domain/event/EventType";
import { execute as detailModalFadeInUseCase } from "../usecase/DetailModalFadeInUseCase";
import { execute as detailModalFadeOutUseCase } from "../usecase/DetailModalFadeOutUseCase";

/**
 * @description 指定Elementのタグ内にあるdataset.detailがあればイベントを登録
 *              Register an event if dataset.detail is in the tag of the specified Element
 *
 * @params {HTMLElement | Document} element
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (element: HTMLElement | Document): Promise<void> =>
{
    const elements = element
        .querySelectorAll("[data-detail]");

    const length: number = elements.length;
    for (let idx: number = 0; idx < length; ++idx) {

        const element: HTMLElement | undefined = elements[idx] as HTMLElement;
        if (!element) {
            continue;
        }

        element.addEventListener(EventType.MOUSE_OVER, detailModalFadeInUseCase);
        element.addEventListener(EventType.MOUSE_OUT,  detailModalFadeOutUseCase);
    }
};