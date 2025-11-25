Link: https://mysnp500-hvb6abetgadyheau.canadacentral-01.azurewebsites.net/

A website that displays charts and tables of up-to-date data of stocks that are currently on the S&P500.

Data is scraped and stored into a Sqlite database using Python. These scripts are in my other repo, SnP.

The data is made available and updated through a rest API built with ASP.NET Core.

The website is built for mobile and widescreens.

Tools used:
* Backend: 
    * C# and ASP.NET Core 
    * Sqlite

* Front end:
    * Chart.js for the charts
    * Plain javascript, html, and css

* Deployed to Azure.

![Mobile stocks](https://github.com/Robert-Shonk/SnPWebApp/blob/main/SnpWebApp/wwwroot/assets/screenshots/mysnp500_stocks_mob.png?raw=true) ![Mobile sectors](https://github.com/Robert-Shonk/SnPWebApp/blob/main/SnpWebApp/wwwroot/assets/screenshots/mysnp500_sectors_mob.png?raw=true)

![Wide stocks](https://github.com/Robert-Shonk/SnPWebApp/blob/main/SnpWebApp/wwwroot/assets/screenshots/mysnp500_stocks.png?raw=true)

![Wide sectors](https://github.com/Robert-Shonk/SnPWebApp/blob/main/SnpWebApp/wwwroot/assets/screenshots/mysnp500_sectors.png?raw=true)