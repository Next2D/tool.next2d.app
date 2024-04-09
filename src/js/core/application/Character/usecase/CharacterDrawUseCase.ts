import type { Character } from "@/core/domain/model/Character";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { $BITMAP_TYPE } from "@/config/InstanceConfig";

/**
 * @description DisplayObjectを描画
 *              Draw DisplayObject
 *
 * @param  {Character} character
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (character: Character): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const instance  = workSpace.getLibrary(character.libraryId);
    if (!instance) {
        return ;
    }

    switch (instance.type) {

        case $BITMAP_TYPE:
            break;

    }

    const { BitmapData } = next2d.display;
    const bitmapData = new BitmapData(instance.width, instance.height);
    console.log(bitmapData);
};