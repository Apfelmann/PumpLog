import { userManager } from "../../oidc/oidc";
import { store } from "../../store/store";
import { setSession, clearSession } from "../../store/slice/userSlice";

export async function startLogin() {
  await userManager.signinRedirect();
}

export async function completeLogin() {
  const user = await userManager.signinRedirectCallback();
  store.dispatch(
    setSession({
      accessToken: user.access_token ?? "",
      refreshToken: user.refresh_token ?? undefined,
      expiresAt: user.expires_at ?? 0,
      profile: user.profile ?? {},
    })
  );
  return user;
}

export async function startLogout() {
  await userManager.signoutRedirect();
}

export async function completeLogout() {
  await userManager.signoutRedirectCallback();
  store.dispatch(clearSession());
}

userManager.events.addAccessTokenExpiring(() => {
  store.dispatch(clearSession());
  void userManager.signinRedirect();
});

userManager.events.addUserSignedOut(() => {
  store.dispatch(clearSession());
});
