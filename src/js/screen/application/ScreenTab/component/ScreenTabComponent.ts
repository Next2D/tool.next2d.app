/**
 * @description タブのElementをstringで返却
 *              Return tab Element as string
 *
 * @params {number} id
 * @params {string} name
 * @return {string}
 * @method
 * @public
 */
export const execute = (id: number , name: string): string =>
{
    return `
<div draggable="true" id="tab-id-${id}" data-tab-id="${id}" class="tab disable">
    <p id="tab-text-id-${id}" data-tab-id="${id}" data-detail="{{タブの移動・名前を変更}}" data-shortcut-key="ArrowLeftCtrl" data-shortcut-text="Ctrl + ◀︎ or ▶" data-area="global">${name}</p>
    <i id="tab-delete-id-${id}" data-tab-id="${id}" data-detail="{{プロジェクトを閉じる}}"></i>
</div>
`;
};