import express from "express";
import methodOverride from 'method-override';


const app= express();
const port=3000;
var nextId=1;
var blogs=[];


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get("/", (req,res)=>{
    res.render("blogs.ejs", {blogs});
});

app.get("/Edit/:id", (req,res)=>{
    var blogid= parseInt(req.params.id,10);
    var blog=blogs.find(b=>b.id===blogid);
    if (blog) {
        res.render("edit.ejs", { blog });
    } else {
        res.status(404).send("Blog not found");
    }
});

app.get("/Post", (req,res)=>{
    res.render("post.ejs");
});

app.post("/submit", (req, res) => {
    var date=new Date().toJSON().slice(0, 10);
    var time= new Date().toLocaleTimeString('en-US');
    var {title, content}= req.body;
    var newBlog= {id:nextId++, title, content, date, time}
    blogs.push(newBlog);
    res.redirect("/");
  
});

app.get("/blogwriting/:id",(req,res)=>{
    var blogid= parseInt(req.params.id,10);
    var blog=blogs.find(b=>b.id===blogid);
    if (blog) {
        res.render("blogwriting.ejs", { blog });
    } else {
        res.status(404).send("Blog not found");
    }
});

app.patch("/Edit/:id",(req,res)=>{
    var blogid=req.params.id*1; //for it to be a number since id has a string value in blogs
    var blogToUpdate=blogs.find(b=>b.id===blogid); //returns blog object if found
    //var blogIndex= blogs.indexOf(blogToUpdate);

    //const updatedBlogObject= Object.assign(blogToUpdate, req.body); //merges old object with updated object
    //blogs[blogIndex]=blogToUpdate;

    if (blogToUpdate) {
        // Update the blog object with the new data from the request body
        Object.assign(blogToUpdate, req.body);
        // Redirect to the blog's page to see the updated content
        res.redirect(`/blogwriting/${blogid}`);
    } else {
        res.status(404).send("Blog not found");
    }
});

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})