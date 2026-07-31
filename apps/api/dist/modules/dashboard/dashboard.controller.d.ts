import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getWidgets(): Promise<{
        success: boolean;
        data: ({
            id: string;
            title: string;
            type: string;
            payload: {
                items: {
                    label: string;
                    status: string;
                    iconName: string;
                }[];
                label?: undefined;
                value?: undefined;
                iconName?: undefined;
                change?: undefined;
            };
        } | {
            id: string;
            title: string;
            type: string;
            payload: {
                label: string;
                value: number;
                iconName: string;
                change: {
                    value: string;
                    direction: string;
                    period: string;
                };
                items?: undefined;
            };
        } | {
            id: string;
            title: string;
            type: string;
            payload: {
                label: string;
                value: string;
                iconName: string;
                change: {
                    value: string;
                    direction: string;
                    period: string;
                };
                items?: undefined;
            };
        } | {
            id: string;
            title: string;
            type: string;
            payload: {
                label: string;
                value: number;
                iconName: string;
                items?: undefined;
                change?: undefined;
            };
        })[];
        timestamp: string;
    }>;
}
