const jwt = require('jsonwebtoken');
var {Todos} = require('../models/todoModels');
var {Users} = require('../models/todoModels');
var bodyParser = require('body-parser');
const { model } = require('mongoose');
const {BadRequestError} = require('../errors/index')
const {UnAuthenticatedError} = require('../errors/index')


const login = async (req,res) =>{
    const {username, password} = req.body;
    //console.log(`un: '${username}', pw: '${password}'`);
    
    //check that un & pw not provided, return error response.
    if(!username || !password){
        throw new BadRequestError('Pls provide email and password');
    }

    //get account
    console.log(username);
    Users.find({ username: username},
        function(err, user){
            if(err){ throw err; } else {
                console.log(user[0]);
                if(user){
                    if(password != user[0].password){
                        console.log(`password fail > '${password}' != '${user[0].password}'`)
                        throw new UnAuthenticatedError('Failed when authenticating.');
                        //throw new BadRequestError('Missing Username or Password!');
                    } else { 
                        console.log('password is valid'); 
                    }
                }
            }
        });

        //const {username, email} = user;
        //email = user.email;
        var email = 'farid@email.com';

    const token = jwt.sign({email, username},process.env.JWT_SECRET,{expiresIn:'30d'});
    res.status(200).json({msg:'Login Success', token})
    
}

// REGISTER
const register = async(req, res) =>{
    var newuser = Users({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    newuser.save(function(err){
        if(err) throw err;
        res.send('Success (Register User)');

    });
 }

 const todo_AddUpdate = async(req, res) =>{
    //If ID exist, Do UPDTAE
    // req.user = {id,username} //sending id,uname to a user obj to request.
    if(req.body.id)
    {
        Todos.findByIdAndUpdate(req.body.id, {
            todo: req.body.todo, 
            isDone: req.body.isDone,
            hasAttachment: req.body.hasAttachment
        }, function(err){
            if(err) throw err;
            res.send('Success (Update)');
        });
    } else {
        var newToDo = Todos({
            //using username passed from the json token,
            username: req.user.username,
            todo: req.body.todo,
            isDone: req.body.isDone,
            hasAttachment: req.body.hasAttachment
        });
        newToDo.save(function(err){
            if(err) throw err;
            res.send('Success (Add)');
        });
    }
};

//GET TODOS
const todo_GetList = async (req,res) =>{
    Todos.find({ username: req.user.username },
        function(err, todos){
            if(err) throw err;
            res.send(todos);
        });
}    

//get single todo > pass todoID
//  get the record, then validate the user is the owner

const todo_GetSingle = async (req, res) =>{
    Todos.findById({ _id: req.params.id},
        function(err, todo){
            if(err) throw err;
                if(todo.username == req.user.username)
                    res.send(todo);
                else
                    throw new BadRequestError('You do not own this item');
        }); 
}

// delete todo > pass todo ID, 
//  but before delete, to validate that the user is the owner
const todo_Delete = async (req, res) =>{
   Todos.findById({ _id: req.body.id},
        function(err, todo){
            if(err) throw err;
                if(todo.username == req.user.username)
                    Todos.findByIdAndRemove({ _id: req.body.id},function(err) {
                        if (err) throw err;
                        res.send('Delete Success');
                    });
                else
                    throw new BadRequestError('You do not own this item');
        });
}





module.exports = {
    login, register,
    todo_AddUpdate,
    todo_GetList,
    todo_GetSingle,
    todo_Delete
}