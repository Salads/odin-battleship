
export class EventfulObject {

	#listeners = {};

	hook(eventName, listener) {
		if(!this.#listeners[eventName]) { this.#listeners[eventName] = []; }
		this.#listeners[eventName].push(listener);
	}

	emit(eventName, eventData) {
		if(!this.#listeners[eventName]) return;
		for(let listener of this.#listeners) {
			if(typeof listener === "function") {
				listener(eventData);
			}
			else if(listener?.handleEvent) {
				listener.handleEvent(eventData);
			}
		}
	}
};