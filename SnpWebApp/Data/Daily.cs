using System;
using System.Collections.Generic;

namespace SnpWebApp.Data;

public partial class Daily
{
    public int Id { get; set; }

    public double Points { get; set; }

    public double Change { get; set; }

    public double Move { get; set; }

    public string Date { get; set; } = null!;
}
