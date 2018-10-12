'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const Queue = require('./queue');

let catQueue = new Queue();
let dogQueue = new Queue();

const catData = [
  {
    imageURL:'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg', 
    imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
    name: 'Fluffy',
    sex: 'Female',
    age: 2,
    breed: 'Bengal',
    story: 'Thrown on the street'
  },
  {
    imageURL:'/images/closecall.jpg', 
    imageDescription: 'Mixed cat being eaten by a stuffed shark.',
    name: 'Close Call',
    sex: 'Male',
    age: 3,
    breed: 'Mixed',
    story: 'Nearly got eaten by a shark. Lost it`s tail. He`s considered an OG on the block.'
  },
  {
    imageURL:'/images/bob.jpg', 
    imageDescription: 'Mixed cat with a melon on its head',
    name: 'Bob',
    sex: 'Female',
    age: 4,
    breed: 'Mixed',
    story: 'Bob was found roaming a farmer`s market with a melon bob. She`s got a lot of attitude.'
  },
  {
    imageURL:'/images/moses.jpg', 
    imageDescription: 'Mixed cat looking surprised ',
    name: 'Moses',
    sex: 'Male',
    age: 2,
    breed: 'Mixed',
    story: 'Found outside a local church. Claims to speak God.'
  },
  {
    imageURL:'/images/robertdeniro.jpg', 
    imageDescription: 'Grumpy looking snowshoe cat with brown and white fur.',
    name: 'Robert De Niro',
    sex: 'Male',
    age: 2,
    breed: 'Snowshoe',
    story: 'Brought in by the Italian Mob. He`s never happy.'
  }

];

catData.forEach(cat => {
  catQueue.enqueue(cat);
});

const dogData = [
  {
    imageURL: 'http://www.dogster.com/wp-content/uploads/2015/05/Cute%20dog%20listening%20to%20music%201_1.jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'Zeus',
    sex: 'Male',
    age: 3,
    breed: 'Golden Retriever',
    story: 'Owner Passed away'
  },
  {
    imageURL: '/images/mrbubz.jpg',
    imageDescription: 'A snarling dog with white and brown fur.',
    name: 'Mr.Bubz',
    sex: 'Male',
    age: 0,
    breed: 'Unknown',
    story: 'Mr.Bubz walked in on his own accord. He might be an alien.'
  },
  {
    imageURL: '/images/spike.jpg',
    imageDescription: 'A grey, white-bellied Pitbull standing on two feet.',
    name: 'Spike',
    sex: 'Male',
    age: 5,
    breed: 'Pitbull',
    story: 'Caught by animal services for chasing alley cats. He`s a grown man.'
  },
  {
    imageURL: '/images/elastigirl.jpg',
    imageDescription: 'A grey and white Pitbull with tongue wrapped around face.',
    name: 'Elastigirl',
    sex: 'Female',
    age: 7,
    breed: 'Pitbull',
    story: 'Elastigirl thinks she`s a frog. Found her abandoned by a pond trying to eat flies.'
  }, 
  {
    imageURL: '/images/lush.jpg',
    imageDescription: 'A snarling white and brown fur dog.',
    name: 'Lush',
    sex: 'Female',
    age: 3,
    breed: 'Mixed breed',
    story: 'Found drinking leftover momosas at a local outdoor bar. Known alcoholic looking for a family that likes to have a good time. Makes a great Moscow Mule.'
  }
];

dogData.forEach(dog => {
  dogQueue.enqueue(dog);
});

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/cat', (req, res, next) => {
  res.json(catQueue.peek());
});

app.get('/api/dog', (req, res, next) => {
  res.json(dogQueue.peek());
});

app.delete('/api/cat', (req, res, next) => {
  catQueue.dequeue();
  res.sendStatus(204);
});

app.delete('/api/dog', (req, res, next) => {
  dogQueue.dequeue();
  res.sendStatus(204);
});



function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
