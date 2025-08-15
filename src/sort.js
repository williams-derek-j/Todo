export default function sort(array, property) {
    array.sort((
        function(a, b) {
            if (a[property] === undefined) {
                if (a['details'] !== undefined) {
                    if (a['details'][property] > b['details'][property]) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            } else {
                if (a[property] > b[property]) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
    ))
    return array;
}