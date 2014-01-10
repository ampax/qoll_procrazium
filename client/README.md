Client package -
=================

Package information - 
----------------------

The client package hosts everything that runs on client and that will be exposed to the client. Any code that exposes security concerns must not be put in this package. Read further to understand where that code will go.

The package structure looks like the following - 
```
client--
		|
		 ---lib
		|
		|
		 ---stylesheets
		|
		|
		 ---views
		|
		|
		 ---index.html
		|
		 ---index.js
```

> lib - All the client side code which will be commonly referred to by views will be kept in client/lib. 

> client/lib/accounts package keeps login calls for different providers - facebook, git, google, twitter, etcetera. New account verification/validation calls will be further added to this package. 

> client/lib/chart package will keep chart supporting code to support chart generation. The vew code must be made independent of the type of chart it uses, so that we can switch from one chart supporting API to another tomorrow. For instance, today, we are using chartjs to generate our donut chart. Since chartjs is not complete-chartint-solution, to be used out-of-the-box, we will move to one of googlecharts, highcharts in future; and also use inline-chart. Proper way to add chart to our application will be by writing a template for each of the chart types, and then adding the respective template in the display page.

> client/lib/meteor package keeps meteor specific code on which the client side models depend. Currently this package hosts routers. We are using the latest iron-router package of meteor-atmospehere collection for our routing capabilities. The routers will manage the pre-page-load dependencies.

> stylesheets - if you want qoll to load .css or .less styles for models, put those in this package. stylesheets put in this package are loaded before the views are loaded. This will ensure that the styles are rendered on the pages properly.