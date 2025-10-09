export const BASE_URL = "http://localhost:4000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    POFILE: "/api/auth/profile",
  },

  RESUME: {
    CREATE: "/api/resume",
    GET_ALL: "/api/resume",
    GET_BY_ID: (id) => `/api/resume/${id}`,
    UPDATE_RESUME: (id) => `/api/resume/${id}`,
    UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
    DELETE_RESUME: (id) => `/api/resume/${id}`,
  },
  image:{
     UPLOAD_IMAGE:`/api/auth/upload-image`,
  }
};
