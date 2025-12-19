'user strcit';
var fs = require('fs')
module.exports = (app,db) => {
    //https://github.com/BRIKEV/express-jsdoc-swagger
    //Get all the beers available for ordering
    /**
     * GET /v1/order
     * @summary Use to list all available beer(Excessive Data Exposure)(PII Exposure/Oversharing)
     * @tags beer
     * @return {array<Beer>} 200 - success response - application/json
     */
    app.get('/v1/order', (req,res) =>{
        db.beer.findAll({include: "users"})
            .then(beer => {
                res.json(beer);
            });
    });
    /**
     * GET /v1/beer-pic/
     * @summary Get a picture of a beer (Path Traversal)
     * @note http://localhost:5000/v1/beer-pic/?picture=../.env
     * @param {string} picture.query.required picture identifier
     * @tags beer
     */
     app.get('/v1/beer-pic/', (req,res) =>{
            var filename = req.query.picture,
            filePath = `../../../uploads/${filename}`;
            const path=require('path')
            //console.log(__dirname)
            //console.log(path.dirname(filePath))

            //path.normalize(filePath)
            fs.readFile(path.join(__dirname, filePath),function(err,data){
                if (err){
                    res.send("error")
                }else{
                    if(filename.split('.').length == 1)
                    {
                        res.type('image/jpeg')
                        //res.set('Content-Type', 'image/jpg');
                        res.send(data)
                        return;
                }
                let buffer = Buffer.from(data, 'utf8');
                res.send(buffer)
                    
                }
                
            })

        
    });
        /**
     * GET /v1/search/{filter}/{query}
     * @summary Search for a specific beer (SQL Injection)
     * @description sqlmap -u 'http://localhost:5000/search/id/2*'
     * @tags beer
     * @param {string} query.path - the query to search for
     * @param {string} filter.path - the column
     * @return {array<Beer>} 200 - success response - application/json
     */
const { Op } = require('sequelize');

app.get('/v1/search/:filter/:query', async (req, res) => {
    try {
        const filter = req.params.filter;
        const query = req.params.query;

        // Allowlist for safe columns
        const allowedFilters = ['name', 'currency', 'stock', 'price', 'id'];
        if (!allowedFilters.includes(filter)) {
            return res.status(400).json({ error: "Invalid filter field" });
        }

        const whereClause = {};
        whereClause[filter] = { [Op.like]: `%${query}%` };

        const beers = await db.beer.findAll({ where: whereClause });

        res.status(200).json(beers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed" });
    }
});

};