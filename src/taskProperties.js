export const taskProperties = {
    'input': {
        'text': [{property:'title',required:'true',minlength:'3',maxlength:'64'},{property:'description',optional:'true',minlength:'0',maxlength:'512'}],
        'date': [{property:'due',required:'true'}],
    },
    'select': {
        'priority': ['highest','high','medium','low','lowest'],
    }
}