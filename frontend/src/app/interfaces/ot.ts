export interface Ot {
    id_ot: number;
    order_number: string;
    request_date: string | Date;
    initial_date: string | Date;
    completion_date: string | Date;
    completion_time: number;
    observations: string;
    id_user: number;
    id_task_list: number | null;
    id_priority: number;
    id_ot_state?: number;
    id_tag: number;
    id_task_type: number;
    username?: string;
    task_list_steps?: string;
    priority?: string;
    ot_state?: string;
    final_tag?: string;
    id_asset_type: number;
    edifice?: string;
    floor?: string;
    sector?: string;
    site?: string;
    asset_type?: string;
}
