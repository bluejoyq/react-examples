export type DispatchToken = string;

const invariant = (condition: any, format: string, ...args: any[]) => {
  if (!condition) {
    throw new Error(format.replace(/%s/g, () => args.shift()));
  }
};
const _prefix = "ID_";
export class Dispatcher<TPayload> {
  _callbacks: { [key: DispatchToken]: (payload: TPayload) => void };
  _isDispatching: boolean;
  _isHandled: { [key: DispatchToken]: boolean };
  _isPending: { [key: DispatchToken]: boolean };
  _lastID: number;
  _pendingPayload?: TPayload;

  constructor() {
    this._callbacks = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastID = 1;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   */
  register(callback: (payload: TPayload) => void): DispatchToken {
    const id = _prefix + this._lastID++;
    this._callbacks[id] = callback;
    return id;
  }

  /**
   * Removes a callback based on its token.
   */
  unregister(id: DispatchToken): void {
    invariant(
      this._callbacks[id],
      "Dispatcher.unregister(...): `%s` does not map to a registered callback.",
      id,
    );
    delete this._callbacks[id];
  }

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   */
  waitFor(ids: Array<DispatchToken>): void {
    invariant(
      this._isDispatching,
      "Dispatcher.waitFor(...): Must be invoked while dispatching.",
    );
    for (let ii = 0; ii < ids.length; ii++) {
      const id = ids[ii];
      if (this._isPending[id]) {
        invariant(
          this._isHandled[id],
          "Dispatcher.waitFor(...): Circular dependency detected while " +
            "waiting for `%s`.",
          id,
        );
        continue;
      }
      invariant(
        this._callbacks[id],
        "Dispatcher.waitFor(...): `%s` does not map to a registered callback.",
        id,
      );
      this._invokeCallback(id);
    }
  }

  /**
   * Dispatches a payload to all registered callbacks.
   */
  dispatch(payload: TPayload): void {
    invariant(
      !this._isDispatching,
      "Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.",
    );
    this._startDispatching(payload);
    try {
      for (const id in this._callbacks) {
        if (this._isPending[id]) {
          continue;
        }
        this._invokeCallback(id);
      }
    } finally {
      this._stopDispatching();
    }
  }

  /**
   * Is this Dispatcher currently dispatching.
   */
  isDispatching(): boolean {
    return this._isDispatching;
  }

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @internal
   */
  _invokeCallback(id: DispatchToken): void {
    this._isPending[id] = true;
    this._callbacks[id](this._pendingPayload);
    this._isHandled[id] = true;
  }

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @internal
   */
  _startDispatching(payload: TPayload): void {
    for (const id in this._callbacks) {
      this._isPending[id] = false;
      this._isHandled[id] = false;
    }
    this._pendingPayload = payload;
    this._isDispatching = true;
  }

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  _stopDispatching(): void {
    if (this._pendingPayload != null) {
      delete this._pendingPayload;
    }

    this._isDispatching = false;
  }
}
