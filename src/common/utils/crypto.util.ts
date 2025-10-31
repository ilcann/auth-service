import * as bcrypt from 'bcrypt';

const cryptoUtils = {
  hashPlainText(plainText: string) {
    return bcrypt.hash(plainText, 10);
  },
  compareWithHash(plainText: string, hashedText: string) {
    return bcrypt.compare(plainText, hashedText);
  },
  generateUniqueId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },
};

export default cryptoUtils;
