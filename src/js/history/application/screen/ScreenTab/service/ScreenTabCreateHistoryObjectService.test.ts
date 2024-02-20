import { execute } from "./ScreenTabCreateHistoryObjectService";
import { $SCREEN_TAB_NAME_UPDATE_COMMAND } from "../../../../../config/HistoryConfig";

describe("ScreenTabCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, "before_name", "after_name");
        expect(object.command).toBe($SCREEN_TAB_NAME_UPDATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe("before_name");
        expect(object.messages[2]).toBe("after_name");

        expect(object.args[0]).toBe("before_name");
        expect(object.args[1]).toBe("after_name");
    });
});