import { $TOOL_STROKE_COLOR_ID } from "@/config/ToolConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as strokeColorChangeEventUseCase } from "./StrokeColorChangeEventUseCase";
import { execute as userStrokeColorGetService } from "@/user/application/Tool/service/UserStrokeColorGetService";
import { strokeColor } from "@/tool/domain/model/StrokeColor";

/**
 * @description 塗りInputの初期起動ユースケース
 *              Initial startup use case of Fill Input
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element = document
        .getElementById($TOOL_STROKE_COLOR_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    // ユーザーの塗りのカラー情報を取得
    strokeColor.value = element.value = userStrokeColorGetService();

    // 塗りの変更イベントを登録
    element.addEventListener(EventType.CHANGE,
        strokeColorChangeEventUseCase
    );
};