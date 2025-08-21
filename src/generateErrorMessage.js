export default function generateErrorMessage(element, validityState) {
    let message = '';

    for (let key in validityState) {
        if (validityState[key] === true) {
            switch (key) {
                case 'valueMissing':
                    message = "Please enter a value."
                    break;
                case 'tooLong':
                    message = `Please enter fewer than ${element.getAttribute('maxlength')} characters.`
                    break;
                case 'tooShort':
                    message = `Please enter more than ${element.getAttribute('minlength')} characters.`
                    break;
                case 'rangeOverflow':
                    message = `Please enter a value less than ${element.getAttribute('max')}.`
                    break;
                case 'rangeUnderflow':
                    message = `Please enter a value more than ${elemente.getAttribute('min')}.`
                    break;
            }
        }
    }
    return message;
}