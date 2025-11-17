using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SnpWebApp.Data;

public partial class SnpDbContext : DbContext
{
    public SnpDbContext()
    {
    }

    public SnpDbContext(DbContextOptions<SnpDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Daily> Dailies { get; set; }

    public virtual DbSet<Snp> Snps { get; set; }

    public virtual DbSet<Stock> Stocks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Daily>(entity =>
        {
            entity.ToTable("daily");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Change).HasColumnName("change");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Move).HasColumnName("move");
            entity.Property(e => e.Points).HasColumnName("points");
        });

        modelBuilder.Entity<Snp>(entity =>
        {
            entity.ToTable("snp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Cik).HasColumnName("CIK");
            entity.Property(e => e.DateAdded).HasColumnName("date_added");
            entity.Property(e => e.ExchangeUrl).HasColumnName("exchange_url");
            entity.Property(e => e.Founded).HasColumnName("founded");
            entity.Property(e => e.HqLocation).HasColumnName("hq_location");
            entity.Property(e => e.Sector).HasColumnName("sector");
            entity.Property(e => e.Security).HasColumnName("security");
            entity.Property(e => e.SubIndustry).HasColumnName("sub_industry");
            entity.Property(e => e.Symbol).HasColumnName("symbol");
        });

        modelBuilder.Entity<Stock>(entity =>
        {
            entity.ToTable("stock");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Close).HasColumnName("close");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.High).HasColumnName("high");
            entity.Property(e => e.Low).HasColumnName("low");
            entity.Property(e => e.Move).HasColumnName("move");
            entity.Property(e => e.Open).HasColumnName("open");
            entity.Property(e => e.Symbol).HasColumnName("symbol");
            entity.Property(e => e.Volume).HasColumnName("volume");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
