export default function sort(array, property) {
    array.sort((
        function(a, b) {
            console.log('property', property);
            console.log('a,b', a, b)
            console.log('a[prop],b[prop]', a[property], b[property]);
            if (a[property] === undefined) {
                console.log(a['details'][property]);
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