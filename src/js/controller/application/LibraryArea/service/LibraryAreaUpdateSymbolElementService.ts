import type { Instance } from "@/core/domain/model/Instance";
import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description シンボルのElementのテキスト情報を更新
 *              Update text information in the symbol's Element
 *
 * @param  {Instance} instance
 * @return {void}
 * @method
 * @public
 */
export const execute = (instance: InstanceImpl<Instance>): void =>
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