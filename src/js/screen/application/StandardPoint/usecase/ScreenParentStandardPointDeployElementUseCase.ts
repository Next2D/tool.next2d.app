import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { execute as screenParentStandardPointHideElementService } from "../service/ScreenParentStandardPointHideElementService";
import { execute as screenParentStandardPointShowElementService } from "../service/ScreenParentStandardPointShowElementService";
import { $setParentStandardPointState } from "../StandardPointUtil";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description MovieClipの標準点Elementを配置
 *              Place the standard point Element of the MovieClip
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const length = timelineSceneList.parents.length;

    // 親のMovieClipがない場合は非表示にして終了
    if (!length) {
        screenParentStandardPointHideElementService();
        return ;
    }

    // 先祖からのmatrixを加算
    const matrix = $getConcatenatedMatrix();

    // 基準点が0,0なら非表示にして終了
    if (matrix[4] === 0 && matrix[5] === 0) {
        screenParentStandardPointHideElementService();
        return ;
    }

    // 後続で表示処理を行うので、基準点のElement状態を非表示に更新
    $setParentStandardPointState("hide");

    // 基準点のElementの表示処理
    screenParentStandardPointShowElementService(
        $getScreenOffsetLeft() + Math.ceil(matrix[4]),
        $getScreenOffsetTop() + Math.ceil(matrix[5])
    );
};