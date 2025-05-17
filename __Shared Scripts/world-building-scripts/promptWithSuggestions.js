async function my_function (tp, names, prompt, repeat) {
    let selected = []
    do {
        const name = await tp.system.suggester(
            names,
            names,
            false,
            prompt
        );
        if (!name) {
            break;
        }
        selected.push(name);
    } while (repeat)
    return selected;
}

module.exports = my_function;