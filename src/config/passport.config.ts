// src/config/passportConfig.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

import Member from "../models/member.model";
import { config } from "../config/dotenv.config";
import AuthService from "../services/auth.service";

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/wristwonders/auth/google/callback",
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const member = await AuthService.findOrCreateMember(profile);

        console.log("Profile: ", profile);
        console.log("Member: ", member);

        return done(null, member);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((member, done) => {
  done(null, member);
});

passport.deserializeUser(async (id, done) => {
  try {
    const member = await Member.findById(id);
    done(null, member);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
