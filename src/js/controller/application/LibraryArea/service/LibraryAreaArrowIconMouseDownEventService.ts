/**
 * @description フォルダーのアローアイコンを操作
 *              Manipulate the folder's Arrow icon
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const libraryId = parseInt(element.dataset.libraryId as string);
    console.log(libraryId);
};