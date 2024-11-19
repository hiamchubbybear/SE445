export class AccountDTO {
  constructor(code, message, username, password, email) {
    this.code = code;
    this.message = message;
    data: {
      this.username = username;
      this.password = password;
      this.email = email;
    }
  }
  toData() {
    return `
  AccountDTO {
    status: ${this.code},
    data: {
      message: ${this.message},
      username: ${this.username},
      email: ${this.email},
      password: ${this.password}
    }
  }`;
  }

  toDataWithoutPassword() {
    return `
  AccountDTO {
    status: ${this.code},
    data: {
      message: ${this.message},
      username: ${this.username},
      email: ${this.email}
    }
  }`;
  }
  isValid() {
    return (
      this.code && this.message && this.username && this.password && this.email
    );
  }
}
