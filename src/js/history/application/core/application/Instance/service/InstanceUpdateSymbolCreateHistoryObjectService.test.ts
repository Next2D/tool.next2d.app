import { execute } from "./InstanceUpdateSymbolCreateHistoryObjectService";
import { $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND } from "../../../../../../config/HistoryConfig";

describe("InstanceUpdateSymbolCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 0, 1, "before name", "after name");
        expect(object.command).toBe($LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(1);
        expect(object.messages[3]).toBe("before name");
        expect(object.messages[4]).toBe("after name");

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe("after name");
    });
});