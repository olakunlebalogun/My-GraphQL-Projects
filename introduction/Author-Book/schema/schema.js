const graphql = require("graphql");
const _ = require("lodash");
const Book = require("./../models/book");
const Author = require("./../models/author");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

// const books = [
// 	{ id: "1", name: "12 Rules for Life", genre: "fiction", authorId: "2" },
// 	{
// 		id: "2",
// 		name: "Attitude 101",
// 		genre: "fiction",
// 		authorId: "3",
// 	},
// 	{ id: "3", name: "5am Club", genre: "history", authorId: "1" },
// 	{ id: "4", name: "Maps of Meaning", genre: "history", authorId: "2" },
// 	{
// 		id: "5",
// 		name: "The Monk who sold his Ferrari",
// 		genre: "history",
// 		authorId: "1",
// 	},
// 	{
// 		id: "6",
// 		name: "17 irrefutable laws of Leadership",
// 		genre: "history",
// 		authorId: "3",
// 	},
// ];

// const authors = [
// 	{ id: "1", name: "Robin Sharma", age: 50 },
// 	{ id: "2", name: "Jordan Perterson", age: 53 },
// 	{ id: "3", name: "John Maxwell", age: 51 },
// ];

const BookType = new GraphQLObjectType({
	name: "Book",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				console.log(parent);
				// return _.find(authors, { id: parent.authorId });
				return Author.findById(parent.authorId);
			},
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: graphql.GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return _.filter(books, { authorId: parent.id });
				return Book.find({ authorId: parent.id });
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return _.find(books, { id: args.id });
				return Book.findById(args.id);
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return _.find(authors, { id: args.id });
				return Author.findById(args.id);
			},
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return books;
				return Book.find({});
			},
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				// return authors;
				return Author.find({});
			},
		},
	},
});
// new GraphQLNonNull(GraphQLString)

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: GraphQLString },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name,
					age: args.age,
				});
				return author.save();
			},
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: GraphQLString },
				genre: { type: GraphQLString },
				authorId: { type: GraphQLString },
			},
			resolve(parent, args) {
				const { name, genre, authorId } = args;
				let book = new Book({ name, genre, authorId });
				return book.save();
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
