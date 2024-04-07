import { Folder } from "@/core/domain/model/Folder";
import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description ライブラリアイテムのElementをstringで返却
 *              Return Element of library item as string
 *
 * @params {Instance} instance
 * @return {string}
 * @method
 * @public
 */
export const execute = (instance: InstanceImpl<any>): string =>
{
    return `
<div draggable="true" class="library-list-box-child" id="library-child-id-${instance.id}" data-library-id="${instance.id}">
    <div class="library-list-box-spacer" data-library-id="${instance.id}"></div>
    <div class="library-list-box-name" data-library-id="${instance.id}">
        <i class="library-type-${instance.type === Folder.type ? `arrow ${instance.mode}` : "space"}" data-library-id="${instance.id}"></i>
        <i class="library-type-${instance.type}${instance.type === Folder.type ? `-${instance.mode}` : ""}" data-library-id="${instance.id}"></i>
        <p><span class="view-text" data-library-id="${instance.id}">${instance.name}</span></p>
    </div>
    <div class="library-list-box-symbol" data-library-id="${instance.id}">
        <p><span class="view-symbol-text" data-library-id="${instance.id}">${instance.symbol}</span></p>
    </div>
</div>`;
};