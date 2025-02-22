import { execute } from "./SoundAreaSelectOptionComponent";
import { describe, expect, it } from "vitest";

describe("SoundAreaSelectOptionComponent Test", () =>
{
    it("execute test", () =>
    {
        expect(execute(1, "test"))
            .toBe('<option value="1">test</option>');
    });
});