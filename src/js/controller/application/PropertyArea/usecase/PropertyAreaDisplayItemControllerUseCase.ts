import { execute as propertyAreaBlockShowService } from "../service/PropertyAreaBlockShowService";
import { execute as propertyAreaBlockHideService } from "../service/PropertyAreaBlockHideService";
import { $BITMAP_TYPE } from "@/config/InstanceConfig";
import { InstanceTypeImpl } from "@/interface/InstanceTypeImpl";

/**
 * @description プロパティエリアの表示項目を変更
 *              Change display items in property area
 *
 * @param  {string} type
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (type: InstanceTypeImpl | "" = ""): Promise<void> =>
{
    switch (type) {

        case $BITMAP_TYPE:
            propertyAreaBlockHideService([
                "stage-setting",
                "sound-setting",
                "ease-setting",
                "video-setting",
                "text-setting",
                "nine-slice-setting",
                "fill-color-setting",
                "loop-setting"
            ]);

            // 表示項目を更新
            propertyAreaBlockShowService([
                "instance-setting",
                "object-setting",
                "object-area",
                "transform-setting",
                "color-setting",
                "align-setting",
                "reference-setting",
                "blend-setting",
                "filter-setting"
            ]);
            break;

        // 何も選択してない状態
        default:

            propertyAreaBlockHideService([
                "object-area",
                "ruler-setting",
                "instance-setting",
                "fill-color-setting"
            ]);

            // 表示項目を更新
            propertyAreaBlockShowService([
                "stage-setting",
                "sound-setting",
                "object-setting",
                "color-setting",
                "blend-setting",
                "filter-setting"
            ]);
            break;

    }
};