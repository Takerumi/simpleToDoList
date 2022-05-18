# simpleToDoList

A fairly simple to-do list implemented with Express, EJS, MongoDB.

![image](https://user-images.githubusercontent.com/63417290/168827820-c3ce027e-7c07-46c0-8bf4-76fb7075fc38.png)

[LIVE DEMO](https://borman-todoapp-v2.herokuapp.com/)

The application can be run locally or deployed to a cloud platform.

<hr>

## Database setup

For correct work with the database, you must specify the URI for connecting to MongoDB in the DB_HOST variable. URI is generated when you create a cluster in MongoDB Atlas, your link may be slightly different.

- running locally, you need to create an .env file in the root folder of the project, in which you specify DB_HOST=<URI> variable. It should look like this:
    `DB_HOST=mongodb+srv://<username>:<password>@cluster0.fuyhw.mongodb.net/toDoListDB`
    
- using cloud platforms, you need to set a variable in configuration. Example: 
    `heroku config:set DB_HOST=mongodb+srv://<username>:<password>@cluster0.fuyhw.mongodb.net/toDoListDB`
    
<hr>

## Support for multiple custom lists
    
To create a custom list, you need to add /<list name> to the end of the URL
    `http://localhost:3000/work`
    or
    `https://borman-todoapp-v2.herokuapp.com/shop`
 
In this case, application will create a new list in DB with the name taken from the routing parameters object
    
![image](https://user-images.githubusercontent.com/63417290/168832979-08a8089f-77b2-4b7a-93cb-8d408d58e184.png)

 
    
