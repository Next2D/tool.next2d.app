import { $LANGUAGE_ELEMENTS_CLASS_NAME } from "../../../config/LanguageConfig";
import { $setMapping } from "../LanguageUtil";
import { execute } from "./LanguageTranslationService";

describe("LanguageTranslationServiceTest", () =>
{
    test("execute test", () =>
    {
        const parent = document.createElement("div");
        document.body.appendChild(parent);

        const div = document.createElement("div");
        parent.appendChild(div);
        div.classList.add($LANGUAGE_ELEMENTS_CLASS_NAME);
        div.dataset.text = "{{こんにちわ}}";
        div.innerText = "こんにちわ";
        
        $setMapping([
            ["{{こんにちわ}}", "hello"]
        ]);

        expect(div.innerText).toBe("こんにちわ");
        execute(parent);
        expect(div.innerText).toBe("hello");

        parent.remove();
    });
});