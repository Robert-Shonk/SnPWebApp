namespace SnpWebApp.Data.DTO
{
    public class SnpDTO
    {
        public string ExchangeUrl { get; set; } = null!;

        public string Symbol { get; set; } = null!;

        public string Security { get; set; } = null!;

        public string Sector { get; set; } = null!;

        public string SubIndustry { get; set; } = null!;

        public string HqLocation { get; set; } = null!;

        public DateOnly DateAdded { get; set; }

        public int Cik { get; set; }

        public string Founded { get; set; } = null!;
    }
}
