const express = require('express'); 

const app = express(); 

const PORT = process.env.PORT || 5001; 

const connectDB = require('./config/db');  

const userRouter = require('./routes/api/users'); 
const auth = require('./routes/api/auth'); 
const profileRouter = require('./routes/api/profiles'); 
const articleRouter = require('./routes/api/articles'); 
const commentRouter = require('./routes/api/comment'); 
const tagRouter = require('./routes/api/tag'); 

app.use(express.json()); 
userRouter.use('/login', auth);
app.use('/api/users' , userRouter); 
app.use('/api/profiles', profileRouter); 
app.use('/api/articles', articleRouter);
articleRouter.use('/:slug/comments', commentRouter); 
app.use('/api/tags', tagRouter);
//connect to mongoDB
connectDB(); 

app.get('/', () => {
    console.log('API running');
    
})

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
})