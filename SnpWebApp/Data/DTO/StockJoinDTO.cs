namespace SnpWebApp.Data.DTO
{
    public class StockJoinDTO
    {
        public string Symbol { get; set; }
        public string Security {  get; set; }
        public string Sector { get; set; }
        public DateOnly Date {  get; set; }
        public double Close {  get; set; }
        public double Move {  get; set; }
    }
}
