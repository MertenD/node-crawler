# Welcome to Node‐Crawler's Wiki!

Welcome to the official wiki page of the Node-Crawler repository. This is your go-to resource for understanding and using this tool. Node-Crawler is a powerful, flexible, and easy-to-use web crawler, with a node-based editing system built on top of [Next.js](https://nextjs.org/) and [React Flow](https://reactflow.dev/).

Here you'll find detailed documentation about each of the functionalities of this application and guides on how to extend the application to help you make the most out of Node-Crawler.

## About Node-Crawler

Node-Crawler is a highly customizable, Node-based web application for creating web crawlers and further processing and transforming the retrieved data. Users can build tailor-made web crawlers and manipulate and transform the collected data as needed. The output data format can be set to a wide range of formats including JSON, CSV, and various database formats.

![](https://raw.githubusercontent.com/MertenD/node-crawler/master/public/node-crawler-overview-canvas.png)
![](https://raw.githubusercontent.com/MertenD/node-crawler/master/public/node-crawler-overview-output.png)

## Project Goals and Use Cases

- **Node-based Editing**: Users can create and edit their own crawler workflows by drag-and-dropping nodes.
- **Data Transformation**: The application supports a variety of data manipulation and transformation operations for cleaning and restructuring the gathered data.
- **Data Export**: The transformed data can be output in a variety of formats including JSON, CSV, and various database formats.


## Installation Guide

Make sure you have [Node.js](https://nodejs.org/en) and npm installed on your system before you start.

1. Clone the repository:

```shell
git clone https://github.com/MertenD/node-crawler.git
```

2. Navigate into the directory and install the dependencies:

```shell
cd node-crawler
npm install
```

3. Start the development server:

```shell
npm run dev
```

Now you should be able to see the web application on `http://localhost:3000` in your browser.
