export default function sort(projects) {
    projects.sort((
        function(a, b) {
            if (a.index > b.index) {
                return 1;
            } else {
                return -1;
            }
        }
    ))
    return projects;
}