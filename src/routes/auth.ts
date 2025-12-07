import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "../services/userService";
import jwt from "jsonwebtoken";

const router = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateGoogleUser(profile);
        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    (err: any, user: any, info: any) => {
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

      if (err) {
        console.error("Passport callback error:", err);
        return res.redirect(
          `${frontendURL}/auth/callback?error=${encodeURIComponent(
            "OAuth failed"
          )}`
        );
      }
      if (!user) {
        return res.redirect(
          `${frontendURL}/auth/callback?error=${encodeURIComponent(
            "No user returned from Google"
          )}`
        );
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      const params = new URLSearchParams({
        token,
        id: user.id.toString(),
        name: user.fullname || "", // ← POPRAVLJENO
        email: user.email || "",
        picture: user.picture || "",
      });

      res.redirect(`${frontendURL}/auth/callback?${params.toString()}`);
    }
  )(req, res, next);
});
export default router;
