namespace SnpWebApp.Data.DTO
{
    public class StockAggDTO
    {
        public string Symbol { get; set; }
        public List<double> MonthlyMeans { get; set; }
        public List<double> MonthlyStds { get; set; }
    }
}
