const EventFlags = {
  _flags: {},

  set(key) {
    this._flags[key] = true;
  },

  get(key) {
    return !!this._flags[key];
  },

  reset() {
    this._flags = {};
  }
};

export default EventFlags;
