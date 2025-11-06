using System;
using System.Collections.Generic;

namespace SnpWebApp.Data;

public partial class Snp
{
    public int Id { get; set; }

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
