const mongoose = require('mongoose');

async function mongoConnect()
{
    await mongoose.connect("mongodb://localhost:27017/danmachi", {useNewUrlParser : true, useUnifiedTopology : true})
    .then(() =>{return;})
    .catch(e=>console.log(e));
}

async function mongoDisconnect()
{
    await mongoose.disconnect();
}

async function getGuildData (gld) 
{
	let res = await Guild.findById(gld.id);
	if(res == null)
	{
		res = await createGuildData(gld);
	}
	return res;
}