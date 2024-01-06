class MissingAttributeError extends Error {
  constructor(missingAttribute) {
    const message = `Missing Attribute : ${missingAttribute}`;
    super(message);
    this.name = this.constructor.name;
  }
}

class MissingParameterError extends Error {
  constructor(missingAttribute) {
    const message = `Missing Attribute : ${missingAttribute}`;
    super(message);
    this.name = this.constructor.name;
  }
}

class UnAuthorizedAccessError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}


module.exports = {MissingAttributeError,UnAuthorizedAccessError,TokenError,MissingParameterError}