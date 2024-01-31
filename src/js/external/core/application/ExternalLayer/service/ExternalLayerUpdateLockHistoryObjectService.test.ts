import { execute } from "./ExternalLayerUpdateLockHistoryObjectService";
import { $LAYER_LOCK_UPDATE_COMMAND } from "../../../../../config/HistoryConfig";

describe("ExternalLayerUpdateLockHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 0, 0, true);
        expect(object.command).toBe($LAYER_LOCK_UPDATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.args[0]).toBe(1);
        expect(object.args[1]).toBe(0);
        expect(object.args[2]).toBe(0);
        expect(object.args[3]).toBe(true);
    });
});