A website that will display charts and tables of up-to-date data of stocks that are currently on the S&P500.

Data is scraped and stored into a Sqlite database using Python. These scripts are in my other repo, SnP.

The data is made available and updated through a rest API built with ASP.NET Core.

The website is built for mobile and widescreens.

Tools used:
* Backend: C# and ASP.NET Core 

* Front end:
    * Chart.js for the charts
    * Plain javascript, html, and css

![Mobile stocks](/SnPWebApp/wwwroot/assets/screenshots/mysnp500_stocks_mob.png) ![Mobile sectors](/SnPWebApp/wwwroot/assets/screenshots/mysnp500_sectors_mob.png)

![Wide stocks](/SnPWebApp/wwwroot/assets/screenshots/mysnp500_stocks.png)

![Wide sectors](/SnPWebApp/wwwroot/assets/screenshots/mysnp500_sectors.png)