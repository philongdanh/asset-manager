import {
    MaintenanceSchedule,
    MaintenanceType,
    MaintenanceStatus,
} from './maintenance-schedule.entity';

export const MAINTENANCE_SCHEDULE_REPOSITORY = Symbol(
    'MAINTENANCE_SCHEDULE_REPOSITORY',
);

export interface IMaintenanceScheduleRepository {
    // --- Query Methods ---

    findById(maintenanceId: string): Promise<MaintenanceSchedule | null>;

    findByAssetId(assetId: string): Promise<MaintenanceSchedule[]>;

    findAll(
        organizationId: string,
        options?: {
            assetId?: string;
            status?: MaintenanceStatus | MaintenanceStatus[];
            maintenanceType?: MaintenanceType | MaintenanceType[];
            startDate?: Date;
            endDate?: Date;
            performedByUserId?: string;
            search?: string;
            limit?: number;
            offset?: number;
            includeDeleted?: boolean;
        },
    ): Promise<{ data: MaintenanceSchedule[]; total: number }>;

    findUpcoming(
        organizationId: string,
        daysAhead: number,
    ): Promise<MaintenanceSchedule[]>;

    findOverdue(organizationId: string): Promise<MaintenanceSchedule[]>;

    findByStatus(
        organizationId: string,
        status: MaintenanceStatus,
    ): Promise<MaintenanceSchedule[]>;

    findByType(
        organizationId: string,
        maintenanceType: MaintenanceType,
    ): Promise<MaintenanceSchedule[]>;

    findByPerformer(performedByUserId: string): Promise<MaintenanceSchedule[]>;

    findCompletedInPeriod(
        organizationId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<MaintenanceSchedule[]>;

    // --- Validation Methods ---

    hasActiveMaintenance(assetId: string): Promise<boolean>;

    hasScheduledMaintenance(assetId: string, date: Date): Promise<boolean>;

    existsById(maintenanceId: string): Promise<boolean>;

    // --- Persistence Methods ---

    save(maintenance: MaintenanceSchedule): Promise<MaintenanceSchedule>;

    update(maintenance: MaintenanceSchedule): Promise<MaintenanceSchedule>;

    saveMany(maintenances: MaintenanceSchedule[]): Promise<void>;

    delete(maintenanceId: string): Promise<void>; // Soft delete

    deleteMany(maintenanceIds: string[]): Promise<void>; // Soft delete

    hardDelete(maintenanceId: string): Promise<void>;

    hardDeleteMany(maintenanceIds: string[]): Promise<void>;

    restore(maintenanceId: string): Promise<void>;

    restoreMany(maintenanceIds: string[]): Promise<void>;

    // --- Special Methods ---

    getMaintenanceSummary(organizationId: string): Promise<{
        totalCount: number;
        byStatus: Record<MaintenanceStatus, number>;
        byType: Record<MaintenanceType, number>;
        upcomingCount: number;
        overdueCount: number;
        totalEstimatedCost: number;
        totalActualCost: number;
    }>;

    getAssetMaintenanceHistory(assetId: string): Promise<MaintenanceSchedule[]>;

    getMaintenanceCostAnalysis(
        organizationId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<{
        totalCost: number;
        byType: Record<MaintenanceType, number>;
        byAsset: Record<string, number>;
        monthlyTrends: Array<{ month: string; cost: number; count: number }>;
    }>;

    findMaintenanceDueForReview(
        organizationId: string,
        daysThreshold: number,
    ): Promise<MaintenanceSchedule[]>;

    getMaintenanceFrequencyReport(
        organizationId: string,
        period: 'month' | 'quarter' | 'year',
    ): Promise<{
        period: string;
        totalMaintenances: number;
        byType: Record<MaintenanceType, number>;
        avgCompletionTime: number; // in days
        mostCommonIssues: Array<{ issue: string; count: number }>;
    }>;

    getMaintenanceBacklog(organizationId: string): Promise<{
        scheduled: number;
        inProgress: number;
        pendingApproval: number;
        overdue: number;
    }>;

    findHighCostMaintenances(
        organizationId: string,
        threshold: number,
    ): Promise<MaintenanceSchedule[]>;

    getMaintenanceEfficiencyMetrics(organizationId: string): Promise<{
        completionRate: number; // percentage
        averageDelay: number; // in days
        onTimeCompletionRate: number; // percentage
        costVariance: number; // (actual - estimated) / estimated
    }>;

    getTechnicianPerformanceReport(
        organizationId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<
        Array<{
            userId: string;
            completedCount: number;
            inProgressCount: number;
            totalCost: number;
            averageCompletionTime: number;
            onTimeRate: number;
        }>
    >;

    findRecurringIssues(
        organizationId: string,
        lookbackDays: number,
    ): Promise<
        Array<{
            assetId: string;
            issuePattern: string;
            occurrenceCount: number;
            lastOccurrence: Date;
        }>
    >;

    exportMaintenanceReport(
        organizationId: string,
        options: {
            startDate: Date;
            endDate: Date;
            format: 'CSV' | 'JSON' | 'PDF';
        },
    ): Promise<string>;
}
