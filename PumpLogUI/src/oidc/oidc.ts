import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { store } from "../store/store";
import { clearSession, setSession } from "../store/slice/userSlice";

export const oidcConfig = {
  authority:
    import.meta.env.VITE_OIDC_AUTHORITY ??
    "https://auth.onlychris.net/application/o/pumplog/",
  client_id:
    import.meta.env.VITE_OIDC_CLIENT_ID ??
    "Se0ZrV0vLDMTrO2MTqS6iQk1Y7G1pvYaLpJMysRv",
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: `${window.location.origin}/auth/logout`,
  response_type: "code",
  scope: "openid profile email offline_access",
};

export const userManager = new UserManager(oidcConfig);

userManager.events.addAccessTokenExpiring(async () => {
  try {
    const user = await userManager.signinSilent();
    store.dispatch(
      setSession({
        accessToken: user?.access_token ?? "",
        refreshToken: user?.refresh_token ?? undefined,
        expiresAt: user?.expires_at ?? 0,
        profile: user?.profile ?? {},
      })
    );
  } catch {
    store.dispatch(clearSession());
    await userManager.signinRedirect();
  }
});
