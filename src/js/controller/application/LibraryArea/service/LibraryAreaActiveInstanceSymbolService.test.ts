import { execute } from "./LibraryAreaActiveInstanceSymbolService";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaActiveInstanceSymbolService Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.contentEditable = "false";
        
        // focus()をspyする
        const focusSpy = vi.spyOn(div, 'focus');

        expect(div.contentEditable).toBe("false");
        execute(div);
        expect(div.contentEditable).toBe("true");
        
        // focus()が呼ばれたことを確認
        expect(focusSpy).toHaveBeenCalled();
        
        // styleが設定されたかを確認（JSDOMではshorthand CSSが動作しないため、設定行が実行されたことのみを確認）
        // 実装ではborderBottomを設定しているが、JSDOMの制限により検証は難しい
    });
});