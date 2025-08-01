export default (props) => {
    let user = props.user;
    // let title = props.title;
    // let date = new Date(props.date);
    // let description = props.description;
    // let priority = props.priority;

    // function createSubTask(props) {
    //     //
    // }
    //
    // function removeSubTask(subTask) {
    //     //
    // }

    // function editDescription(newDescription) {
    //     this.description = newDescription;
    // }


    function info() {
        return {
            user,
            // title,
            // date,
            // description,
            // priority,
            //subTasks
        }
    }

    return {
        //user: props.user,
        // title: props.title,
        // date: new Date(props.date),
        // description: props.description,
        // priority: props.priority,
        // tasks: props.tasks,
        //createSubTask: createSubTask,
        //editDescription: editDescription,
        info,
    }
}