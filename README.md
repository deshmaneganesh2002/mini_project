BlogWave – Blogging  API

Blogwave is a RESTful API that allows users to register, log in, and manage their personal blogs . Each blog is linked to the user who added it.
Also providing like feature to like..


# we use this technologies

 Node.js + Express
 MongoDB + Mongoose
 JWT for -authentication
 bcrypt for password hashing
 cookie-parser for session handling


# Testing Posman 
*user
1)Register a new user -> Post/register
2)Login user -> POST/login
3)Lgout user -> POST/logout

*blogs
1)add a new book -> POST/post
2)view all user books -> GET/allposts
3)update a book by ID -> POST/update/:id
4)delete a book by ID -> POST/books/:id
