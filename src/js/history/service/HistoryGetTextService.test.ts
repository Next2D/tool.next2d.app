import { execute } from "./HistoryGetTextService";
import {
    $TIMELINE_TOOL_LAYER_ADD_COMMAD,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAD
} from "../../config/HistoryConfig";

describe("HistoryGetTextServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute($TIMELINE_TOOL_LAYER_ADD_COMMAD)).toBe("レイヤーを追加");
        expect(execute($TIMELINE_TOOL_LAYER_DELETE_COMMAD)).toBe("レイヤーを削除");
    });
});