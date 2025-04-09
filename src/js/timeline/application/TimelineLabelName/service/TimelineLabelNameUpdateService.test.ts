import { execute } from "./TimelineLabelNameUpdateService";
import { describe, expect, it } from "vitest";

describe("TimelineLabelNameUpdateServiceTest", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = "label-name";
        document.body.appendChild(input);

        const element: HTMLInputElement | null = document
            .getElementById("label-name") as HTMLInputElement;

        if (!element) {
            throw new Error("not found label-name element");
        }

        expect(element.value).toBe("");
        execute("test");
        expect(element.value).toBe("test");

        input.remove();
    });
});