const jwt = require('jsonwebtoken');



function isLoggedIn(req,res,next){
    if (!req.cookies.token) {
        return res.redirect("/login");
    }

   try {
        // 2. Attempt to verify the token. 
        // If the token is invalid or expired, the code jumps to the 'catch' block.
        const data = jwt.verify(req.cookies.token, "abcdefg");

        // 3. Success: Attach the verified payload to req.user and proceed.
        // This is the CRITICAL step that prevents the TypeError in your route.
        req.user = data; 
        // console.log("Authenticated User Data:", req.user);
        
        next();

    } catch (err) {
        // 4. Failure: If token verification fails (expired/invalid), 
        // we clear the bad cookie and redirect the user.
        console.error("Authentication failed:", err.message);
        
        // Ensure the bad cookie is removed from the browser
        res.clearCookie('token'); // Use the actual name of your cookie!
        
        return res.redirect("/login");
    }

}

module.exports=isLoggedIn;