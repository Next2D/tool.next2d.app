import type { Instance } from "@/core/domain/model/Instance";
import type { Folder } from "@/core/domain/model/Folder";
import { $FOLDER_TYPE } from "@/config/InstanceConfig";

/**
 * @description ライブラリアイテムのElementをstringで返却
 *              Return Element of library item as string
 *
 * @params {Instance} instance
 * @return {string}
 * @method
 * @public
 */
export const execute = <I extends Instance> (instance: I): string =>
{
    return `
<div class="library-list-box-child" id="library-child-id-${instance.id}" data-library-id="${instance.id}">
    <div class="library-list-box-spacer" data-library-id="${instance.id}"></div>
    <div class="library-list-box-name" data-library-id="${instance.id}">
        <i class="library-type-${instance.type === $FOLDER_TYPE ? `arrow ${(instance as unknown as Folder).mode}` : "space"}" data-library-id="${instance.id}"></i>
        <i class="library-type-${instance.type}${instance.type === $FOLDER_TYPE ? `-${(instance as unknown as Folder).mode}` : ""}" data-library-id="${instance.id}"></i>
        <p><span class="view-text" data-library-id="${instance.id}">${instance.name}</span></p>
    </div>
    <div class="library-list-box-symbol" data-library-id="${instance.id}">
        <p><span class="view-symbol-text" data-library-id="${instance.id}">${instance.symbol}</span></p>
    </div>
</div>
`;
};