namespace SnpWebApp.Data.DTO
{
    public class SectorTopDTO
    {
        public string Sector { get; set; }
        public List<StockJoinDTO> Top20 { get; set; }
        public List<StockJoinDTO> Bot20 {  get; set; }
    }
}
