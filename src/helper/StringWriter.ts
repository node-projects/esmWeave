export class StringWriter {
    #buffer = '';

    append(text: string) {
        this.#buffer += text;
    }

    getString() {
        return this.#buffer;
    }
}