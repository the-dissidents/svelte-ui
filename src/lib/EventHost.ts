export type EventHandler<T extends unknown[]> = (...args: [...T]) => void;
export type AsyncEventHandler<T extends unknown[]> = (...args: [...T]) => void | Promise<void>;

export type EventHandlerOptions = {
    once?: boolean;
};

const globalEventHosts: EventHost<unknown[]>[] = [];
const globalAsyncEventHosts: AsyncEventHost<unknown[]>[] = [];

export function unbindEvents(obj: object) {
    EventHost.unbind(obj);
    AsyncEventHost.unbind(obj);
}

export class EventHost<T extends unknown[] = []> {
    #listeners = new Map<object, [EventHandler<T>, EventHandlerOptions][]>();

    constructor() {
        globalEventHosts.push(this as EventHost<[]>);
    }

    dispatch(...args: [...T]) {
        for (const [k, f] of [...this.#listeners]) {
            try {
                f.forEach(([x, _]) => x(...args));
            } finally {
                this.#listeners.set(k, f.filter(([_, y]) => !y.once));
            }
        }
    };

    bind(obj: object, f: (...args: [...T]) => void | Promise<void>,
        options: EventHandlerOptions = {}
    ) {
        if (!this.#listeners.has(obj))
            this.#listeners.set(obj, []);
        this.#listeners.get(obj)!.push([f, options]);
    }

    /** @deprecated use `unbindEvents` instead */
    static unbind(obj: object) {
        for (const host of globalEventHosts) {
            host.#listeners.delete(obj);
        }
    }
}

export class AsyncEventHost<T extends unknown[] = []> {
    #listeners = new Map<object, [EventHandler<T>, EventHandlerOptions][]>();

    constructor() {
        globalAsyncEventHosts.push(this as AsyncEventHost<[]>);
    }

    async dispatchAndAwaitAll(...args: [...T]) {
        try {
            const list = [...this.#listeners]
                .flatMap(([_, f]) => f.map(([x, _]) => x(...args)))
                .filter((x) => x !== undefined);
            await Promise.allSettled(list);
        } finally {
            for (const [k, f] of [...this.#listeners])
                this.#listeners.set(k, f.filter(([_, y]) => !y.once));
        }
    };

    bind(obj: object, f: (...args: [...T]) => void | Promise<void>,
        options: EventHandlerOptions = {}
    ) {
        if (!this.#listeners.has(obj))
            this.#listeners.set(obj, []);
        this.#listeners.get(obj)!.push([f, options]);
    }

    /** @deprecated use `unbindEvents` instead */
    static unbind(obj: object) {
        for (const host of globalAsyncEventHosts) {
            host.#listeners.delete(obj);
        }
    }
}
