export default function sort(projects, property) {
    projects.sort((
        function(a, b) {
            if (a[property] > b[property]) {
                return 1;
            } else {
                return -1;
            }
        }
    ))
    return projects;
}