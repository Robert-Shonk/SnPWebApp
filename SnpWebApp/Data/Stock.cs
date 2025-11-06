using System;
using System.Collections.Generic;

namespace SnpWebApp.Data;

public partial class Stock
{
    public int Id { get; set; }

    public string Symbol { get; set; } = null!;

    public DateOnly Date { get; set; }

    public double Open { get; set; }

    public double High { get; set; }

    public double Low { get; set; }

    public double Close { get; set; }

    public int Volume { get; set; }
}
