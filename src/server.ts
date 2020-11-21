require('dotenv').config();
import express from "express";
import * as yelp from "yelp-fusion";

const app = express();
const client = yelp.client(process.env.YELP_API_KEY);

app.get("/shops", (req, res) => {
    const searchRequest = {
        term: 'ice cream shop',
        location: 'Redwood City',
        limit: 10,
        sort_by: 'rating'
    };
    client.search(searchRequest).then(response => {
        res.json(response.jsonBody.businesses);
    }).catch(e => {
        console.error(e);
    });
});


app.get("/reviews/:shopId", (req, res) => {
    client.reviews(req.params.shopId).then(response => {
        res.json(response.jsonBody.reviews);
    }).catch(e => {
        console.error(e);
    });
});


app.get("/shopsWithReviews", async (req, res) => {

    const searchRequest = {
        term: 'ice cream shop',
        location: 'Redwood City',
        limit: 10,
        sort_by: 'rating'
    };
    const businesses: Array<any> = await client.search(searchRequest).then(response => response.jsonBody.businesses).catch(console.error);
    for (const business of businesses) {
        business.reviews = await client.reviews(business.id).then(response => response.jsonBody.reviews).catch(console.error);
    }
    res.json(businesses);
});

app.listen(Number(process.env.PORT), process.env.HOST, () => {
    return console.log(`server is listening on ${process.env.PORT}`);
});

