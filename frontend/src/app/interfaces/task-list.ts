export interface TaskList {
    id_task_list: number;
    asset_type_name: string;
    task_type_name: string;
    id_asset_type: number;
    id_task_type: number;
    [key: `step_${number}`]: string | number;
}
