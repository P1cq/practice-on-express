import passport from "passport";
import { env } from "./config.service.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.clientID,

      clientSecret: env.clientSecret,

      callbackURL: "http://localhost:3000/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      try {
        const user = {
          email: profile.emails[0].value,
          name: profile.displayName,
          verifyEmail: profile.emails[0].verified,
          pic: profile._json.picture,
        };

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);
