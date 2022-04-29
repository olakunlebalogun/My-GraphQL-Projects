const app = require("express")();
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

// PORT
const PORT = 4500;
app.use(cors());

mongoose.connect(
	"mongodb://127.0.0.1:27017/graphql-db",
	() => {
		console.log("Database Connected!");
	},
	{
		useNewUrlParser: true,
	}
);

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);

app.listen(PORT, () => {
	console.log(`Listening at port ${PORT}`);
});
