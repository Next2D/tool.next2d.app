import { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";
import { execute as userShortcutObjectGetService } from "./UserShortcutObjectGetService";
import { execute as userShortcutObjectUpdateService } from "./UserShortcutObjectUpdateService";
import { execute } from "./UserShortcutObjectRemoveService";

describe("UserShortcutObjectGetServiceTest", () =>
{
    test("execute test", () =>
    {
        let object: ShortcutViewObjectImpl[] | null = userShortcutObjectGetService();
        expect(object).toBe(null);

        userShortcutObjectUpdateService([
            {
                "defaultKey": "screen_key",
                "customKey": "screen_map",
                "text": "screen_text"
            },
            {
                "defaultKey": "library_key",
                "customKey": "library_map",
                "text": "library_text"
            },
            {
                "defaultKey": "timeline_key",
                "customKey": "timeline_map",
                "text": "timeline_text"
            },
            {
                "defaultKey": "global_key",
                "customKey": "global_map",
                "text": "global_text"
            }
        ]);

        object = userShortcutObjectGetService();
        if (!object) {
            throw new Error("save data not found");
        }

        expect(object.length).toBe(4);
        expect(object[0].defaultKey).toBe("screen_key");
        expect(object[1].defaultKey).toBe("library_key");
        expect(object[2].defaultKey).toBe("timeline_key");
        expect(object[3].defaultKey).toBe("global_key");

        execute();

        object = userShortcutObjectGetService();
        expect(object).toBe(null);
    });
});