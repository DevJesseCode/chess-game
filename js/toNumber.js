function toNumber(argument) {
    if (typeof argument === "boolean") {
        if (argument === true) {
            return 1;
        }
        if (argument === false) {
            return 0;
        }
    } else if (typeof argument === "number") {
        return argument;
    } else if (!argument) {
        return `You need to provide an argument!`;
    }
    argument = argument.replace(/[A-Za-z]/g, "");
    let isNegative;
    if (new Array(...argument).includes("-")) {
        isNegative = true;
        argument = argument.replace("-", "");
    }
    let number = 0;
    let minusBy = argument.length;
    for (let i = argument.length - 1; i > -1; i--) {
        digit = argument[argument.length - minusBy];
        minusBy--;
        switch (digit) {
            case "0":
                digit = 0;
                break;
            case "1":
                digit = 1;
                break;
            case "2":
                digit = 2;
                break;
            case "3":
                digit = 3;
                break;
            case "4":
                digit = 4;
                break;
            case "5":
                digit = 5;
                break;
            case "6":
                digit = 6;
                break;
            case "7":
                digit = 7;
                break;
            case "8":
                digit = 8;
                break;
            case "9":
                digit = 9;
                break;
            default:
                console.error(
                    `The character "${digit}" is not a alphanumerical character.`
                );
                return NaN;
        }
        number += digit * 10 ** i;
    }
    if (isNegative) {
        number *= -1;
    }
    return number;
}
