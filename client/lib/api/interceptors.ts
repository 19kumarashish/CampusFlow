import { api } from "./axios";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Only setup interceptors on client side
if (typeof window !== "undefined") {
  const setupInterceptors = async () => {
    const { store } = await import("@/store");
    const { setCredentials, logout } = await import("@/store/slices/authSlice");

    // Request Interceptor - Add token to headers
    api.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Handle token refresh on 401
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh-token");

        // Ensure error response exists and check for 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshRequest) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // Backend returns: ApiResponse<{ accessToken: string, user: User }>
            const response = await api.post("/auth/refresh-token");
            const { accessToken, user } = response.data.data;

            // Update Redux store with new token and user details
            store.dispatch(
              setCredentials({
                accessToken,
                user,
              })
            );

            // Update request header with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // Process queued requests
            processQueue(null, accessToken);

            isRefreshing = false;

            return api(originalRequest);
          } catch (err) {
            // Token refresh failed - logout user
            store.dispatch(logout());
            processQueue(err, null);

            isRefreshing = false;

            // Redirect to login if not already on the login page
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }

            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );
  };

  setupInterceptors();
}
