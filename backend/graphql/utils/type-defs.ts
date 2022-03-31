import { gql } from '@apollo/client';

export default gql`
  scalar Upload

  type Query {
    "Example query"
    hello: String!
    user(input: UserInput!): User

    suggestedUsers: [User]!

    "Returns info about logged user"
    me: Me

    "Search"
    search(input: SearchInput!): SearchResult!

    personalizedPosts(input: PersonalizedPostsInput): [Post!]!

    "Returns place detail information"
    place(id: Int!): Place!

    "Returns places with possibility to add filters"
    places(input: PlacesInput): [Place!]!

    "Returns post detail information"
    post(id: Int!): Post!

    "Returns posts with possibility to add filters"
    posts(input: PostsInput): [Post!]!

    "Returns collection detail information"
    collection(id: Int!): Collection

    comments(input: CommentsInput): [Comment!]!
  }

  type Mutation {
    "Returns JWT"
    login(input: LoginInput!): String!
    "Register and login with Google"
    googleAuth(googleJWT: String!): String!
    deleteUser(input: DeleteUserInput!): String!
    "Sends password reset email"
    forgotPassword(login: String!): String
    "Reset password"
    resetPassword(input: ResetPasswordInput!): String
    follow(userID: Int!): String
    unfollow(userID: Int!): String
    updateProfile(input: UpdateProfileInput!): String!
    createUser(input: CreateUserInput!): String!
    verifyToken(token: String!): String!

    delete(id: Int!): String
    like(input: LikeInput!): String
    unlike(id: Int!): String
    report(id: Int!): String

    createCollection(input: CreateCollectionInput!): String
    editCollection(input: EditCollectionInput!): String
    addToCollection(input: AddToCollectionInput!): String!
    removeFromCollection(input: AddToCollectionInput!): String!

    createPost(input: CreatePostInput!): String!
    editPost(input: EditPostInput!): String!
    createComment(input: CreateCommentInput!): String!

    editPlace(input: EditPlaceInput!): String!
  }

  input EditPlaceInput {
    id: Int!
    name: String
    description: String
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

  input CommentsInput {
    targetID: Int
    "ASC | DESC"
    sort: String
    "popularity | createdAt"
    sortBy: String
    skip: Int
    take: Int
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
    tags: [String!]
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
    collectionId: Int
  }

  input PostsInput {
    filter: PostsFilter
    " asc | desc // default is asc"
    sort: String
    " id | createdAt | likeCount | commentsCount | distance"
    sortBy: String
  }

  input PersonalizedPostsInput {
    skip: Int!
    take: Int!
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
    preview: Photo
    icon: String
    posts: [Post!]!
    nearbyPlaces: [NearbyPlaces]!
    distance: Float
    years: [Int!]!
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
    id: Float!
  }

  type Post {
    createdAt: Float!
    description: String
    hashtags: [Hashtag]
    id: Int!
    author: User!
    likes: [User!]!
    likeCount: Int!
    commentCount: Int!
    photos: [Photo!]!
    liked: Boolean!
    place: Place!
    comments: [Comment]!
    nsfw: Boolean!

    startDay: Int
    startMonth: Int
    startYear: Int!

    endDay: Int
    endMonth: Int
    endYear: Int!
    years: [Int!]!
  }

  type CommentTarget {
    id: Int!
  }

  type Comment {
    id: Int!
    createdAt: Float!
    content: String!
    liked: Boolean!
    author: User!
    target: CommentTarget!
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
    tags: [String!]
    latitude: Float
    longitude: Float
    placeID: Int
    photo: [Upload!]!

    startDay: Int
    startMonth: Int
    startYear: Int!

    endDay: Int
    endMonth: Int
    endYear: Int!
  }

  input EditPostInput {
    id: Int!
    nsfw: Boolean
    description: String
    hashtags: [String!]
    latitude: Float
    longitude: Float
    placeID: Int
    startDay: Int
    startMonth: Int
    startYear: Int
    endDay: Int
    endMonth: Int
    endYear: Int
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

  input DeleteUserInput {
    username: String!
    password: String!
  }

  input CreateCollectionInput {
    name: String!
    description: String
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
    lastName: String
    bio: String
    profile: String!
    verified: Boolean!
    createdAt: Float!
    isFollowing: Boolean!
    followerCount: Int!
    followingCount: Int!
    postCount: Int!
    id: Float!
    isAdmin: Boolean!
    hasPassword: Boolean!
    following: [User!]
    followers: [User!]
    collections: [Collection]
    posts: [Post!]!
    locale: String
    notificationSettings: NotificationsSettings!
  }

  type User {
    username: String!
    email: String!
    firstName: String!
    lastName: String
    bio: String
    profile: String!
    verified: Boolean!
    createdAt: Float!
    isFollowing: Boolean!
    followerCount: Int!
    followingCount: Int!
    postCount: Int!
    id: Float!
    following: [User!]!
    followers: [User!]!
    collections: [Collection]
    posts: [Post!]!
  }

  type Collection {
    id: Float!
    createdAt: Float!
    description: String
    name: String!
    preview: String
    postCount: Int!
    author: User!
    posts: [Post!]!
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
    lastName: String
    password: String!
    locale: String
  }
`;
