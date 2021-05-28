class RegexTests {
  // eslint-disable-next-line max-len
  static emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  static emailCheck(value) {
    return this.emailRegex.test(value);
  }
}

export default RegexTests;
