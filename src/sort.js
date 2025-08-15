export default function sort(array, property) {
    array.sort((
        function(a, b) {
            if (a[property] === undefined) {
                console.log(a['details'][property], b['details'][property], (a['details'][property] > b['details'][property]));
                if (a['details'][property] > b['details'][property]) {
                    return 1;
                } else {
                    return -1;
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