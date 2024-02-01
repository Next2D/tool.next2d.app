import { execute as propertyAreaBlockShowService } from "../service/PropertyAreaBlockShowService";
import { execute as propertyAreaBlockHideService } from "../service/PropertyAreaBlockHideService";

/**
 * @description プロパティエリアの表示項目を変更
 *              Change display items in property area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // TODO 選択中のDisplayObjectを取得
    const todo: string = "";
    switch (todo) {

        case "shape":
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