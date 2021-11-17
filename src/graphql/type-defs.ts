import { gql } from '@apollo/client';

export default gql`
  scalar Upload

  type Query {
    hello: String!
    user(input: UserInput!): User!
    post(id: Int!): Post!
    mapPosts(input: MapPostsInput!): [MapPost]!
    suggestedUsers: [User]!
    tag(label: String!): TagInfo
    paths: [Path]
    isLogged: UserInfoMinimal
    userPosts(input: UserPostsInput!): [Post]
    personalizedPosts: [PostID]!
    checkIfLogged: CheckIfLoggedInfo!
    place(id: Int!): Place!
  }

  type Mutation {
    deleteUser(input: DeleteUserInput!): String!
    delete(id: Int!): String
    like(input: LikeInput!): String
    unlike(id: Int!): String
    follow(userID: Int!): String
    unfollow(userID: Int!): String
    createCollection(input: CreateCollectionInput!): String!
    updateProfile(input: UpdateProfileInput!): String!
    createPost(input: CreatePostInput!): String!
    login(input: LoginInput!): String!
    searchUser(input: SearchUserInput!): String!
    createUser(input: CreateUserInput!): String!
    verifyToken(token: String!): String!
    createComment(input: CreateCommentInput!): String!
    report(input: ReportInput!): String!
  }

  input ReportInput {
    id: Int!
  }

  input CreateCommentInput {
    target: Int!
    content: String!
  }

  type Place {
    id: Int!
    latitude: Float!
    longitude: Float!
    description: String!
    name: String!
    preview: String!
    icon: String
    posts: [Post]!
    nearbyPlaces: [NearbyPlaces]!
  }

  type NearbyPlaces {
    id: Int!
    description: String!
    name: String!
    preview: String!
    distance: Float!
  }

  type CheckIfLoggedInfo {
    logged: Boolean!
    verified: Boolean
  }

  input MapPostsInput {
    minLatitude: Float!
    maxLatitude: Float!
    minLongitude: Float!
    maxLongitude: Float!
    minDate: Float
    maxDate: Float
  }

  type MapPost {
    id: Int!
    latitude: Float!
    longitude: Float!
    icon: String
    posts: [Post]!
  }

  type Post {
    createdAt: Float!
    postDate: Float!
    description: String
    hashtags: [Hashtag]
    url: [String!]!
    id: Int!
    author: UserInfoMinimal!
    likes: [UserInfoMinimal]!
    liked: Boolean!
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
    collectionName: String!
    description: String
  }

  type IsLoggedInfo {
    isLogged: Boolean!
    userID: String
  }

  type Path {
    name: String!
    coordinates: String!
  }

  type User {
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    bio: String
    verified: String!
    createdAt: Float!
    isFollowing: Boolean!
    id: Float!
    following: [UserInfoMinimal]
    followers: [UserInfoMinimal]
    collections: [Collection]
    posts: [PostInfoNew]
  }

  type PostInfoNew {
    id: Float!
    url: String!
    description: String
  }

  type PostID {
    id: Int!
  }

  type UserInfoMinimal {
    id: Float!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Collection {
    createdAt: String!
    description: String
    collectionName: String!
  }

  type TagInfo {
    label: String!
    numberOfPosts: Int!
    numberOfUniqueUsers: Int!
    oldestPostDate: String!
    newestPostDate: String!
    topPosts: [Post]
    posts: [Post]
  }

  input UserInput {
    username: String
    id: Int
  }

  input SearchUserInput {
    username: String!
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
  }
`;
