var express =require('express')
var graphqlHttp = require('express-graphql').graphqlHTTP
var graphql = require('graphql')
var { buildSchema } = graphql;

let toDoList = [
    {
        id : 1,
        title : "module 7",
        active : true,
        author : {
            name : "Arun",
            age  : 20
        }
    },
    {
        id : 2,
        title : "module 8",
        active : false,
        author : {
            name : "Arun",
            age  : 20
        }
    }
];


const schema = new buildSchema(`
    type Query{
        getToDoList : [ToDo]
        getToDo(id : Int!) :ToDo
    }

    input ToDoLists {
        id     : Int!
        title  : String!
        author : AuthorDetails
        active : Boolean!
    }

    input AuthorDetails {
        name : String!
        age  : Int!
    }

    type Mutation {
        createToDo(toDo : ToDoLists, author : AuthorDetails) : [ToDo]
        updateToDo(id : Int, toDo : ToDoLists, author : AuthorDetails) : ToDo
        deleteToDo(id : Int) : String
    }

    type ToDo {
        id     : Int
        title  : String
        author : Author
        active : Boolean
    }

    type Author {
        name : String
        age  : Int
    }
`)

const getAllToDoList =()=>{
    return toDoList
};


const getToDoById = (arg)=>{
    let data=arg.id
    let toDo =toDoList.filter(val=>val.id===data)[0]
      return toDo;
  };
const createToDoList = ({toDo,author})=>{
    console.log(toDo,author);
    let length = toDoList.length+1;
    toDoList[length]=toDo;
    toDoList[length].author=author;

    return toDoList;

}

const updateToDoList = ({id,toDo,author})=>{
    console.log(id,toDo,author);
    toDoList.filter(data=>{
        if(data.id===id){
            data.title=toDo.title;
            data.active=toDo.active;
            data.author.name=author.name;
            data.author.age=author.age;
            return data
        }
    })
    return toDoList.filter(toDo=>toDo.id===id)[0];

     
};

const deleteToDoList = (id)=>{
    let output = toDoList.filter(data=>{
        if(data.id!==id.id){
            return data;
        }   
    })
    console.log(output);
    toDoList= output;
    return "Success"
}

const root = {
    getToDoList : getAllToDoList,
    getToDo     : getToDoById,
    createToDo  : createToDoList,
    updateToDo  : updateToDoList,
    deleteToDo  : deleteToDoList
}

const app = express()

app.use('/graphql', graphqlHttp({
    schema    : schema,
    rootValue : root,
    graphiql  : true

}))

app.listen(5000, ()=>{
    console.log("App is listening")
});




//get
// {
//     getToDo(id: 2) {
//       id
//       title
//       author{
//         name
//         age
//       }
//       active
//     }
//   }

//getAll
// {
//     getToDoList {
//       id
//       title
//       author{
//         name
//         age
//       }
//       active
//     }
//   }