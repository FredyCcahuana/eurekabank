let data = {};

const store = {
  get(key) {
    return data[key];
  },
  set(key, val) {
    return data[key] = val;
  },
  del(key) {
    delete data[key];
    return true;
  }
};

module.exports = store;
