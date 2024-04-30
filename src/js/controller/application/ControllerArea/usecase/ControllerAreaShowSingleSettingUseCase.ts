import { $BITMAP_TYPE } from "@/config/InstanceConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description スクリーンで選択したアイテム(単一)の設定を表示
 *              Display the settings for the item (single) selected on the screen
 *
 * @param  {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (library_id: number): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const instance  = workSpace.getLibrary(library_id);
    if (!instance) {
        return ;
    }

    switch (instance.type) {

        case $BITMAP_TYPE:
            break;

    }
};