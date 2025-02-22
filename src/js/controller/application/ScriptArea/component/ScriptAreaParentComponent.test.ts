import { execute } from "./ScriptAreaParentComponent";
import { describe, expect, it } from "vitest";

describe("ScriptAreaParentComponent Test", () =>
{
    it("execute test", () =>
    {
        expect(execute(1, "test"))
            .toBe('<div data-library-id="1" class="internal-parent"><i></i>test</div>');
    });
});