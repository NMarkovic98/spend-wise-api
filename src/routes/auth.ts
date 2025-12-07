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
      if (err) {
        console.error("Passport callback error:", err);
        return res.status(500).json({ error: "OAuth failed" });
      }
      if (!user) {
        return res.status(400).json({ error: "No user returned from Google" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      res.json({ token, user });
    }
  )(req, res, next);
});

export default router;
