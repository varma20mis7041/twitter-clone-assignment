const express = require("express");
const app = express();
app.use(express.json());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "twitterClone.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http:/localhost:3000/");
    });
  } catch (e) {
    console.log(e.message);
  }
};

initializeDBAndServer();

//API 1 REGISTER USER
app.post("/register/", async (request, response) => {
  console.log("hello");
  const { username, password, name, gender } = request.body;

  const getUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const getUserDbRequest = await db.get(getUserQuery);
  if (getUserDbRequest !== undefined) {
    response.status(400);
    response.send("User already exists");
  } else {
    const passwordLength = password.length;
    if (passwordLength >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const addUserQuery = `INSERT INTO user(name,username,password,gender)
                    VALUES('${name}','${username}','${hashedPassword}','${gender}')`;
      await db.run(addUserQuery);
      response.status(200);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  }
});

// API -2 LOGIN INTO TWITTER AUTHENTICATION

app.post("/login/", async (request, response) => {
  console.log("Inside /login/");
  const { username, password } = request.body;
  const getUserFromDbQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUser = await db.get(getUserFromDbQuery);
  let jwtToken;
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
    if (isPasswordCorrect === true) {
      const payload = {
        username: username,
        password: password,
      };
      jwtToken = jwt.sign(payload, "bhargav");
      console.log(dbUser);

      response.status(200);
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

const authenticateToken = (request, response, next) => {
  console.log("inside token");
  const authHead = request.headers["authorization"];
  let jwtToken;
  if (authHead !== undefined) {
    jwtToken = authHead.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "bhargav", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        const username = payload.username;
        const userDetails = `SELECT * FROM user WHERE username = '${username}'`;
        const logedInUser = await db.get(userDetails);
        console.log(logedInUser, "user who currently logged in");
        const { user_id } = logedInUser;
        console.log(user_id, "userid");
        request.username = payload.username;
        request.user_id = logedInUser.user_id;
        next();
      }
    });
  }
};

//API 3 user/tweets/feed
app.get("/user/tweets/feed/", authenticateToken, async (request, response) => {
  const { username, user_id } = request;
  const getLatestTweets = `
  SELECT 
    user.username AS username,
    tweet.tweet AS tweet,
    tweet.date_time AS dateTime
  FROM user 
    JOIN tweet ON user.user_id = tweet.user_id
    JOIN follower ON tweet.user_id = follower.following_user_id
    WHERE follower.follower_user_id = ${user_id}
  ORDER BY 
    date_time DESC
  LIMIT 4;
  `;
  const dbRequest = await db.all(getLatestTweets);
  response.send(dbRequest);
});

//API 4 : list of people whom the user follows
app.get("/user/following", authenticateToken, async (request, response) => {
  const { user_id } = request;
  const getFollowingQuery = `
    SELECT 
        name
    FROM user 
        JOIN follower ON user.user_id = follower.following_user_id
    WHERE follower.follower_user_id = ${user_id};

    `;
  const dbRequet = await db.all(getFollowingQuery);
  response.send(dbRequet);
});

//API 5 : list of people who follows logged in user
app.get("/user/followers/", authenticateToken, async (request, response) => {
  const { user_id } = request;
  const getFollowersQuery = `
    SELECT 
        name
    FROM user 
        JOIN follower ON user.user_id = follower.follower_user_id
    WHERE follower.following_user_id = ${user_id};
    `;
  const dbRequet = await db.all(getFollowersQuery);
  response.send(dbRequet);
});

const validFollowingCheck = async (request, response, next) => {
  const { tweetId } = request.params;
  const { user_id } = request;
  const getTwittedUserId = `SELECT user_id FROM tweet WHERE tweet_id = ${tweetId}`;
  const twittedPerson = await db.get(getTwittedUserId);
  console.log(twittedPerson);
  const getUserFollowing = `SELECT 
        user_id
        FROM user 
            JOIN follower ON user.user_id = follower.following_user_id

            WHERE follower.follower_user_id = ${user_id};
        `;
  const userFollowingUsers = await db.all(getUserFollowing);

  let twittedPersonsId = twittedPerson.user_id;
  let userFollowingArray = [];
  userFollowingUsers.map((eachItem) =>
    userFollowingArray.push(eachItem.user_id)
  );
  const isValidFollowerRequest = userFollowingArray.includes(twittedPersonsId);
  if (isValidFollowerRequest) {
    next();
  } else {
    response.status(401);
    response.send("Invalid Request");
    return;
  }
};
//API 6 : Get Requested Tweet using tweet id as parameter

app.get(
  "/tweets/:tweetId/",
  authenticateToken,
  validFollowingCheck,
  async (request, response) => {
    const { tweetId } = request.params;
    const { user_id } = request;
    console.log(user_id, "inside api6");

    const getTweetQuery = `
        SELECT
           tweet.tweet,
           COUNT(like.tweet_id) AS likes,
            tweet.date_time AS dateTime

        FROM  tweet
            JOIN like ON tweet.tweet_id = like.tweet_id
        WHERE tweet.tweet_id = ${tweetId};
    `;
    const getRepliesQuery = `
        SELECT
            COUNT(reply.reply) AS replies
        FROM  tweet 
            JOIN reply ON tweet.tweet_id = reply.tweet_id
        WHERE tweet.tweet_id = ${tweetId};
    `;
    const dbgetTweet = await db.get(getTweetQuery);
    const dbgetReply = await db.get(getRepliesQuery);
    console.log(dbgetTweet);
    console.log(dbgetReply);
    const finalTweetResult = {
      tweet: dbgetTweet.tweet,
      likes: dbgetTweet.likes,
      replies: dbgetReply.replies,
      dateTime: dbgetTweet.dateTime,
    };
    response.send(finalTweetResult);
  }
);

//API : 7 PEOPLE WHO LIKED THE TWEET
app.get(
  "/tweets/:tweetId/likes/",
  authenticateToken,
  validFollowingCheck,
  async (request, response) => {
    const { user_id } = request;
    const { tweetId } = request.params;
    const getTweetLikedUsers = `
        SELECT  
            user.username AS likes
        FROM tweet 
          JOIN like ON tweet.tweet_id = like.tweet_id
          JOIN user ON like.user_id = user.user_id
        WHERE tweet.tweet_id = ${tweetId};    
    
    `;
    const tweetLikedUsers = await db.all(getTweetLikedUsers);
    let likedUsersArray = tweetLikedUsers.map((eachItem) => eachItem.likes);
    console.log(likedUsersArray);

    response.send({ likes: likedUsersArray });
  }
);

//API 8 : return replies of a particular tweet
app.get(
  "/tweets/:tweetId/replies/",
  authenticateToken,
  validFollowingCheck,
  async (request, response) => {
    const { user_id } = request;
    const { tweetId } = request.params;
    const getTweetRepliesQuery = `
        SELECT 
            user.name,
            reply.reply
        FROM tweet
            JOIN reply ON tweet.tweet_id = reply.tweet_id
            JOIN user ON reply.user_id = user.user_id
        WHERE tweet.tweet_id = ${tweetId};
        `;
    const tweetReplies = await db.all(getTweetRepliesQuery);
    let tweetRepliesArray = tweetReplies.map((eachItem) => {
      return {
        name: eachItem.name,
        reply: eachItem.reply,
      };
    });
    console.log(tweetRepliesArray);
    response.send({ replies: tweetReplies });
  }
);

//API 9 : Return a list of all tweets done by the user
app.get("/user/tweets/", authenticateToken, async (request, response) => {
  const { user_id } = request;
  const getUserLikesQuery = `
    SELECT 
        tweet.tweet,
        COUNT(DISTINCT(like.like_id)) AS likes,
        COUNT(DISTINCT(reply.reply)) AS replies,
        date_time AS dateTime
    FROM user 
        JOIN tweet ON user.user_id = tweet.user_id
        JOIN like ON like.tweet_id = tweet.tweet_id
        JOIN reply ON reply.tweet_id = tweet.tweet_id
        WHERE user.user_id = ${user_id}
        GROUP BY tweet.tweet_id;
    `;
  const userLikes = await db.all(getUserLikesQuery);
  console.log(userLikes);
  response.send(userLikes);
});

//API - 10 : Create tweet

app.post("/user/tweets/", authenticateToken, async (request, response) => {
  const { user_id } = request;
  const { tweet } = request.body;
  const dateTime = new Date();
  console.log(dateTime);
  const formatedDate = `${dateTime.getFullYear()}-${dateTime.getMonth()}-${dateTime.getDate()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
  console.log(formatedDate);
  const createTweetSqlQuery = `
    INSERT INTO tweet(tweet,user_id,date_time)
    VALUES('${tweet}',${user_id},'${formatedDate}')
    
    `;

  await db.run(createTweetSqlQuery);
  response.send("Created a Tweet");
});
const checkUserBeforeDeleting = async (request, response, next) => {
  const { user_id } = request;
  const { tweetId } = request.params;
  const getTweetQuery = ` 
        SELECT user_id FROM tweet WHERE tweet_id = ${tweetId};
    `;
  const userId = await db.get(getTweetQuery);
  console.log(userId);
  if (user_id === userId.user_id) {
    console.log("user and tweet posted user are same");
    next();
  } else {
    console.log(false);
    response.status(401);
    response.send("Invalid Request");
  }
};

app.delete(
  "/tweets/:tweetId/",
  authenticateToken,
  checkUserBeforeDeleting,
  async (request, response) => {
    const { user_id } = request;
    const { tweetId } = request.params;
    const deleteQuery = `
    DELETE FROM tweet
    WHERE tweet_id = ${tweetId};
    `;
    await db.run(deleteQuery);
    response.send("Tweet Removed");
  }
);
module.exports = app;

