const data = {};

async function update({ _id }, doc) {
  if (doc.$set) {
    const existing = data[_id];
    if (existing) {
      Object.keys(doc.$set).forEach(prop => {
        existing[prop] = doc.$set[prop];
      });
    } else {
      data[_id] = doc.$set;
    }
  } else {
    data[_id] = doc;
  }

  return data[_id];
}

async function remove({ _id }) {
  delete data[_id];
}

async function get(id) {
  return data[id];
}

async function getAllEntries() {
  return data;
}

module.exports = {
  update,
  remove,
  get,
  getAllEntries
};
