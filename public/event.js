export const SyfrEventMap = {
    valid: "syfr_valid",
    encrypted: "syfr_encrypted",
    beforeSend: "syfr_beforeSend",
    afterSend: "syfr_afterSend",
};
/**
 * Each static function creates a CustomEvent and immediately dispatched
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * for examples, @see SyfrClass
 */
export const SyfrEvent = {
    valid: dispatchEventFactory(SyfrEventMap.valid),
    encrypted: dispatchEventFactory(SyfrEventMap.encrypted),
    beforeSend: dispatchEventFactory(SyfrEventMap.beforeSend),
    afterSend: dispatchEventFactory(SyfrEventMap.afterSend),
};
function dispatchEventFactory(name) {
    return (form, detail) => {
        form.dispatchEvent(new CustomEvent(name, { detail }));
    };
}
