import * as functions from 'firebase-functions';
import * as firebaseAdmin from 'firebase-admin';
import server from './graphql/server';

const express = require('express');

firebaseAdmin.initializeApp();

const app = express();

server.applyMiddleware({ app, path: '/', cors: true });

const graphql = functions.https.onRequest(app);

export { graphql };
