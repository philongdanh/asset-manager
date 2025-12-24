export class GetUserActivitySummaryQuery {
  constructor(
    public readonly userId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {}
}
