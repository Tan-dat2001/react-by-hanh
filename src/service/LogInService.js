import axios from "axios";
import jwt_decode from "jwt-decode";

export async function login(logInObject) {
  const res = await axios.post(
    "http://localhost:8080/api/auth/authenticate",
    logInObject
  );
  return res;
}

export async function signup(signUpObject) {
  const res = await axios.post(
    "http://localhost:8080/api/auth/register",
    signUpObject
  );
  return res;
}

export const addJwtTokenToLocalStorage = (jwtToken) => {
  localStorage.setItem("JWT", jwtToken);
};

export const getAppUserInfoFromJwtToken = () => {
  const jwtToken = localStorage.getItem("JWT");
  if (jwtToken) {
    const result = jwt_decode(jwtToken);
    return result;
  }
  return null;
};
