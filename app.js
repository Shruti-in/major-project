if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require('./models/user.js');



//requiring files(of route directory)
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;

// --- Mongoose Connection ---
main()
    .then(() => {
        console.log("Connected to DB successfully");
    })
    .catch(err => {
        console.error("Database connection error:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

// --- Express Configuration ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json()); // For JSON data (less common for forms, but good to have)

app.use(methodOverride('_method')); // For PUT/DELETE requests from forms
app.engine("ejs", ejsMate); // EJS Mate for layouts

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("error in session store",err);
});


const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true

    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"stu@gmail.com",
//         username:"sigma-stu"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




// Catch-all for 404 Not Found - MUST be after all other routes
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });



// Global Error Handling Middleware - MUST be the last middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
    console.error("Global Error Handler:", err); // Log the full error for debugging
});

// --- Start Server ---
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});


