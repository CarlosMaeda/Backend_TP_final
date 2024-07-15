class customError {
  constructor(ok, message, status, data = null) {
    this.ok = ok;
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

module.exports = { customError };
