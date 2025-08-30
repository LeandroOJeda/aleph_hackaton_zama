const validation = (user) => {
  let error = {
    email: "",
    password: "",
  };

  const { email, password } = user;

  if (!email) {
    error = { ...error, email: "Por favor, ingresa tu dirección de email" };
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
    error = { ...error, email: "Email invalido" };
  }

  if (!password) {
    error = { ...error, password: "Por favor, ingresa tu contraseña" };
  } else if (!/[0-9]/.test(password)) {
    error = {
      ...error,
      password: "La contraseña debe tener al menos un número",
    };
  } else if (password.length < 6) {
    error = {
      ...email,
      password: "La contraseña debe tener más de 5 caracteres",
    };
  }
  return error;
};

export default validation;
