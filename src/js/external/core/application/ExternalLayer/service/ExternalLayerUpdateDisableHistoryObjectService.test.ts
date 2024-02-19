import { execute } from "./ExternalLayerUpdateDisableHistoryObjectService";
import { $LAYER_DISABLE_UPDATE_COMMAND } from "../../../../../config/HistoryConfig";

describe("ExternalLayerUpdateDisableHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 0, 0, true);
        expect(object.command).toBe($LAYER_DISABLE_UPDATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(true);
    });
});