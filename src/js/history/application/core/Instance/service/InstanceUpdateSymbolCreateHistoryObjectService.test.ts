import { execute } from "./InstanceUpdateSymbolCreateHistoryObjectService";
import { $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND } from "../../../../../config/HistoryConfig";

describe("InstanceUpdateSymbolCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 0, 1, "before name", "after name");
        expect(object.command).toBe($LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.args[0]).toBe(1);
        expect(object.args[1]).toBe(0);
        expect(object.args[2]).toBe(1);
        expect(object.args[3]).toBe("before name");
        expect(object.args[4]).toBe("after name");
    });
});