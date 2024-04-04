export const generateToken = (length) => {
    let token = "";
  
    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10);
      token += digit;
    }
  
    return token;
  };
  