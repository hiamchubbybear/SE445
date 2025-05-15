export class AccountDTO {
  constructor(code, message, username, password, email) {
    this.code = code;
    this.message = message;
    this.username = username;
    this.password = password;
    this.email = email;
  }
  toData() {
    return {
      status: this.code,
      data: {
        message: this.message,
        username: this.username,
        email: this.email,
        password: this.password,
      }
    };
  }
  toDataWithoutPassword() {
    return {
      status: this.code,
      data: {
        message: this.message,
        username: this.username,
        email: this.email,
      }
    };
  }
  isValid() {
    return (
      this.code && this.message && this.username && this.password && this.email
    );
  }
}
