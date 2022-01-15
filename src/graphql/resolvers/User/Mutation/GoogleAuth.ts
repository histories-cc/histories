import SendEmail from '../../../../email/SendEmail';
import axios from 'axios';
import { remove as removeDiacritics } from 'diacritics';
import { v4 as uuidv4 } from 'uuid';

import RunCypherQuery from '../../../../database/RunCypherQuery';
import SignJWT from '../../../../functions/SignJWT';
import { UploadPhoto } from '../../../../IPFS';
import RegisteredWithGoogleEmail from '../../../../email/content/NewPassword';
import { GenerateBlurhash } from '../../../../functions';

async function RegisterWithGooge(googleJWT: string) {
  const passwordResetToken = `${new Date().getTime()}-${uuidv4()}`; // generate token for new password creation

  const query = `
    CREATE (user:User {
      googleID: $googleID,
      username : $username,
      firstName: $firstName,
      lastName: $lastName,
      email: $email, 
      createdAt: $createdAt,
      verified: true, 
      locale: $locale,
      newFollowerNotification: true,
      followingPlacePostNotification: true,
      followingUserPostNotification: true,
      newsletterNotification: true,
      profile: $profile,
      profileBlurhash: $profileBlurhash,
      passwordResetToken: $passwordResetToken
    })
    SET user.id = ID(user)
    RETURN user.id AS id
    `;

  try {
    // validate token
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleJWT}`
    );

    const [existingUser] = await RunCypherQuery({
      query: `MATCH (user:User)
              WHERE user.googleID = $googleID
                OR user.email =~ $email   
              RETURN user{.*} AS user`,
      params: {
        googleID: res.data.sub,
        email: res.data.email,
      },
    });

    // if there is some user with same email or googleID
    if (existingUser.records.length > 0) {
      // if user has same email and doesn't have googleID add googleID to user and return JWT
      if (existingUser.records[0].get('user').googleID === undefined)
        await RunCypherQuery({
          query: `MATCH (user:User)
                  WHERE user.email =~ $email   
                  SET user.googleID = $googleID`,
          params: {
            googleID: res.data.sub, // googleID
            email: res.data.email,
          },
        });
      if (!process.env.JWT_SECRET) throw new Error('JWT secret is not defined');

      return SignJWT(
        existingUser.records[0].get('user').id,
        process.env.JWT_SECRET
      );
    }

    // if there is no user with same email or googleID create user and return JWT
    else {
      const response = await axios.get(res.data.picture, {
        responseType: 'arraybuffer',
      });
      const profileImage = Buffer.from(response.data, 'utf-8');
      const [blurhash, profile] = await Promise.all([
        GenerateBlurhash(profileImage),
        UploadPhoto(profileImage),
      ]);

      const date = new Date().getTime().toString();
      // get user data from neo4j
      const [userInfo] = await RunCypherQuery({
        query,
        params: {
          googleID: res.data.sub,
          username: `${removeDiacritics(res.data.given_name)}${date.substring(
            date.length - 6
          )}`, // generate unique username
          firstName: res.data.given_name,
          lastName: res.data.family_name,
          email: res.data.email,
          createdAt: new Date().getTime(),
          verified: true,
          locale: res.data.locale,
          profile: profile.hash,
          profileBlurhash: blurhash,
          passwordResetToken,
        },
      });

      // send email for verification
      await SendEmail(
        'Welcome to Histories',
        RegisteredWithGoogleEmail({
          token: passwordResetToken,
          firstName: res.data.given_name,
        }),
        res.data.email
      );
      if (!process.env.JWT_SECRET) throw new Error('JWT secret is not defined');

      return SignJWT(userInfo.records[0].get('id'), process.env.JWT_SECRET);
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export default RegisterWithGooge;
