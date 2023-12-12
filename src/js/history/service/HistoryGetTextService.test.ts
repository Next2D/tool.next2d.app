import { execute } from "./HistoryGetTextService";
import { $TIMELINE_TOOL_LAYER_ADD_COMMAD } from "../../config/HistoryConfig";

describe("HistoryGetTextServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute($TIMELINE_TOOL_LAYER_ADD_COMMAD)).toBe("レイヤーを追加");
    });
});