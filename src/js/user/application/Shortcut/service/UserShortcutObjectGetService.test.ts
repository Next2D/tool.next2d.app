import { ShortcutSaveObjectImpl } from "../../../../interface/ShortcutSaveObjectImpl";
import { execute } from "./UserShortcutObjectGetService";
import { execute as userShortcutObjectUpdateService } from "./UserShortcutObjectUpdateService";

describe("UserShortcutObjectGetServiceTest", () =>
{
    test("execute test", () =>
    {
        let object: ShortcutSaveObjectImpl | null = execute();
        expect(object).toBe(null);

        userShortcutObjectUpdateService({
            "screen": [{
                "key": "screen_key",
                "map": "screen_map",
                "text": "screen_text"
            }],
            "library": [{
                "key": "library_key",
                "map": "library_map",
                "text": "library_text"
            }],
            "timeline": [{
                "key": "timeline_key",
                "map": "timeline_map",
                "text": "timeline_text"
            }],
            "global": [{
                "key": "global_key",
                "map": "global_map",
                "text": "global_text"
            }]
        });

        object = execute();
        if (!object) {
            throw new Error("save data not found");
        }

        const keys: string[] = Object.keys(object);
        expect(keys.length).toBe(4);
        expect(keys[0]).toBe("screen");
        expect(keys[1]).toBe("library");
        expect(keys[2]).toBe("timeline");
        expect(keys[3]).toBe("global");
    });
});