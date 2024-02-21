import { execute } from "./InstanceUpdateNameCreateHistoryObjectService";
import { $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND } from "../../../../../config/HistoryConfig";

describe("InstanceUpdateNameCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 0, 1, "before name", "after name");
        expect(object.command).toBe($LIBRARY_UPDATE_INSTANCE_NAME_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(1);
        expect(object.messages[3]).toBe("before name");
        expect(object.messages[4]).toBe("after name");

        // 表示様の配列のチェック
        expect(object.args[0]).toBe("before name");
        expect(object.args[1]).toBe("after name");
    });
});