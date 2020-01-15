let db = {
  users: [
    {
      userId: "9fj5rrShxnQgK3tfAeaz1EKkHnY2",
      email: "user@email.com",
      handle: "user",
      createdAt: "2019-03-15T10:59:52.798Z",
      imageUrl: "image/dsfsdkfghskdfgs/dgfdhfgdh",
      bio: "Hello, my name is user, nice to meet you",
      website: "https://user.com",
      location: "Lonodn, UK"
    }
  ],
  shuttles: [
    {
      userHandle: "user",
      body: "this is the shuttle body",
      createAt: "2020-01-09T10:55:16.568Z",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "user",
      shuttleId: "fjskfsjkfsfbdnadab",
      body: "Nice meme mate",
      createAt: "2020-01-09T11:55:16.568Z"
    }
  ],
  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true | false",
      shuttleId: "kdjsfgdksuufhgkdsufky",
      type: "like | comment",
      createAt: "2019-03-15T10:59:52.798Z"
    }
  ]
};
const userDetails = {
  //? Redux data
  credentials: {
    userId: "9fj5rrShxnQgK3tfAeaz1EKkHnY2",
    email: "user@email.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image/dsfsdkfghskdfgs/dgfdhfgdh",
    bio: "Hello, my name is user, nice to meet you",
    website: "https://user.com",
    location: "Lonodn, UK"
  },
  likes: [
    {
      userHandle: "user",
      screamId: "r4PJgBz20ZR6kthruoHd"
    },
    {
      userHandle: "user",
      screamId: "sj6Vd9ePlPvYSdClqxQh"
    }
  ]
};
