import type { Instance } from "@/core/domain/model/Instance";

/**
 * @description シンボルのElementのテキスト情報を更新
 *              Update text information in the symbol's Element
 *
 * @param  {Instance} instance
 * @return {void}
 * @method
 * @public
 */
export const execute = <I extends Instance> (instance: I): void =>
{
    const element: HTMLElement | null = document
        .getElementById(`library-child-id-${instance.id}`);

    if (!element) {
        return ;
    }

    const spans = element.getElementsByTagName("span");
    if (!spans || !spans.length) {
        return ;
    }

    const symbolElement = spans[1] as NonNullable<HTMLElement>;
    symbolElement.textContent = instance.symbol;
};