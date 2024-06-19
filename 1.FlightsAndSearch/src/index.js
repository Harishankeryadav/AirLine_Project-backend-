const express = require("express");
const bodyParser = require("body-parser");

const  {PORT}  = require("./config/serverconfig.js");
const ApiRoutes = require('./routes/index');

const{Airport, City} = require('./models/index.js');
const {Airplane} = require('./models/index.js');
const db = require('./models/city')

const CityRepository = require(('./repository/City_repository.js'))

const setupAndStartServer = async () => {

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api',ApiRoutes);

    app.listen(PORT, async () => {
        
        console.log(`server started at ${PORT}`);
        // const repo = new CityRepository();
        // repo.createCity({ name: "e" });
        // const city = await City.findOne({
        //     where:{
        //         id:9
        //     }
        // });
        // const airports  = await city.getAirports();
        // console.log(city, airports);

        // if(process.env.SYNC_DB){
        //     db.sequelize.sync({alter:true});
        // }
        // await Airplane.create({
        //     modelNumber: "Fly Emirates",
        //     // capacity:333
        // });
    });
}

setupAndStartServer();
