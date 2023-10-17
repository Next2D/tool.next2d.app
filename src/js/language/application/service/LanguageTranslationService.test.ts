import { $LANGUAGE_ELEMENTS_CLASS_NAME } from "../../../config/LanguageConfig";
import { $setMapping } from "../Language";
import { execute } from "./LanguageTranslationService";

describe("LanguageTranslationServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.classList.add($LANGUAGE_ELEMENTS_CLASS_NAME);
        div.dataset.text = "{{こんにちわ}}";
        div.innerText = "こんにちわ";
        document.body.appendChild(div);

        $setMapping([
            ["{{こんにちわ}}", "hello"]
        ]);

        expect(div.innerText).toBe("こんにちわ");
        execute();
        expect(div.innerText).toBe("hello");

        div.remove();
    });
});