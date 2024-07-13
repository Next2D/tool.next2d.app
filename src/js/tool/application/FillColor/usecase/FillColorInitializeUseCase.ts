import { $TOOL_FILL_COLOR_ID } from "@/config/ToolConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as fillColorChangeEventUseCase } from "./FillColorChangeEventUseCase";
import { execute as userFillColorGetService } from "@/user/application/Tool/service/UserFillColorGetService";
import { fillColor } from "@/tool/domain/model/FillColor";

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
        .getElementById($TOOL_FILL_COLOR_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    // ユーザーの塗りのカラー情報を取得
    fillColor.value = element.value = userFillColorGetService();

    // 塗りの変更イベントを登録
    element.addEventListener(EventType.CHANGE,
        fillColorChangeEventUseCase
    );
};