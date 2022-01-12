import { gql } from '@apollo/client';

export default gql`
  scalar Upload

  type Query {
    "Example query"
    hello: String!
    user(input: UserInput!): User!

    suggestedUsers: [User]!

    "Returns info about logged user"
    me: Me

    "Search"
    search(input: SearchInput!): SearchResult!

    userPosts(input: UserPostsInput!): [Post!]!
    personalizedPosts(input: PersonalizedPostsInput): [PersonalizedPost!]!

    "Returns place detail information"
    place(id: Int!): Place!

    "Returns places with possibility to add filters"
    places(input: PlacesInput): [Place!]!

    "Returns post detail information"
    post(id: Int!): Post!

    "Returns posts with possibility to add filters"
    posts(input: PostsInput): [Post!]!

    "Returns collection detail information"
    collection(id: Int!): Collection!
  }

  type Mutation {
    "Returns JWT"
    login(input: LoginInput!): String!

    "Register and login with Google"
    googleAuth(googleJWT: String!): String!

    "Sends password reset email"
    forgotPassword(login: String!): String

    "Reset password"
    resetPassword(input: ResetPasswordInput!): String

    deleteUser(input: DeleteUserInput!): String!
    delete(id: Int!): String
    report(id: Int!): String
    like(input: LikeInput!): String
    unlike(id: Int!): String
    follow(userID: Int!): String
    unfollow(userID: Int!): String
    createCollection(input: CreateCollectionInput!): String
    editCollection(input: EditCollectionInput!): String
    updateProfile(input: UpdateProfileInput!): String!
    createPost(input: CreatePostInput!): String!
    createUser(input: CreateUserInput!): String!
    verifyToken(token: String!): String!
    createComment(input: CreateCommentInput!): String!
    addToCollection(input: AddToCollectionInput!): String!
    removeFromCollection(input: AddToCollectionInput!): String!
  }

  input SearchInput {
    text: String!
  }

  input ResetPasswordInput {
    token: String!
    newPassword: String!
  }

  input NotificationsSettingsInput {
    newFollower: Boolean
    followingUserPost: Boolean
    followingPlacePost: Boolean
    newsletter: Boolean
  }

  type SearchResult {
    users: [User!]!
    posts: [Post!]!
  }

  input Radius {
    latitude: Float
    longitude: Float
    distance: Float
  }

  input PlacesFilter {
    maxLatitude: Float
    minLatitude: Float
    maxLongitude: Float
    minLongitude: Float
    minDate: Float
    maxDate: Float
    radius: Radius
    tags: [String]
    skip: Int
    take: Int
    exclude: [Int!]
  }

  input PlacesInput {
    filter: PlacesFilter
  }

  input PostsFilter {
    maxLatitude: Float
    minLatitude: Float
    maxLongitude: Float
    minLongitude: Float
    minDate: Float
    maxDate: Float
    radius: Radius
    tags: [String]
    skip: Int
    take: Int
    placeId: Int
    authorId: Int
    authorUsername: String
  }

  input PostsInput {
    filter: PostsFilter
  }

  input PersonalizedPostsInput {
    skip: Int!
    take: Int!
  }

  type PersonalizedPostAuthor {
    id: Int!
    bio: String
    profile: String!
    firstName: String!
    lastName: String!
    username: String!
    createdAt: Float!
  }

  type PersonalizedPostComment {
    id: Int!
    content: String
    author: PersonalizedPostAuthor!
    edited: Boolean!
    liked: String
  }

  type PersonalizedPost {
    id: Int!
    description: String
    photos: [Photo!]!
    createdAt: Float!
    postDate: Float!
    edited: Boolean!
    nsfw: Boolean!
    public: Boolean!
    author: PersonalizedPostAuthor!
    liked: String
    likeCount: Int!
    commentCount: Int!
    comments: [PersonalizedPostComment]!
    place: Place!
    query: String
  }

  input AddToCollectionInput {
    postId: Int!
    collectionId: Int!
  }

  input CreateCommentInput {
    target: Int!
    content: String!
  }

  type Place {
    id: Int!
    latitude: Float!
    longitude: Float!
    description: String
    name: String
    preview: [String!]
    icon: String
    posts: [Post]!
    nearbyPlaces: [NearbyPlaces]!
    distance: Float
  }

  type NearbyPlaces {
    id: Int!
    description: String!
    name: String!
    preview: String!
    distance: Float!
  }

  type Photo {
    hash: String!
    blurhash: String!
    width: Int!
    height: Int!
    index: Int!
  }

  type Post {
    createdAt: Float!
    postDate: Float!
    description: String
    hashtags: [Hashtag]
    id: Int!
    author: User!
    likes: [UserInfoMinimal]!
    photos: [Photo!]!
    liked: Boolean!
    place: Place!
    comments: [Comment]!
  }

  type Comment {
    id: Int!
    createdAt: Float!
    content: String!
    liked: Boolean!
    author: UserInfoMinimal!
  }

  type Hashtag {
    name: String!
  }

  input LikeInput {
    id: Int!
    type: String!
  }

  input CreatePostInput {
    description: String
    hashtags: String
    photoDate: String!
    latitude: Float!
    longitude: Float!
    photo: [Upload!]!
  }

  input UpdateProfileInput {
    username: String
    email: String
    firstName: String
    lastName: String
    bio: String
    password: String
    notificationSettings: NotificationsSettingsInput
  }

  input UserPostsInput {
    id: Int!
    offset: Int
  }

  input DeleteUserInput {
    username: String!
    password: String!
  }

  input CreateCollectionInput {
    name: String!
    description: String!
    isPrivate: Boolean!
  }

  input EditCollectionInput {
    name: String!
    description: String!
    isPrivate: Boolean!
    collectionId: Int!
  }

  type NotificationsSettings {
    newFollower: Boolean!
    followingUserPost: Boolean!
    followingPlacePost: Boolean!
    newsletter: Boolean!
  }

  type Me {
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    bio: String
    profile: String!
    verified: Boolean!
    createdAt: Float!
    isFollowing: Boolean!
    followerCount: Int!
    followingCount: Int!
    postCount: Int!
    id: Float!
    hasPassword: Boolean!
    following: [UserInfoMinimal]
    followers: [UserInfoMinimal]
    collections: [Collection]
    posts: [Post!]!
    notificationSettings: NotificationsSettings!
  }

  type User {
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    bio: String
    profile: String!
    verified: Boolean!
    createdAt: Float!
    isFollowing: Boolean!
    followerCount: Int!
    followingCount: Int!
    postCount: Int!
    id: Float!
    following: [UserInfoMinimal]
    followers: [UserInfoMinimal]
    collections: [Collection]
    posts: [Post!]!
  }

  type PostInfoNew {
    id: Float!
    url: [String!]!
    description: String
  }

  type UserInfoMinimal {
    id: Float!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Collection {
    id: Float!
    createdAt: Float!
    description: String
    name: String!
    preview: String
    postCount: Int!
    author: UserInfoMinimal!
    posts: [PostInfoNew]!
  }

  input UserInput {
    username: String
    id: Int
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input CreateUserInput {
    username: String!
    email: String!
    emailSubscription: Boolean!
    firstName: String!
    lastName: String!
    password: String!
    locale: String
  }
`;
