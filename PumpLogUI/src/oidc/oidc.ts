import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { store } from "../store/store";
import { clearSession, setSession } from "../store/slice/userSlice";

// Basis-URL für Redirects (konfigurierbar oder Fallback auf Origin)
const baseUrl =
  import.meta.env.VITE_OIDC_REDIRECT_BASE ?? window.location.origin;

export const oidcConfig = {
  authority:
    import.meta.env.VITE_OIDC_AUTHORITY ??
    "https://auth.onlychris.net/application/o/pumplog/",
  client_id:
    import.meta.env.VITE_OIDC_CLIENT_ID ??
    "Se0ZrV0vLDMTrO2MTqS6iQk1Y7G1pvYaLpJMysRv",
  redirect_uri: `${baseUrl}/auth/callback`,
  post_logout_redirect_uri: `${baseUrl}/auth/logout`,
  response_type: "code",
  scope: "openid profile email offline_access",

  // Authentik unterstützt kein iframe-basiertes Silent Renew
  // Token Refresh erfolgt manuell via Refresh Token
  automaticSilentRenew: false,
  accessTokenExpiringNotificationTimeInSeconds: 60,

  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcConfig);

let isRefreshing = false;

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing) return true;
  isRefreshing = true;

  try {
    const user = await userManager.getUser();
    if (!user?.refresh_token) return false;

    const refreshedUser = await userManager.signinSilent();
    return !!refreshedUser;
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
}

export async function initializeAuth(): Promise<void> {
  try {
    const user = await userManager.getUser();
    if (user && !user.expired) {
      store.dispatch(
        setSession({
          accessToken: user.access_token ?? "",
          refreshToken: user.refresh_token ?? undefined,
          expiresAt: user.expires_at ?? 0,
          profile: user.profile ?? {},
        })
      );
    } else if (user?.expired && user?.refresh_token) {
      const success = await refreshAccessToken();
      if (!success) {
        await userManager.removeUser();
        store.dispatch(clearSession());
      }
    } else if (user?.expired) {
      await userManager.removeUser();
    }
  } catch {
    // Auth initialization failed silently
  }
}

userManager.events.addUserLoaded((user) => {
  store.dispatch(
    setSession({
      accessToken: user.access_token ?? "",
      refreshToken: user.refresh_token ?? undefined,
      expiresAt: user.expires_at ?? 0,
      profile: user.profile ?? {},
    })
  );
});

userManager.events.addAccessTokenExpiring(async () => {
  await refreshAccessToken();
});

userManager.events.addUserSignedOut(() => {
  store.dispatch(clearSession());
});
