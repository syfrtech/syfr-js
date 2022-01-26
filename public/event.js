/**
 * Each static function creates a CustomEvent and immediately dispatched
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * for examples, @see SyfrClass
 */
export class SyfrEvent {
}
SyfrEvent.valid = dispatchEventFactory("syfr_valid");
SyfrEvent.beforeSend = dispatchEventFactory("syfr_beforeSend");
SyfrEvent.send = dispatchEventFactory("syfr_beforeSend");
function dispatchEventFactory(name) {
    return (form, detail) => {
        form.dispatchEvent(new CustomEvent(name, { detail }));
    };
}
