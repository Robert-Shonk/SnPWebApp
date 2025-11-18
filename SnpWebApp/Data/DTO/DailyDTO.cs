namespace SnpWebApp.Data.DTO
{
    public class DailyDTO
    {
        public double Points { get; set; }

        public double Change { get; set; }

        public double Move { get; set; }

        public string Date { get; set; } = null!;
    }
}
