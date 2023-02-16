const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(() => {
    console.log(`connection successfull`);
}).catch((e) => {
    console.log(`not connect`);
})
