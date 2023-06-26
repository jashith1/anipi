//configuration
const anibase = 'https://www3.gogoanimes.fi';
const searchRoute = '/search.html?keyword=';
const animeRoute = '/category/';

//server setup and imports
const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');
const cheerio = require('cheerio');

//server routes

//test route
app.get('/', (req, res) => {
	res.send('BANZAI');
});

//search route
app.get('/search', async (req, res) => {
	try {
		const data = [];
		const resUrl = anibase + searchRoute + req.query.keyword;
		const axiosData = await axios.get(resUrl);
		const htmlData = axiosData.data;
		const $ = cheerio.load(htmlData);
		$('.last_episodes .items li').each((index, el) => {
			const name = $(el).find('p.name a').text();
			const imgUrl = $(el).find('div.img a img').attr('src');
			const releaseDate = $(el).find('p.released').text().trim();
			data.push({ name: name, imgUrl: imgUrl, releaseDate: releaseDate });
		});
		if (data.length === 0) res.send('No results found');
		else res.send(data);
	} catch (err) {
		res.send(err);
	}
});

//get anime details
app.get('/anime', async (req, res) => {
	try {
		const resUrl = anibase + animeRoute + req.query.id;
		const axiosData = await axios.get(resUrl);
		const htmlData = axiosData.data;
		const $ = cheerio.load(htmlData);
		res.send(resUrl);
	} catch (err) {
		res.send(err);
	}
});

app.listen(port, () => {
	console.log('BANZAI');
});
