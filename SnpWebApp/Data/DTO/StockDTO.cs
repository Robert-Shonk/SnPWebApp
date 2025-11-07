namespace SnpWebApp.Data.DTO
{
    public class StockDTO
    {
        public string Symbol { get; set; } = null!;

        public DateOnly Date { get; set; }

        public double Open { get; set; }

        public double High { get; set; }

        public double Low { get; set; }

        public double Close { get; set; }

        public int Volume { get; set; }
        
        public double Move { get; set; }
    }
}
