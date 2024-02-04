import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description ライブラリアイテムのElementをstringで返却
 *              Return Element of library item as string
 *
 * @params {number} id
 * @params {number} name
 * @return {string}
 * @method
 * @public
 */
export const execute = (instance: InstanceImpl<any>): string =>
{
    return `
<div draggable="true" class="library-list-box-child" id="library-child-id-${instance.id}" data-library-id="${instance.id}">
    <div class="library-list-box-name">
        <i class="library-type-${instance.type === "folder" ? `arrow ${instance.mode}` : "space"}" id="arrow-${instance.id}" data-library-id="${instance.id}"></i>
        <i class="library-type-${instance.type}${instance.type === "folder" ? `-${instance.mode}` : ""}" id="${instance.type}-${instance.id}" data-library-id="${instance.id}"></i>
        <p><span id="library-name-${instance.id}" class="view-text" data-library-id="${instance.id}">${instance.name}</span></p>
    </div>
    <div class="library-list-box-symbol">
        <p><span id="library-symbol-name-${instance.id}" class="view-symbol-text" data-library-id="${instance.id}">${instance.symbol}</span></p>
    </div>
</div>`;
};