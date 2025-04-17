class RequestService {
  constructor(db) {
    this.db = db;
  }

  async registerView() {
    return this.db.insertRequest();
  }

  async getStats() {
    return this.db.getDateTimeAndRequests();
  }
}

module.exports = RequestService; 