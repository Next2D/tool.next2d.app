import { execute } from "./HistoryGetTextService";
import {
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND
} from "../../config/HistoryConfig";

describe("HistoryGetTextServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute($TIMELINE_TOOL_LAYER_ADD_COMMAND)).toBe("レイヤーを追加");
        expect(execute($TIMELINE_TOOL_LAYER_DELETE_COMMAND)).toBe("レイヤーを削除");
    });
});