export default (element, style) => {
    for (const property in style)
        element.style[property] = style[property];
}