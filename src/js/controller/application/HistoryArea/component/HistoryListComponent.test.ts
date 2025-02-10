import { execute } from "./HistoryListComponent";
import { describe, expect, it } from "vitest";

describe("HistoryListComponent Test", () =>
{
    it("test case", () =>
    {
        const value = execute(1, 2, "text", "value1", "value2");
        expect(value).toBe(`
<div data-index="2" data-library-id="1">
    <span class="language" data-text="{{text}}" data-args="value1__@value2">text</span> 
</div>
`);
    });
});