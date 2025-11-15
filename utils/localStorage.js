import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_TOKEN_KEY = "user_token";
const ADMIN_TOKEN_KEY = "admin_token";

let cachedUserToken = null;
let cachedAdminToken = null;

export const getAuthToken = () => {
  return cachedUserToken || "";
};

export const getAuthTokenAdmin = () => {
  return cachedAdminToken || "";
};

export const setAuthToken = async (token) => {
  try {
    cachedUserToken = token;
    await AsyncStorage.setItem(USER_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error storing user token:", error);
  }
};

export const setAuthTokenAdmin = async (token) => {
  try {
    cachedAdminToken = token;
    await AsyncStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error storing admin token:", error);
  }
};

export const clearAuthToken = async () => {
  try {
    cachedUserToken = null;
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing user token:", error);
  }
};

export const clearAuthTokenAdmin = async () => {
  try {
    cachedAdminToken = null;
    await AsyncStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing admin token:", error);
  }
};

export const clearAllTokens = async () => {
  try {
    cachedUserToken = null;
    cachedAdminToken = null;
    await AsyncStorage.multiRemove([USER_TOKEN_KEY, ADMIN_TOKEN_KEY]);
  } catch (error) {
    console.error("Error clearing all tokens:", error);
  }
};

export const initializeTokens = async () => {
  try {
    const [userToken, adminToken] = await AsyncStorage.multiGet([
      USER_TOKEN_KEY,
      ADMIN_TOKEN_KEY,
    ]);
    cachedUserToken = userToken?.[1] || null;
    cachedAdminToken = adminToken?.[1] || null;
  } catch (error) {
    console.error("Error initializing tokens:", error);
  }
};
