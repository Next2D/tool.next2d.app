import { execute } from "./ScriptAreaFrameComponent";
import { describe, expect, it } from "vitest";

describe("ScriptAreaFrameComponent Test", () =>
{
    it("execute test", () =>
    {
        expect(execute(1, 3))
            .toBe('<div data-library-id="1" data-frame="3" class="internal-child"><i></i>frame 3</div>');
    });
});