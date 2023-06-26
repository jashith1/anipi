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
});

//get anime details
app.get('/anime', async (req, res) => {
	const resUrl = anibase + animeRoute + req.query.id;
	const axiosData = await axios.get(resUrl);
	const htmlData = axiosData.data;
	const $ = cheerio.load(htmlData);

	if ($('h1.entry-title').text() === 'Error 404') {
		const error = {};
		error.statusCode = 404;
		error.description = 'Anime not found';
		return res.send(error);
	}

	const data = {};

	const episodeCount = $('#episode_page li:last a').text().split('-')[1];

	const coverImageUrl = $('div.anime_info_body_bg img').attr('src');

	$('div.anime_info_body_bg p.type').each((index, el) => {
		let [infoType, infoData] = $(el).text().trim().split(':');
		infoData = infoData.trim();
		if (infoType === 'Genre') {
			data['genres'] = infoData.split(', ');
		} else {
			data[infoType] = infoData;
		}
	});

	data['episodeCount'] = episodeCount;
	data['imageUrl'] = coverImageUrl;
	res.send(data);
});

//get anime episodes
app.get('/watch', async (req, res) => {
	const resUrl = anibase + '/' + req.query.id + '-episode-' + req.query.episode;
	res.send(resUrl);
});

app.listen(port, () => {
	console.log('BANZAI');
});
