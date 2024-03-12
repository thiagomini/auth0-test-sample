const assert = require('assert/strict');

const HttpMethod = {
  Post: 'POST',
  Get: 'GET',
  Put: 'PUT',
};

class HttpCall {
  constructor(method, url, body, response, headers) {
    this.method = method;
    this.url = url;
    this.body = body;
    this.response = response;
    this.headers = headers;
  }

  matching(method, url) {
    return this.method === method && this.url.toString() === url.toString();
  }
}

class WhenCondition {
  /**
   * @param {string} method
   * @param {URL} url
   */
  constructor(method, url) {
    this.method = method;
    this.url = url;
  }

  matches(method, url) {
    return this.method === method && this.url.toString() === url.toString();
  }

  static any() {
    return new WhenCondition('*', '*');
  }
}

class HttpResponseStub {
  constructor(status, body, when) {
    this.status = status;
    this.body = body;
    this.when = when;
  }

  matches(method, url) {
    return this.when.matches(method, url);
  }

  toJSON() {
    return {
      status: this.status,
      data: this.body,
    };
  }
}

class ErrorResponse {
  error;
  #when;
  constructor(error, when) {
    this.error = error;
    this.#when = when;
  }

  matches(method, url) {
    return this.#when.matches(method, url);
  }
}

class AxiosSpy {
  constructor() {
    this.httpCalls = [];
    this.response = new HttpResponseStub(200, {}, WhenCondition.any());
    this.errorResponse = null;
  }

  async post(url, body, config) {
    const httpCall = new HttpCall(
      HttpMethod.Post,
      url,
      body,
      this.response,
      config && config.headers
    );
    this.httpCalls.push(httpCall);

    const response = this.responseMatching(HttpMethod.Post, url);

    if (response instanceof Error) {
      return Promise.reject(response);
    }

    if (response?.status >= 400) {
      const error = new Error(
        `Request failed with status code ${response.status}: ${response.body?.errors?.[0]?.message}`
      );
      error.response = response;
      return Promise.reject(error);
    }

    return Promise.resolve(response?.toJSON());
  }

  // Spy-specific methods

  /**
   * @param {string} method
   * @param {URL} url
   * @return {HttpResponseStub | undefined}
   */
  responseMatching(method, url) {
    // Error responses take precedence over stubbed responses
    if (this?.errorResponse?.matches(method, url)) {
      return this.errorResponse.error;
    }
    const matches = this.response.matches(method, url);
    if (matches) {
      return this.response;
    }
  }

  /**
   * Stubs the response for a given HTTP method and URL
   * @param {string} method
   * @param {URL} url
   * @param {Object} response
   */
  stubResponseFor(method, url, response) {
    const isResponseObject =
      typeof response === 'object' && Boolean(response.body);

    const body = isResponseObject ? response.body : response;
    const status = isResponseObject ? response.status : 200;

    const whenCondition = new WhenCondition(method, url);
    this.response = new HttpResponseStub(status, body, whenCondition);
  }

  /**
   * Stubs an unexpected error for a given HTTP method and URL - it's not an HTTP error response from axios, but
   * rather an unexpected error that could occur when making a request
   * @param {string} method
   * @param {URL} url
   * @param {Error} error
   */
  stubUnexpectedErrorFor(method, url, error) {
    this.errorResponse = new ErrorResponse(
      error,
      new WhenCondition(method, url)
    );
  }

  clear() {
    this.httpCalls = [];
  }

  // Assertions

  /**
   * @param {number} numberOfRequests
   * @return {AxiosSpy}
   */
  shouldHaveSentNumberOfRequests(numberOfRequests) {
    assert.equal(this.httpCalls.length, numberOfRequests);
    return this;
  }

  /**
   * @param {string} method
   * @return {AxiosSpy}
   */
  withMethod(method) {
    this.httpCalls.forEach((httpCall) => assert.equal(httpCall.method, method));
    return this;
  }

  /**
   * @param {URL} url
   * @return {AxiosSpy}
   */
  withUrl(url) {
    this.httpCalls.forEach((httpCall) => assert.deepEqual(httpCall.url, url));
    return this;
  }

  /**
   * @param {Object} body
   * @return {AxiosSpy}
   */
  withBody(body) {
    this.httpCalls.forEach((httpCall) =>
      assert.deepStrictEqual(httpCall.body, body)
    );
    return this;
  }

  /**
   * @param {Object} headers
   * @return {AxiosSpy}
   */
  withHeaders(headers) {
    this.httpCalls.forEach((httpCall) =>
      assert.deepStrictEqual(httpCall.headers, headers)
    );
    return this;
  }
}

module.exports = { AxiosSpy, HttpMethod };
